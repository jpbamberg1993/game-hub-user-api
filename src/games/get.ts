import { GamesRepository } from './games.repository'
import { HttpRequest } from '../express-callback'

interface Props {
	gamesRepository: GamesRepository
}

export function makeGet({ gamesRepository }: Props) {
	return async function get(httpRequest: HttpRequest) {
		const { id } = httpRequest.params
		const result = await gamesRepository.getById(id)
		return {
			headers: {
				'Content-Type': `application/json`,
			},
			statusCode: 200,
			body: result.data,
		}
	}
}
