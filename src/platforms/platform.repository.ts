import {
	DynamoDBClient,
	QueryCommand,
	QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
import { Platform } from '../games/game.schema'
import { RepositoryResponse } from '../games/games.repository'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export class PlatformRepository {
	constructor(private readonly ddbDocClient: DynamoDBClient) {}

	async list(): Promise<RepositoryResponse<Platform[]>> {
		const params: QueryCommandInput = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Platform`,
			}),
			Limit: 51,
		}

		const command = new QueryCommand(params)

		try {
			const result = await this.ddbDocClient.send(command)
			if (!result.Items) {
				return {
					error: {
						statusCode: 404,
						message: `Could not find platforms`,
					},
				}
			}
			const platforms = result.Items.map((item) =>
				unmarshall(item)
			) as Platform[]
			return {
				data: platforms,
			}
		} catch (e) {
			console.error(e)
			return {
				error: {
					statusCode: 500,
					message: `Could not find platforms`,
				},
			}
		}
	}
}
