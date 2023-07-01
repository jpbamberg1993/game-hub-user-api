import { HttpRequest, HttpResponse } from '../express-callback'
import { DataError, GamesRepository } from './games.repository'
import { Nullable } from '../types/utility-types'

export type ListGames = (httpRequest: HttpRequest) => Promise<HttpResponse>

type Props = {
	gamesRepository: GamesRepository
}

export function makeList({ gamesRepository }: Props): ListGames {
	return async function list(): Promise<HttpResponse> {
		const { data, error } = await gamesRepository.list()

		if (error || !data) {
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

	function getErrorMessage(error: Nullable<DataError>) {
		if (error && error.statusCode < 500) {
			return error.message
		}
		return `An unknown error occurred.`
	}
}
