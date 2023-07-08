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
			data: Array.from({ length: 1 }, createFakeGame),
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

	it(`returns 404 if there's an error`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			error: {
				message: `Could not find games`,
				statusCode: 404,
			},
		}
		const mockedGamesRespository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(repositoryResponse)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.statusCode).toBe(404)
	})

	it(`return 404 if there are no games`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			data: [],
		}
		const mockedGamesRespository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(repositoryResponse)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.statusCode).toBe(404)
	})

	it(`returns the error message if there's an error`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			error: {
				message: `Could not retrieve games`,
				statusCode: 500,
			},
		}
		const mockedGamesRespository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(repositoryResponse)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.statusCode).toBe(500)
	})

	it(`returns games sorted by the most recent updatedAt date`, async () => {
		const game1 = createFakeGame()
		const game2 = createFakeGame()
		const game3 = createFakeGame()
		const game4 = createFakeGame()
		const repositoryResponse: RepositoryResponse<Game[]> = {
			data: [game1, game2, game3, game4],
		}
		const mockedGamesRespository = mock(GamesRepository)
		when(mockedGamesRespository.list()).thenResolve(repositoryResponse)

		const list = makeList({ gamesRepository: instance(mockedGamesRespository) })
		const response = await list()

		expect(response.body.results).toEqual([game4, game3, game2, game1])
	})
})
