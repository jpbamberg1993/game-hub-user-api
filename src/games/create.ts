import {
	ddbDocClient,
	marshall,
	PutItemCommand,
	unmarshall,
} from '../../dynamodb/dynamo-db'
import { v4 as uuid } from 'uuid'

export async function create(req, res) {
	const timestamp = new Date().getTime()

	const {
		slug,
		name,
		released,
		tba,
		backgroundImage,
		rating,
		ratingTop,
		ratings,
		ratingsCount,
		reviewsTextCount,
		added,
		addedByStatus,
		metacritic,
		playtime,
		suggestionsCount,
		esrbRating,
		platforms,
	} = req.body

	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: marshall(
			{
				id: uuid(),
				entityType: `Game`,
				createdAt: timestamp,
				updatedAt: timestamp,
				sourceId: 1,
				slug,
				name,
				released,
				tba,
				backgroundImage,
				rating,
				ratingTop,
				ratings,
				ratingsCount,
				reviewsTextCount,
				added,
				addedByStatus,
				metacritic,
				playtime,
				suggestionsCount,
				esrbRating,
				platforms,
			},
			{ removeUndefinedValues: true }
		),
	}

	try {
		await ddbDocClient.send(new PutItemCommand(params))
		return res.json(unmarshall(params.Item))
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: `Could not create todo item` })
	}
}
