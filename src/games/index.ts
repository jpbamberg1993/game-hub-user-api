import * as express from 'express'
import { create } from './create'
import { schemaValidationMiddleware } from '../middleware/schema-validation-middleware'
import { createGameSchema } from './game.schema'
import { makeExpressCallback } from '../express-callback'
import { makeGamesRepository } from './games.repository'
import { makeList } from './list'
import { ddbDocClient } from '../../dynamodb/dynamo-db'

const gamesRepository = makeGamesRepository({ ddbDocClient })
const list = makeList({ gamesRepository })

const gameRouter = express.Router()
gameRouter.get(`/`, makeExpressCallback(list))
gameRouter.post(`/`, schemaValidationMiddleware(createGameSchema), create)
export default gameRouter
