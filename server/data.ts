export const possibleIngredients = [
  "strawberry",
  "milk",
  "banana",
]

export interface DraftOrder {
  customerId: string
  ingredients: string[]
}

export interface StringIdDocument {
  _id: string // unique id for each mongo object
}

export interface Order extends DraftOrder, StringIdDocument {
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
}

export interface Customer extends StringIdDocument {
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface OperatorWithOrders extends Operator {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}



export interface User {
  _id: string
  name: string
  email: string
  password: string
  scores: ScoreRolePair[] // pair of scores that users are part of
}

export interface Score {
  _id: string
  title: string
  author: string
  key: 'C'|'D'|'E'|'F'|'G'|'A'|'B'|'C#'|'D#'|'#F'|'#G'|'A#'|'Db'|'Eb'|'Gb'|'Ab'|'Bb'
  timeSignatureTop: number
  timeSignatureBase: number
  tempo: number
  time: Date
  notes: Note[]
  role?: Role //Optional
}

export type Role = 'Creator' | 'Editor' | 'Viewer' | null

export interface ScoreRolePair {
  scoreId: string
  role: Role
} 

export interface Note {
  number: 0 |1 |2 |3 |4 |5 |6 |7
  duration: 1 | 0.5 | 0.25 | 0.125 | 0.0625 | 0.03125 | 0.015625 // 1 - 1/64
  pitch: 0 | 1 | 2 | 3 | -1 | -2 | -3 // positive means high pitch and negative means low pitch
}

export const user1 : User = {
  _id: '1',
  name: 'yz858',
  email: 'alice@duke.edu',
  password: '123123',
  scores: [{scoreId: 'Alphabet Song-yz858', role: 'Creator'}]
}

export const aliceScore1 : Score = {
  _id: 'Alphabet Song-yz858', // unique id is score title-username
  title: 'Alphabet Song',
  author: 'Alice',
  key: 'C',
  timeSignatureTop: 4,
  timeSignatureBase: 4,
  tempo: 120,
  time: new Date(2024, 4, 18, 23, 1, 0),
  notes: [
    {"number": 1, "duration": 1, "pitch": 0},
    {"number": 2, "duration": 1, "pitch": 1},
    {"number": 3, "duration": 1, "pitch": 2},
    {"number": 4, "duration": 1, "pitch": 3},
    {"number": 5, "duration": 1, "pitch": -1},
    {"number": 6, "duration": 1, "pitch": -2},
    {"number": 7, "duration": 1, "pitch": -3},
    {"number": 1, "duration": 0.5, "pitch": 0},
    {"number": 2, "duration": 0.5, "pitch": 1},
    {"number": 3, "duration": 0.5, "pitch": 2},
    {"number": 4, "duration": 0.5, "pitch": 3},
    {"number": 5, "duration": 0.5, "pitch": -1},
    {"number": 6, "duration": 0.5, "pitch": -2},
    {"number": 7, "duration": 0.5, "pitch": -3},
    {"number": 1, "duration": 0.25, "pitch": 0},
    {"number": 2, "duration": 0.25, "pitch": 1},
    {"number": 3, "duration": 0.25, "pitch": 2},
    {"number": 4, "duration": 0.25, "pitch": 3},
    {"number": 5, "duration": 0.25, "pitch": -1},
    {"number": 6, "duration": 0.25, "pitch": -2},
    {"number": 7, "duration": 0.25, "pitch": -3},
    {"number": 1, "duration": 0.125, "pitch": 0},
    {"number": 2, "duration": 0.125, "pitch": 1},
    {"number": 3, "duration": 0.125, "pitch": 2},
    {"number": 4, "duration": 0.125, "pitch": 3},
    {"number": 5, "duration": 0.125, "pitch": -1},
    {"number": 6, "duration": 0.125, "pitch": -2},
    {"number": 7, "duration": 0.125, "pitch": -3},
    {"number": 1, "duration": 0.0625, "pitch": 0},
    {"number": 2, "duration": 0.0625, "pitch": 1},
    {"number": 3, "duration": 0.0625, "pitch": 2},
    {"number": 4, "duration": 0.0625, "pitch": 3},
    {"number": 5, "duration": 0.0625, "pitch": -1},
    {"number": 6, "duration": 0.0625, "pitch": -2},
    {"number": 7, "duration": 0.0625, "pitch": -3}
  ]  
}