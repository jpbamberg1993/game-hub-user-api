import * as express from 'express'
import { schemaValidationMiddleware } from '../middleware/schema-validation-middleware'
import { createGameSchema, getByIdSchema } from './game.schema'
import { makeExpressCallback } from '../express-callback'
import { GamesRepository } from './games.repository'
import { makeList } from './list'
import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { makeCreateGame } from './create'
import { makeGet } from './get'

const gamesRepository = new GamesRepository(ddbDocClient)
const listGames = makeList({ gamesRepository })
const createGame = makeCreateGame({ gamesRepository })
const getGame = makeGet({ gamesRepository })

const gameRouter = express.Router()
gameRouter.get(`/`, makeExpressCallback(listGames))
gameRouter.get(
	`/:id`,
	schemaValidationMiddleware({ params: getByIdSchema }),
	makeExpressCallback(getGame)
)
gameRouter.post(
	`/`,
	schemaValidationMiddleware({ body: createGameSchema }),
	makeExpressCallback(createGame)
)

export default gameRouter
