import { marshall, QueryCommand, unmarshall } from '../../dynamodb/dynamo-db'

export type GamesRepository = {
	list: () => Promise<any>
}

export function makeGamesRepository({ ddbDocClient }): GamesRepository {
	return Object.freeze({
		list,
	})

	async function list() {
		const params = {
			TableName: process.env.DYNAMODB_TABLE,
			KeyConditionExpression: `#entityType = :entityType`,
			ExpressionAttributeNames: {
				'#entityType': `entityType`,
			},
			ExpressionAttributeValues: marshall({
				':entityType': `Game`,
			}),
		}

		const command = new QueryCommand(params)

		try {
			const { Items } = await ddbDocClient.send(command)
			if (!Items) {
				return []
			}
			return Items.map((item) => unmarshall(item))
		} catch (error) {
			console.error(error)
			return { error: `Could not retrieve games` }
		}
	}
}
