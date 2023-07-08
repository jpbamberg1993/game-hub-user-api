import { v4 as uuid } from 'uuid'
import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
	marshall,
	QueryCommand,
	unmarshall,
	PutItemCommand,
} from '../../dynamodb/dynamo-db'
import { CreateGame, Game } from './game.schema'

export type DataError = {
	statusCode: number
	message: string
}

export type RepositoryResponse<T> = {
	data?: T
	error?: DataError
}

export class GamesRepository {
	constructor(private readonly ddbDocClient: DynamoDBClient) {}

	async list(): Promise<RepositoryResponse<Game[]>> {
		const params = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType and #rating = :rating`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
				'#rating': `rating`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Game`,
				':rating': 3.48,
			}),
		}

		const command = new QueryCommand(params)

		try {
			const { Items } = await this.ddbDocClient.send(command)
			if (!Items) {
				return {
					error: {
						statusCode: 404,
						message: `Could not find games`,
					},
				}
			}
			const games = Items.map((item) => unmarshall(item)) as Game[]
			return {
				data: games,
			}
		} catch (error) {
			console.error(error)
			return {
				error: {
					statusCode: 500,
					message: `Could not retrieve games`,
				},
			}
		}
	}

	async create(game: CreateGame): Promise<RepositoryResponse<Game>> {
		const timestamp = new Date().getTime()

		const params = {
			TableName: process.env.DYNAMODB_TABLE,
			Item: marshall(
				{
					id: uuid(),
					entityType: `Game`,
					createdAt: timestamp,
					updatedAt: timestamp,
					sourceId: 0,
					...game,
				},
				{ removeUndefinedValues: true }
			),
		}

		try {
			await this.ddbDocClient.send(new PutItemCommand(params))
			return {
				data: unmarshall(params.Item) as Game,
			}
		} catch (error) {
			console.error(error)
			return {
				error: {
					statusCode: 500,
					message: `Could not create game`,
				},
			}
		}
	}

	async batchCreate(games: CreateGame[]): Promise<RepositoryResponse<Game[]>> {
		const timestamp = new Date().getTime()

		const params = {
			RequestItems: {
				[process.env.DYNAMODB_TABLE ?? ``]: games.map((game) => {
					return {
						PutRequest: {
							Item: marshall(
								{
									id: uuid(),
									entityType: `Game`,
									createdAt: timestamp,
									updatedAt: timestamp,
									...game,
								},
								{ removeUndefinedValues: true }
							),
						},
					}
				}),
			},
		}

		try {
			await this.ddbDocClient.send(new BatchWriteItemCommand(params))

			return {
				data: params.RequestItems[process.env.DYNAMODB_TABLE ?? ``].map(
					(item) => unmarshall(item.PutRequest?.Item ?? {}) as Game
				),
			}
		} catch (error) {
			console.error(error)
			return {
				error: {
					statusCode: 500,
					message: `Could not create games`,
				},
			}
		}
	}
}
