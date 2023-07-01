import { marshall, QueryCommand, unmarshall } from '../../dynamodb/dynamo-db'
import { Game } from './game.schema'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export type DataError = {
	statusCode: number
	message: string
}

export type RepositoryResponse<T> = {
	data?: T
	error?: DataError
}

export type GamesRepository = {
	list: () => Promise<RepositoryResponse<Game[]>>
}

type Props = {
	ddbDocClient: DynamoDBClient
}

export function makeGamesRepository({ ddbDocClient }: Props): GamesRepository {
	return Object.freeze({
		list,
	})

	async function list(): Promise<RepositoryResponse<Game[]>> {
		const params = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Game`,
			}),
		}

		const command = new QueryCommand(params)

		try {
			const { Items } = await ddbDocClient.send(command)
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
}
