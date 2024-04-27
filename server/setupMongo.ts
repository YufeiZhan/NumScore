import { MongoClient } from 'mongodb'
import {user1, aliceScore1} from './data'

// Connection URL
const url = 'mongodb://db'
const client = new MongoClient(url)


async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("numscore")

  // add data
  // console.log("inserting users", await db.collection("users").insertMany([user1] as any))
  // Create empty users collection to test OICD user creation in db
  console.log("creating users collection", await db.createCollection("users")) 
  console.log("inserting scores", await db.collection("scores").insertMany([aliceScore1] as any))

  process.exit(0)
}

main()
