import express from 'express'
import serverless from 'serverless-http'
// import cors from 'cors';
import todoRouter from './todos'
import gamesRouter from './games'

const app = express()

// app.use(cors({origin: "http://localhost:3000"}))
app.use(express.json())

app.use(`/todos`, todoRouter)
app.use(`/games`, gamesRouter)

app.use((req, res) => {
	return res.status(404).json({
		error: `Not Found`,
	})
})

export const handler = serverless(app)
