import * as express from 'express'
import { list } from './list'
import { create } from './create'

const gameRouter = express.Router()

gameRouter.get(`/`, list)
gameRouter.post(`/`, create)

export default gameRouter
