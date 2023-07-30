import {
	DynamoDBClient,
	QueryCommandInput,
	QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { Genre } from './genre.schema'

export class GenreRepository {
	constructor(private readonly ddbDocClient: DynamoDBClient) {}

	async getAll() {
		const params: QueryCommandInput = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Genre`,
			}),
			Limit: 100, // The limit should never be reached
		}
		const command = new QueryCommand(params)
		const results = await this.ddbDocClient.send(command)
		const genres = results.Items?.map((item) => unmarshall(item)) as Genre[]
		return { genres }
	}
}
