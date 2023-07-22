import { HttpRequest } from '../express-callback'
import { GamesRepository } from './games.repository'
import { RawgClient, GameQuery } from '../rawg-client'
import { convertKeysToCamelCase } from '../middleware/snake-to-camel-case'
import {
	CreateGame,
	GameRating,
	AddedByStatus,
	EsrbRating,
	Platform,
} from './game.schema'

export type RawgGame = {
	id: number
	name: string
	slug: string
	released: string
	tba: boolean
	backgroundImage: string
	rating: number
	ratingTop: number
	ratings: GameRating[]
	ratingsCount: number
	reviewsTextCount: number
	added: number
	addedByStatus: AddedByStatus
	metacritic: number
	playtime: number
	suggestionsCount: number
	esrbRating: EsrbRating
	platforms: Platform[]
}

export function makeSeedGames(
	gamesRepository: GamesRepository,
	rawgClient: RawgClient
) {
	return async function seedGames(httpRequest: HttpRequest) {
		const { genre, platform } = httpRequest.query

		for (let i = 1; i <= 1000; i += 10) {
			const tasks: Promise<void>[] = []
			for (let j = i; j <= i + 10; j++) {
				tasks.push(fetchAndCreateGames({ genre, platform, page: j }))
			}
			await Promise.all(tasks)
		}

		return {
			headers: {
				'Content-Type': `text/plain`,
			},
			statusCode: 201,
			body: `Games seeded`,
		}
	}

	async function fetchAndCreateGames(gamesQuery: GameQuery) {
		const data = await fetchGames(gamesQuery)
		await createGames(data)
		console.log(`--> Fetched and created games for page ${gamesQuery.page}`)
	}

	async function fetchGames(gamesQuery: GameQuery) {
		const data = await rawgClient.getGames(gamesQuery)
		if (!data) {
			throw new Error(`No games found`)
		}
		return data
	}

	async function createGames(data: RawgGame[]) {
		const games: CreateGame[] = data.map((game) => mapRawgGameToGame(game))

		const createdGames = await gamesRepository.batchCreate(games)
		if (!createdGames) {
			throw new Error(`No games created`)
		}
		return createdGames
	}

	function mapRawgGameToGame(rawgGame: RawgGame): CreateGame {
		const {
			id,
			name,
			slug,
			released,
			tba,
			backgroundImage,
			rating,
			ratingTop,
			ratings,
			ratingsCount,
			reviewsTextCount,
			added,
			addedByStatus,
			metacritic,
			playtime,
			suggestionsCount,
			esrbRating,
			platforms,
		} = convertKeysToCamelCase(rawgGame) as RawgGame

		return {
			sourceId: id,
			name,
			slug,
			released,
			tba,
			backgroundImage,
			rating,
			ratingTop,
			ratings,
			ratingsCount,
			reviewsTextCount,
			added,
			addedByStatus,
			metacritic,
			playtime,
			suggestionsCount,
			esrbRating,
			platforms,
		}
	}
}
