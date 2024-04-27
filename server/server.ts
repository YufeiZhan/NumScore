import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import session from 'express-session'
import cors from 'cors'
import { Issuer, Strategy, generators } from 'openid-client'
import passport from 'passport'
import { Strategy as CustomStrategy } from 'passport-custom'
import { gitlab } from "./secrets"
import MongoStore from 'connect-mongo'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { ScoreRolePair } from './data'
import { Score, User, Note } from './data'

const DISABLE_SECURITY = process.env.DISABLE_SECURITY
const passportStrategies = [
  ...(DISABLE_SECURITY ? ["disable-security"] : []),
  "oidc",
]

// set up Mongo
const url = process.env.MONGO_URL || 'mongodb://db'
const client = new MongoClient(url)
let db: Db
let scores: Collection<Score> // a collection of db
let users: Collection<User> // a collection of db
const OPERATOR_GROUP_ID = process.env.GROUP || "" //if given NumScoreAdmin then admin page otherwise normal user page

// set up Express, body parsing for both JSON and URL encoded
const app = express()
const port = parseInt(process.env.PORT) || 8131
const externalPort = parseInt(process.env.EXTERNAL_PORT) || port
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({ transport: { target: 'pino-pretty' } })
app.use(expressPinoLogger({ logger }))

// set up CORS - can do multiple origins 
app.use(cors({
  origin: ["http://localhost:8130", "http://localhost:31000"],
  credentials: true,
}))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // the default store is memory-backed, so all sessions will be forgotten every time the server restarts
  // uncomment the following to use a Mongo-backed store that will work with a load balancer
  store: MongoStore.create({
    mongoUrl: url,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))
declare module 'express-session' {
  export interface SessionData {
    credits?: number
  }
}

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
  console.log("💻: Serialize user...")
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log("💻: Deserialize user...")
  done(null, user)
})

// authentication middleware
function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Please log in first. 🎵🎵"})
    return
  }
  next()
}

// authorisation middleware
function checkRole(requiredRoles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const roles = (req.user as any).roles || [];
    const hasRequiredRole = roles.some((role: string) => requiredRoles.includes(role));
    if (hasRequiredRole) {
      next(); // User has one of the required roles, proceed
    } else {
      res.status(403).json({ message: "Access denied: Insufficient permissions." });
      return 
    }
  };
}

// app routes
app.get('/api/login', passport.authenticate(passportStrategies, {
  successReturnToOrRedirect: "/home"
}))

app.get('/api/login-callback', passport.authenticate(passportStrategies, {
  successReturnToOrRedirect: '/home',
  failureRedirect: '/',
}))

app.get('/api/user', checkAuthenticated, (req, res) => {
  console.log("💻: Retrieving user...")
  if(req.user){
    console.log("💻: Rerieved user! ✅")
    res.json(req.user)
  } else{
    console.log("💻: req.user not found ❓")
    res.json({})
  }
})

app.post("/api/logout", (req, res, next) => {
  console.log("💻: Logging out...")
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    console.log("💻: Logged out. ✅")
    res.redirect("/")
  })
})

app.get("/api/scores", checkAuthenticated, checkRole(["user"]), async (req, res) => {
  console.log("💻: Retrieving all scores for the logged in user...")
  const OIDCuser = req.user as any
  const name = OIDCuser.preferred_username
  if (!name) {
    res.status(404)
  } else {
    const user: User | null = await users.findOne({ name })
    console.log("- The user retreived from database using the OICD username:", user?._id)

    if (user) {
      console.log("- User exists: retrieve scores from db")
      const scoresInfo: ScoreRolePair[] = user.scores
      const userScores: Score[] = []
      for (const scoreRolePair of scoresInfo) {
        const _id = scoreRolePair.scoreId

        const score: Score = await scores.findOne({ _id })
        userScores.push(score)
      }
      res.status(200).json(userScores || [])
    } else { // If user not in database yet, add user to the database
      console.log("- User not exists yet: add user to the database using Gitlab's credentials")
      const newUser: User = {_id: OIDCuser.sub, name: OIDCuser.preferred_username, email: OIDCuser.email,password: null,scores: []}
      try { // Sync the new user in the users collection
        users.insertOne(newUser)
        console.log("💻: Completes retrieving all scores for the new user! ✅")
        res.status(200).json([])
      } catch (e) {
        console.error("Error creating user:", e)
        console.log("💻: Error creating new user from OICD in the database ❓")
        res.status(500)
      }
    }
  }
})

