import { mock, instance, when, verify } from 'ts-mockito'
import { GamesRepository, RepositoryResponse } from './games.repository'
import { makeList } from './list'
import { Game } from './game.schema'
import { createFakeGame } from '../../test/fixtures/game'
import { makeHttpRequest } from '../../test/fixtures/http-request'
import { v4 as uuid } from 'uuid'

describe(`list`, () => {
	let lastEvaluatedKey = ``
	let mockedHttpRequest = makeHttpRequest()

	beforeEach(() => {
		lastEvaluatedKey = uuid()
		mockedHttpRequest = makeHttpRequest({
			query: {
				lastEvaluatedKey,
			},
		})
	})

	it(`invokes the GamesRepository list method with the lastEvaluatedKey`, async () => {
		const mockedGamesRepository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve({
			data: [],
		})

		verify(mockedGamesRepository.list(lastEvaluatedKey)).never()

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		await list(mockedHttpRequest)

		verify(mockedGamesRepository.list(lastEvaluatedKey)).once()
		verify(mockedGamesRepository.list(``)).never()
	})

	it(`invokes the GamesRepository.list() method`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: [],
		}
		const mockedGamesRepository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(listOfGames)

		verify(mockedGamesRepository.list(lastEvaluatedKey)).never()

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		await list(mockedHttpRequest)

		verify(mockedGamesRepository.list(lastEvaluatedKey)).once()
	})

	it(`returns 200`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: Array.from({ length: 1 }, createFakeGame),
		}
		const mockedGamesRepository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(listOfGames)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.statusCode).toBe(200)
	})

	it(`returns the list of games`, async () => {
		const listOfGames: RepositoryResponse<Game[]> = {
			data: Array.from({ length: 2 }, createFakeGame),
		}
		const mockedGamesRepository: GamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(listOfGames)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.body.results).toEqual(listOfGames.data)
	})

	it(`returns 404 if there's an error`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			error: {
				message: `Could not find games`,
				statusCode: 404,
			},
		}
		const mockedGamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(
			repositoryResponse
		)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.statusCode).toBe(404)
	})

	it(`return 404 if there are no games`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			data: [],
		}
		const mockedGamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(
			repositoryResponse
		)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.statusCode).toBe(404)
	})

	it(`returns the error message if there's an error`, async () => {
		const repositoryResponse: RepositoryResponse<Game[]> = {
			error: {
				message: `Could not retrieve games`,
				statusCode: 500,
			},
		}
		const mockedGamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(
			repositoryResponse
		)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.statusCode).toBe(500)
	})

	it(`returns games sorted by the most recent updatedAt date`, async () => {
		const game1 = createFakeGame({
			updatedAt: new Date(`2020-01-01`).getTime(),
		})
		const game2 = createFakeGame({
			updatedAt: new Date(`2020-01-02`).getTime(),
		})
		const game3 = createFakeGame({
			updatedAt: new Date(`2020-01-03`).getTime(),
		})
		const game4 = createFakeGame({
			updatedAt: new Date(`2020-01-04`).getTime(),
		})
		const repositoryResponse: RepositoryResponse<Game[]> = {
			data: [game1, game2, game3, game4],
		}
		const mockedGamesRepository = mock(GamesRepository)
		when(mockedGamesRepository.list(lastEvaluatedKey)).thenResolve(
			repositoryResponse
		)

		const list = makeList({ gamesRepository: instance(mockedGamesRepository) })
		const response = await list(mockedHttpRequest)

		expect(response.body.results).toEqual([game4, game3, game2, game1])
	})
})
