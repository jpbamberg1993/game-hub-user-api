import { v4 as uuid } from 'uuid'
import {
	BatchWriteItemCommand,
	DynamoDBClient,
	QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
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
	lastKeyId?: Record<string, unknown> | null
	data?: T
	error?: DataError
}

export class GamesRepository {
	constructor(private readonly ddbDocClient: DynamoDBClient) {}

	async list(lastEvaluatedKey: string): Promise<RepositoryResponse<Game[]>> {
		const params: QueryCommandInput = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Game`,
			}),
			Limit: 20,
		}

		if (lastEvaluatedKey) {
			params.ExclusiveStartKey = marshall({
				entityType: `Game`,
				id: lastEvaluatedKey,
			})
		}

		return this.runQuery(params)
	}

	async listByGsi(
		lastEvaluatedKey: string,
		gsiHash: string
	): Promise<RepositoryResponse<Game[]>> {
		const params: QueryCommandInput = {
			TableName: process.env.DYNAMODB_TABLE,
			IndexName: `gsiOneIndex`,
			KeyConditionExpression: `#gsi = :gsiHash`,
			ExpressionAttributeNames: {
				'#gsi': `gsiOnePk`,
			},
			ExpressionAttributeValues: marshall({
				':gsiHash': gsiHash,
			}),
			Limit: 20,
		}

		if (lastEvaluatedKey) {
			params.ExclusiveStartKey = marshall({
				id: lastEvaluatedKey,
				entityType: `Game`,
				gsiOnePk: gsiHash,
			})
		}

		return this.runQuery(params)
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
									...game,
									id: uuid(),
									entityType: `Game`,
									createdAt: timestamp,
									updatedAt: timestamp,
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

	private async runQuery(
		params: QueryCommandInput
	): Promise<RepositoryResponse<Game[]>> {
		const command = new QueryCommand(params)

		try {
			const result = await this.ddbDocClient.send(command)
			if (!result.Items) {
				return {
					error: {
						statusCode: 404,
						message: `Could not find games`,
					},
				}
			}
			const games = result.Items.map((item) => unmarshall(item)) as Game[]
			const lastKey = result?.LastEvaluatedKey
				? unmarshall(result.LastEvaluatedKey)
				: null
			return {
				lastKeyId: lastKey?.id ?? null,
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
}
