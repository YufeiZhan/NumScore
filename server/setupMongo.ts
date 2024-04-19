import { MongoClient } from 'mongodb'
import {user1, aliceScore1} from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)


async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("numscore")

  // add data
  console.log("inserting users", await db.collection("users").insertMany([user1] as any))
  console.log("inserting scores", await db.collection("scores").insertMany([aliceScore1] as any))

  process.exit(0)
}

main()
