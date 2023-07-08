import { HttpResponse } from '../express-callback'
import { GamesRepository } from './games.repository'
import { getErrorMessage } from '../utils/get-error-message'

export type ListGames = () => Promise<HttpResponse>

type Props = {
	gamesRepository: GamesRepository
}

export function makeList({ gamesRepository }: Props): ListGames {
	return async function list(): Promise<HttpResponse> {
		const { data, error } = await gamesRepository.list()

		if (error || !data || data.length === 0) {
			return {
				headers: {
					'Content-Type': `application/json`,
				},
				statusCode: error?.statusCode ?? 404,
				body: {
					error: getErrorMessage(error),
				},
			}
		}

		const sortedGames = data.sort((a, b) => b.updatedAt - a.updatedAt)

		return {
			headers: {
				'Content-Type': `application/json`,
			},
			statusCode: 200,
			body: { results: sortedGames },
		}
	}
}
