import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export class PlatformRepository {
	constructor(private readonly ddbDocClient: DynamoDBClient) {}
}
