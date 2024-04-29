export interface User {
  _id: string // uses the 'sub' field of Gitlab, which is the unique Gitlab ID of the user
  name: string // the name user wants to use in this application, default to be Gitlab's 'nickname' field
  email: string // same as the 'email' field of Gitlab
  password: string | null // default ot be null because of OIDC, user can set up one lateron
  scores: ScoreRolePair[] // pair of scores that users are part of
}

export interface Score {
  _id?: string // let database generates id
  title?: string | null
  author?: string | null
  key?: 'C'|'D'|'E'|'F'|'G'|'A'|'B'|'C#'|'D#'|'#F'|'#G'|'A#'|'Db'|'Eb'|'Gb'|'Ab'|'Bb'| null
  timeSignatureTop?: number | null
  timeSignatureBase?: number| null
  tempo?: number | null
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
  color?: "black" | "blue" | "red"
}

// export const user1 : User = {
//   _id: 'dummyuser1',
//   name: 'dm111',
//   email: 'dummy@duke.edu',
//   password: null,
//   scores: [{scoreId: 'Alphabet Song-1', role: 'Creator'}]
// }

export const aliceScore1 : Score = {
  _id: 'Alphabet Song-1', // unique id is score title-_id
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