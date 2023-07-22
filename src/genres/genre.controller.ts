import { HttpResponse } from '../express-callback'
import { GenreService } from './genre.service'

export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	async getAllGenres(): Promise<HttpResponse> {
		const { genres, error } = await this.genreService.getAll()

		if (!genres || error) {
			if (error) {
				console.error(error)
			}
			return {
				headers: {
					'Content-Type': `application/json`,
				},
				statusCode: error ? 500 : 404,
				body: {
					error: `Genres not found`,
				},
			}
		}

		return {
			headers: {
				'Content-Type': `application/json`,
			},
			statusCode: 200,
			body: genres,
		}
	}
}
