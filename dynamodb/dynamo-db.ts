import {
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
	QueryCommand,
	ScanCommand,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

let options = {}

if (process.env.IS_OFFLINE) {
	options = {
		region: `localhost`,
		endpoint: `http://localhost:8000`,
	}
}

const ddbDocClient = new DynamoDBClient(options)

export {
	ddbDocClient,
	ScanCommand,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	QueryCommand,
	unmarshall,
	marshall,
}
