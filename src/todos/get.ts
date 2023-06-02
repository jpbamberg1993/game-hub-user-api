import { dynamoDbClient, marshall, unmarshall } from '../../dynamodb/dynamo-db'

export async function get(req, res) {
	const { id } = req.params

	if (!id || typeof id !== `string`) {
		console.error(`Validation Failed`)
		res.status(400).json({ error: `Must provide an id` })
	}

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		KeyConditionExpression: `#pk = :id and #sk = :entityType`,
		ExpressionAttributeNames: {
			'#pk': `id`,
			'#sk': `entityType`,
		},
		ExpressionAttributeValues: marshall({
			':id': id,
			':entityType': `Todo`,
		}),
	}

	try {
		const { Items } = await dynamoDbClient.query(params)
		if (!Items) {
			return res.status(404).json({ error: `Could not find todo item` })
		}
		res.json(unmarshall({ ...Items[0] }))
	} catch (error) {
		console.log(error)
		res
			.status(500)
			.json({ error: `Error occurred when querying for todo with id: ${id}` })
	}
}
