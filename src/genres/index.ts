import * as express from 'express'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { GenreRepository } from './genre.repository'
import { ddbDocClient } from '../../dynamodb/dynamo-db'
import { makeExpressCallback } from '../express-callback'

const genreRepository = new GenreRepository(ddbDocClient)
const genreService = new GenreService(genreRepository)
const genreController = new GenreController(genreService)

const genreRouter = express.Router()
genreRouter.get(
	`/`,
	makeExpressCallback(genreController.getAllGenres.bind(genreController))
)
export default genreRouter
