import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import session from 'express-session'
import cors from 'cors'
import { Issuer, Strategy, generators } from 'openid-client'
import passport from 'passport'
import { gitlab } from "./secrets"
import MongoStore from 'connect-mongo'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Customer, CustomerWithOrders, DraftOrder, Operator, OperatorWithOrders, Order, ScoreRolePair, possibleIngredients } from './data'
import { Score, User } from './data'


// set up Mongo
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let scores: Collection<Score> // a collection of db
let users: Collection<User> // a collection of db

// set up Express, body parsing for both JSON and URL encoded
const app = express()
const port = parseInt(process.env.PORT) || 8131
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({transport: {target: 'pino-pretty'}})
app.use(expressPinoLogger({ logger }))

// set up CORS
app.use(cors({
  origin: "http://localhost:8131",
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
    mongoUrl: 'mongodb://127.0.0.1:27017',
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
  console.log("serializeUser", user)
  done(null, user) 
})
passport.deserializeUser((user, done) => {
  console.log("deserializeUser", user)
  done(null, user)
})

// app routes
app.get('/api/login', passport.authenticate('oidc', {
  successReturnToOrRedirect: "http://localhost:8130/"
}))

app.get('/api/login-callback', passport.authenticate('oidc', {
  successReturnToOrRedirect: 'http://localhost:8130/home',
  failureRedirect: 'http://localhost:8130/',
}))

app.get('/api/user', (req, res) => {
  console.log("testtest" + req.user)
  res.json(req.user || {})
}) // TODO

app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
})

// Get all scores under the specified user
app.get("/api/scores", async (req, res) => {
    const user = req.user as any
    console.log("Retreiving user for /api/scores api", user)
    const name = user.preferred_username
    console.log("Name of the OICD user is", name)
    if (!name) {
      res.status(404)
    } else {
      const user : User | null = await users.findOne({ name })
      console.log("The user retreived from database using the OICD username:",user)

      if (user) {
        const scoresInfo : ScoreRolePair[] = user.scores
        const userScores : Score[] = []
        for (const scoreRolePair of scoresInfo){
          const _id = scoreRolePair.scoreId
          const role = scoreRolePair.role
    
          const score : Score = await scores.findOne({ _id })
          score.role = role
          userScores.push(score)
        }
        console.log(userScores)
        res.status(200).json(userScores || [])
      } else{ // If user not in database yet, add user to the database
        const response = await fetch("/api/user",{method:'POST',
                                                  headers: {'Content-Type': 'application/json'}})
        res.status(response.status)
      }
    }
})

app.get("/api/score/:scoreId", async(req, res) => {
  const score : Score | null = await scores.findOne({ _id: req.params.scoreId })
  if (score) {
    return res.status(200).json(score)
  } else {
    return res.status(404)
  }
})

// Assumed that the user can only be created when first logging in using Giltab OIDC
app.post("/api/user",(req,res) => {
    const OIDCUser = req.user as any
    const newUser : User = { _id: OIDCUser.sub,
                            name: OIDCUser.nickname,
                            email: OIDCUser.email,
                            password: null,
                            scores: []}
    try {
      users.insertOne(newUser)
      res.status(200)
    } catch (e) {
      console.error("Error creating user:", e)
      res.status(500)
    }
})

// app.get("/api/possible-ingredients", (req, res) => {
//   res.status(200).json(possibleIngredients)
// })

// app.get("/api/orders", async (req, res) => {
//   res.status(200).json(await orders.find({ state: { $ne: "draft" }}).toArray())
// })

// app.get("/api/customer/:customerId", async (req, res) => {
//   const _id = req.params.customerId
//   const customer: Partial<CustomerWithOrders> | null = await customers.findOne({ _id })
//   if (customer == null) {
//     res.status(404).json({ _id })
//     return
//   }
//   customer.orders = await orders.find({ customerId: _id, state: { $ne: "draft" } }).toArray()
//   res.status(200).json(customer)
// })

// app.get("/api/operator/:operatorId", async (req, res) => {
//   const _id = req.params.operatorId
//   const operator: Partial<OperatorWithOrders> | null = await operators.findOne({ _id })
//   if (operator == null) {
//     res.status(404).json({ _id })
//     return
//   }
//   operator.orders = await orders.find({ operatorId: _id }).toArray()
//   res.status(200).json(operator)
// })

// app.get("/api/customer/:customerId/draft-order", async (req, res) => {
//   const { customerId } = req.params

//   // TODO: validate customerId

//   const draftOrder = await orders.findOne({ state: "draft", customerId })
//   res.status(200).json(draftOrder || { customerId, ingredients: [] }) //if nothing found, create a legit one
// })

// app.put("/api/customer/:customerId/draft-order", async (req, res) => {
//   const order: DraftOrder = req.body

//   // TODO: validate customerId

//   const result = await orders.updateOne(
//     {
//       customerId: req.params.customerId,
//       state: "draft",
//     },
//     {
//       $set: { 
//         ingredients: order.ingredients
//       }
//     },
//     {
//       upsert: true // if not found, make a new document: update otherwise make a new one,
//     }              // which simplies the logic to check wether that order exists or not
//   )
//   res.status(200).json({ status: "ok" })
// })


// app.post("/api/customer/:customerId/submit-draft-order", async (req, res) => {
//   const result = await orders.updateOne( 
//     { // find the order with this specified customer id and state in 'draft'
//       customerId: req.params.customerId,
//       state: "draft",
//     },
//     {
//       $set: { // operator in MongoDB that sets specified key-value pairs
//         state: "queued",
//       }
//     }
//   )
//   if (result.modifiedCount === 0) {
//     res.status(400).json({ error: "no draft order" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })

// app.put("/api/order/:orderId", async (req, res) => {
//   const order: Order = req.body

//   // TODO: validate order object

//   const condition: any = {
//     _id: new ObjectId(req.params.orderId),
//     state: { 
//       $in: [
//         // because PUT is idempotent, ok to call PUT twice in a row with the existing state
//         order.state
//       ]
//     },
//   }
//   switch (order.state) {
//     case "blending":
//       condition.state.$in.push("queued")
//       // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
//       condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
//       break
//     case "done":
//       condition.state.$in.push("blending")
//       condition.operatorId = order.operatorId
//       break
//     default:
//       // invalid state
//       res.status(400).json({ error: "invalid state" })
//       return
//   }
  
//   const result = await orders.updateOne(
//     condition,
//     {
//       $set: {
//         state: order.state,
//         operatorId: order.operatorId,
//       }
//     }
//   )

//   if (result.matchedCount === 0) {
//     res.status(400).json({ error: "orderId does not exist or state change not allowed" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })


// connect to Mongo and OpenID, and start the server
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("numscore")
  scores = db.collection('scores')
  users = db.collection('users')

  // why is this bracket needed?
  {
    Issuer.discover("https://coursework.cs.duke.edu/").then(issuer => {
      const client = new issuer.Client(gitlab)

      const params = {
        scope: 'openid profile email', //openid has to be one of it
        nonce: generators.nonce(),
        redirect_uri: 'http://localhost:8131/api/login-callback', 
        state: generators.state(),
      }

      function verify(tokenSet: any, userInfo: any, done: (error: any, user: any) => void) {
        console.log('userInfo', userInfo)
        console.log('tokenSet', tokenSet)
        return done(null, userInfo)
      }

      passport.use('oidc', new Strategy({ client, params }, verify))

    })
  }

  // start server
  app.listen(port, () => {
    console.log(`Smoothie server listening on port ${port}`)
  })
})
