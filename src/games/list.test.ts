import { mock, instance, when, verify } from 'ts-mockito'
import { GamesRepository, RepositoryResponse } from './games.repository'
import { makeList } from './list'
import { Game } from './game.schema'
import { createFakeGame } from '../../test/fixtures/game'

describe(`list`, () => {
	it(`invokes the GamesRepository.list() method`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: [],
		}
		const mockedGamesRespository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(listOfGames)

		verify(mockedGamesRespository.list()).never()

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		await list()

		verify(mockedGamesRespository.list()).once()
	})

	it(`returns 200`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: [],
		}
		const mockedGamesRespository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(listOfGames)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.statusCode).toBe(200)
	})

	it(`returns the list of games`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: Array.from({ length: 2 }, createFakeGame),
		}
		const mockedGamesRespository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(listOfGames)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.body.results).toEqual(listOfGames.data)
	})
})
