import {
	DynamoDB,
	ScanCommand,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

let options = {}

if (process.env.IS_OFFLINE) {
	options = {
		region: `localhost`,
		endpoint: `http://localhost:8000`,
	}
}

const dynamoDbClient = new DynamoDB(options)

const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient, {
	marshallOptions: {
		removeUndefinedValues: true,
	},
})

export {
	dynamoDbClient,
	ddbDocClient,
	ScanCommand,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	QueryCommand,
	unmarshall,
	marshall,
}
