import * as express from 'express'
import { list } from './list'
import { create } from './create'
import { get } from './get'
import { update } from './update'

const todoRouter = express.Router()

todoRouter.get(`/`, list)
todoRouter.post(`/`, create)
todoRouter.get(`/:id`, get)
todoRouter.patch(`/:id`, update)

export default todoRouter
