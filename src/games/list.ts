import { Request, Response } from 'express'
import { HttpRequest, HttpResponse } from '../express-callback'
import { GamesRepository } from './games.repository'

export type ListGames = (httpRequest: HttpRequest) => Promise<HttpResponse>

type Props = {
	gamesRepository: GamesRepository
}

export function makeList({ gamesRepository }: Props): ListGames {
	return async function list(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const games = await gamesRepository.list()
			if (!games) {
				return {
					headers: {
						'Content-Type': `application/json`,
					},
					statusCode: 404,
					body: { error: `Could not find games` },
				}
			}
			const sortedGames = games.sort((a, b) => b.updatedAt - a.updatedAt)
			return {
				headers: {
					'Content-Type': `application/json`,
				},
				statusCode: 200,
				body: { results: sortedGames },
			}
		} catch (error) {
			console.log(error)
			res.status(500).json({ error: `Could not retrieve games` })
		}
	}
}
