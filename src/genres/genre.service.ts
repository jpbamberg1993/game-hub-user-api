import { DataError } from '../games/games.repository'
import { GenreRepository } from './genre.repository'
import { Genre } from './genre.schema'

type ServerResponse = {
	genres?: Genre[] | null
	error?: DataError | null
}

export class GenreService {
	constructor(private readonly genreRepository: GenreRepository) {}

	async getAll(): Promise<ServerResponse> {
		console.log(`--> [GenreService] getAll`)
		try {
			const { genres } = await this.genreRepository.getAll()
			return {
				genres,
			}
		} catch (error) {
			console.error(error)
			return {
				error: {
					statusCode: 500,
					message: `Could not get genres`,
				},
			}
		}
	}
}
