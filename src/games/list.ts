import { HttpResponse } from '../express-callback'
import { GamesRepository } from './games.repository'
import { getErrorMessage } from '../utils/get-error-message'
import { HttpRequest } from '../express-callback'

export type ListGames = (httpRequest: HttpRequest) => Promise<HttpResponse>

type Props = {
	gamesRepository: GamesRepository
}

export function makeList({ gamesRepository }: Props): ListGames {
	return async function list(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { lastEvaluatedKey } = httpRequest.query

		const { lastKeyId, data, error } = await gamesRepository.list(
			lastEvaluatedKey
		)

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
			body: { count: sortedGames.length, lastKeyId, results: sortedGames },
		}
	}
}
