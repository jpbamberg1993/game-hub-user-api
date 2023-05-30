import {
	dynamoDbClient,
	ScanCommand,
	unmarshall,
} from '../../dynamodb/dynamo-db'

export async function list(req, res) {
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
	}

	try {
		const { Items } = await dynamoDbClient.send(new ScanCommand(params))
		if (!Items) {
			return res.status(404).json({ error: `Could not find todos` })
		}
		const items = Items.map((item) => unmarshall(item)).sort(
			(a, b) => b.updatedAt - a.updatedAt
		)
		res.json(items)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: `Could not retrieve todos` })
	}
}
