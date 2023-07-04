import https from 'https'
import { Game } from '../games/game.schema'

export type GameQuery = {
	genre?: string
	platform?: string
	page?: number
}

export type RawgClient = {
	getGames: (query: GameQuery) => Promise<Game[]>
}

export function makeRawgClient(): RawgClient {
	return Object.freeze({
		getGames,
	})

	async function getGames(query: GameQuery): Promise<Game[]> {
		const parameters = new URLSearchParams()
		parameters.set(`key`, process.env.RAWG_API_KEY ?? ``)
		if (query.genre) {
			parameters.set(`genres`, query.genre)
		}
		if (query.platform) {
			parameters.set(`platforms`, query.platform)
		}
		if (query.page) {
			parameters.set(`page`, query.page.toString())
		}

		return new Promise((resolve, reject) => {
			https
				.get(
					`https://api.rawg.io/api/games?${parameters.toString()}`,
					(res) => {
						let data = ``

						res.on(`data`, (chunk) => {
							data += chunk
						})

						res.on(`end`, () => {
							const dataJson = JSON.parse(data)
							resolve(dataJson.results)
						})
					}
				)
				.on(`error`, (err) => {
					console.error(err)
					resolve([] as Game[])
				})
		})
	}
}
