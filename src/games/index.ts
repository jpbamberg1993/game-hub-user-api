import * as express from 'express'
import { schemaValidationMiddleware } from '../middleware/schema-validation-middleware'
import { createGameSchema } from './game.schema'
import { makeExpressCallback } from '../express-callback'
import { GamesRepository } from './games.repository'
import { makeList } from './list'
import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { makeCreateGame } from './create'
import { makeRawgClient } from '../rawg-client'
import { makeSeedGames } from './seed-games'

const rawgClient = makeRawgClient()
const gamesRepository = new GamesRepository(ddbDocClient)
const listGames = makeList({ gamesRepository })
const createGame = makeCreateGame({ gamesRepository })
const seedGames = makeSeedGames(gamesRepository, rawgClient)

const gameRouter = express.Router()
gameRouter.get(`/`, makeExpressCallback(listGames))
gameRouter.post(
	`/`,
	schemaValidationMiddleware(createGameSchema),
	makeExpressCallback(createGame)
)
gameRouter.post(`/seed`, makeExpressCallback(seedGames))
export default gameRouter
