import {
	DynamoDBClient,
	ScanCommand,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'

let options = {}

if (process.env.IS_OFFLINE) {
	options = {
		region: `localhost`,
		endpoint: `http://localhost:8000`,
	}
}

const dynamoDbClient = new DynamoDBClient(options)

export {
	dynamoDbClient,
	ScanCommand,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	unmarshall,
	marshall,
}
