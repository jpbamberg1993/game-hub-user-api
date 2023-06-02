import {
	dynamoDbClient,
	marshall,
	unmarshall,
	UpdateItemCommand,
} from '../../dynamodb/dynamo-db'

export async function update(req, res) {
	const timestamp = new Date().getTime()
	const { id } = req.params
	const { text, checked } = req.body

	if (!id || typeof id !== `string`) {
		console.error(`Validation Failed`)
		res.status(400).json({ error: `Must provide an id` })
	}

	if (!text || typeof text !== `string` || typeof checked !== `boolean`) {
		console.error(`Validation Failed`)
		res.status(400).json({ error: `Could not create todo item` })
	}

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Key: marshall({
			id,
			entityType: `Todo`,
		}),
		UpdateExpression: `SET #todo_text = :text, #todo_checked = :checked, #todo_updatedAt = :updatedAt`,
		ExpressionAttributeNames: {
			'#todo_text': `text`,
			'#todo_checked': `checked`,
			'#todo_updatedAt': `updatedAt`,
		},
		ExpressionAttributeValues: marshall({
			':text': text,
			':checked': checked,
			':updatedAt': timestamp,
		}),
		ReturnValues: `ALL_NEW`,
	}

	try {
		const { Attributes } = await dynamoDbClient.send(
			new UpdateItemCommand(params)
		)
		res.json(unmarshall(Attributes))
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: `Could not update todo item` })
	}
}
