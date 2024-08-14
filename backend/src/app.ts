import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.listen(() => {
    console.log(`Listening on port ${process.env.PORT}`)
})