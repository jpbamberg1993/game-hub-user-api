import {
	ddbDocClient,
	marshall,
	PutItemCommand,
	unmarshall,
} from '../../dynamodb/dynamo-db'
import { v4 as uuid4 } from 'uuid'

export async function create(req, res) {
	const timestamp = new Date().getTime()
	const { text } = req.body
	if (!text || typeof text !== `string`) {
		console.error(`Validation Failed`)
		res.status(400).json({ error: `Could not create todo item` })
	}

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: marshall({
			id: uuid4(),
			text: text,
			checked: false,
			entityType: `Todo`,
			createdAt: timestamp,
			updatedAt: timestamp,
		}),
	}

	try {
		await ddbDocClient.send(new PutItemCommand(params))
		return res.json(unmarshall(params.Item))
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: `Could not create todo item` })
	}
}
