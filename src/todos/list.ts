import {
	ddbDocClient,
	QueryCommand,
	marshall,
	unmarshall,
} from '../../dynamodb/dynamo-db'
import { Request, Response } from 'express'

export async function list(req: Request, res: Response) {
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		KeyConditionExpression: `#entityType = :entityType`,
		ExpressionAttributeNames: {
			'#entityType': `entityType`,
		},
		ExpressionAttributeValues: marshall({
			':entityType': `Todo`,
		}),
	}

	const command = new QueryCommand(params)

	try {
		const { Items } = await ddbDocClient.send(command)
		if (!Items) {
			return res.status(404).json({ error: `Could not find todos` })
		}
		const items = Items.map((item) => unmarshall(item)).sort(
			(a, b) => b.updatedAt - a.updatedAt
		)
		res.json(items)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: `Could not retrieve todos` })
	}
}