app.get("/api/scores/all", checkAuthenticated, checkRole(["admin"]),async(req,res) => {
  console.log("💻: Retreiving all scores from the database (for admin).")
  const retrievedScores: Score[] = await scores.find({}).toArray()
  res.status(200).json(retrievedScores)
})

app.get("/api/score/new", checkAuthenticated, checkRole(["user"]), async (req, res) => {
  console.log("💻: Creating a new score at the backend...")
  const newScore: Score = {
    title: null, author: (req.user as any).preferred_username,
    key: null, timeSignatureTop: null, timeSignatureBase: null,
    tempo: null, time: new Date(), notes: []
  }
  try {
    const insertedScoreId = (await scores.insertOne(newScore)).insertedId
    await users.updateOne(
      { name: (req.user as any).preferred_username, },
      { $push: { scores: { scoreId: insertedScoreId, role: 'Creator' } } }
    )
    console.log("💻: New score created successfully at the backend! ✅")
    res.status(200).json({ status: "ok" })
  } catch (e) {
    console.error("Error creating new score:", e)
    res.status(500)
  }
})

app.get("/api/score/:scoreId", checkAuthenticated, async (req, res) => {
  console.log("💻: Retrieving a particular score of given score id at the backend...",req.params.scoreId)
  const score: Score | null = await scores.findOne(new ObjectId(req.params.scoreId))
  if (score) {
    console.log("💻: Retrieved the wanted score! ✅")
    return res.status(200).json(score)
  } else {
    console.log("💻: No score of that id is found.")
    return res.status(404)
  }
})

app.put("/api/score/:scoreId/newnote", checkAuthenticated, checkRole(["user"]), async (req, res) => {
  console.log("💻: Add a new note...")
  const note: Note = req.body

  const result = await scores.updateOne(
    {_id : new ObjectId(req.params.scoreId) as any},
    { $push: { notes: note } }
  )

  if (result.modifiedCount == 1){
    console.log("💻: Adding a new note completed! ✅")
    res.status(200).json({ status: "ok" })
  } else {
    console.log("💻: Adding a new note failed - nothing is modified ❓")
    res.status(500)
  }
})

app.put("/api/score/:scoreId", checkAuthenticated, checkRole(["user"]), async(req, res) => {
  console.log("💻: Updating the score's setting...")
  const score = req.body

  const result = await scores.updateOne(
    { _id: new ObjectId(req.params.scoreId) as any },
    { $set: { title:score.title, key:score.key, timeSignatureTop:score.timeSignatureTop, timeSignatureBase:score.timeSignatureBase,time:new Date()}},
  )

  if (result.modifiedCount == 1){
    console.log("💻: Updating the score's setting completes! ✅")
    res.status(200).json({ status: "ok" })
  } else {
    console.log("💻: Updating score failed - nothing is modified ❓")
    res.status(500)
  }
})

// connect to Mongo and OpenID, and start the server
client.connect().then(async () => {
  console.log('💻: Connected successfully to MongoDB')
  db = client.db("numscore")
  scores = db.collection('scores')
  users = db.collection('users')

  passport.use("disable-security", new CustomStrategy((req, done) => {
    if (req.query.key !== DISABLE_SECURITY) {
      console.log("you must supply ?key=" + DISABLE_SECURITY + " to log in via DISABLE_SECURITY")
      done(null, false)
    } else {
      done(null, { name: req.query.user, preferred_username: req.query.user, roles: [].concat(req.query.role) })
    }
  }))

  // why is this bracket needed?
  {
    Issuer.discover("https://coursework.cs.duke.edu/").then(issuer => {
      const client = new issuer.Client(gitlab)

      const params = {
        scope: 'openid profile email', //openid has to be one of it
        nonce: generators.nonce(),
        redirect_uri: `http://localhost:${externalPort}/api/login-callback`,
        state: generators.state(),
      }

      function verify(tokenSet: any, userInfo: any, done: (error: any, user: any) => void) {
        console.log('💻: userInfo', userInfo)
        console.log('💻: tokenSet', tokenSet)
        userInfo.roles = userInfo.groups.includes(OPERATOR_GROUP_ID) ? ["admin"] : ["user"] 
        return done(null, userInfo)
      }

      passport.use('oidc', new Strategy({ client, params }, verify))

    })
  }

  // start server
  app.listen(port, () => {
    console.log(`💻: Smoothie server listening on port ${port}`)
  })
})
