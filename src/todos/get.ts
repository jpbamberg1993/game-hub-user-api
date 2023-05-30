import {
	dynamoDbClient,
	GetItemCommand,
	marshall,
	unmarshall,
} from '../../dynamodb/dynamo-db'

export async function get(req, res) {
	const { id } = req.params

	if (!id || typeof id !== `string`) {
		console.error(`Validation Failed`)
		res.status(400).json({ error: `Must provide an id` })
	}

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Key: marshall({ id }),
	}

	try {
		const { Item } = await dynamoDbClient.send(new GetItemCommand(params))
		if (!Item) {
			return res.status(404).json({ error: `Could not find todo item` })
		}
		res.json(unmarshall(Item))
	} catch (error) {
		console.log(error)
		res
			.status(500)
			.json({ error: `Error occurred when querying for todo with id: ${id}` })
	}
}
