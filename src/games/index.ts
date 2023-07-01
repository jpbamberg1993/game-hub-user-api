import * as express from 'express'
import { schemaValidationMiddleware } from '../middleware/schema-validation-middleware'
import { createGameSchema } from './game.schema'
import { makeExpressCallback } from '../express-callback'
import { makeGamesRepository } from './games.repository'
import { makeList } from './list'
import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { makeCreateGame } from './create'

const gamesRepository = makeGamesRepository({ ddbDocClient })
const listGames = makeList({ gamesRepository })
const createGame = makeCreateGame({ gamesRepository })

const gameRouter = express.Router()
gameRouter.get(`/`, makeExpressCallback(listGames))
gameRouter.post(
	`/`,
	schemaValidationMiddleware(createGameSchema),
	makeExpressCallback(createGame)
)
export default gameRouter
