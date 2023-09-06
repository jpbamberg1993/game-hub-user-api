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
		const { lastEvaluatedKey, genres } = httpRequest.query

		const { lastKeyId, data, error } = await fetchGames(
			lastEvaluatedKey as string,
			genres as string
		)

		if (error) {
			return {
				headers: {
					'Content-Type': `string`,
				},
				statusCode: error?.statusCode ?? 404,
				body: {
					error: getErrorMessage(error),
				},
			}
		}

		if (!data || data.length === 0) {
			return {
				headers: {
					'Content-Type': `string`,
				},
				statusCode: 204,
				body: {
					error: `No games found`,
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

	async function fetchGames(lastEvaluatedKey: string, genres: string) {
		if (genres) {
			const genreHash = `Genre#${genres}`
			return await gamesRepository.listByGsi(lastEvaluatedKey, genreHash)
		} else {
			return await gamesRepository.list(lastEvaluatedKey)
		}
	}
}
