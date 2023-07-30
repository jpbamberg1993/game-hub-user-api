import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { ListPlatforms } from './list-platforms'
import { PlatformRepository } from './platform.repository'
import express from 'express'

const platformRepository = new PlatformRepository(ddbDocClient)
const listPlatforms = new ListPlatforms(platformRepository)

const platformRouter = express.Router()
platformRouter.get(`/`, listPlatforms.getAllPlatforms.bind(listPlatforms))

export default platformRouter
