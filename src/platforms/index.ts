import express from 'express'
import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { ListPlatforms } from './list-platforms'
import { PlatformRepository } from './platform.repository'
import { makeExpressCallback } from '../express-callback'

const platformRepository = new PlatformRepository(ddbDocClient)
const listPlatforms = new ListPlatforms(platformRepository)

const platformRouter = express.Router()
platformRouter.get(
	`/`,
	makeExpressCallback(listPlatforms.getAllPlatforms.bind(listPlatforms))
)

export default platformRouter
