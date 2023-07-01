import { GamesRepository } from './games.repository'
import { HttpRequest, HttpResponse } from '../express-callback'
import { getErrorMessage } from '../utils/get-error-message'

export type CreateGame = (httpRequest: HttpRequest) => Promise<HttpResponse>

type Props = {
	gamesRepository: GamesRepository
}

export function makeCreateGame({ gamesRepository }: Props): CreateGame {
	return async function create(
		httpRequest: HttpRequest
	): Promise<HttpResponse> {
		const { data, error } = await gamesRepository.create(httpRequest.body)

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

		return {
			headers: {
				'Content-Type': `application/json`,
			},
			statusCode: 200,
			body: { results: data },
		}
	}
}
