import * as express from 'express'
import { list } from './list'
import { create } from './create'
import { schemaValidationMiddleware } from '../middleware/schema-validation-middleware'
import { createGameSchema } from './game.schema'

const gameRouter = express.Router()

gameRouter.get(`/`, list)
gameRouter.post(`/`, schemaValidationMiddleware(createGameSchema), create)

export default gameRouter
