import express from 'express'
import serverless from 'serverless-http'
// import cors from 'cors';
import todoRouter from './todos'
import gamesRouter from './games'
import genresRouter from './genres'
import platformsRouter from './platforms'
import { snakeToCamelCase } from './middleware/snake-to-camel-case'

const app = express()

// app.use(cors({origin: "http://localhost:3000"}))
app.use(express.json())

app.use(`/todos`, todoRouter)
app.use(`/games`, snakeToCamelCase, gamesRouter)
app.use(`/genres`, genresRouter)
app.use(`/platforms`, platformsRouter)

app.use((req, res) => {
	return res.status(404).json({
		error: `Not Found`,
	})
})

export const handler = serverless(app)
