import { z } from 'zod'
import { Genre, genreSchema } from '../genres/genre.schema'

const gameRatingSchema = z.object({
	id: z.number(),
	title: z.string(),
	count: z.number(),
	percent: z.number(),
})

const addedByStatusSchema = z.object({
	yet: z.number(),
	owned: z.number(),
	beaten: z.number(),
	toplay: z.number(),
	dropped: z.number(),
	playing: z.number(),
})

export const OEsrbRatingName = {
	Everyone: `Everyone`,
	Teen: `Teen`,
	EveryOne10Plus: `Everyone 10+`,
	Mature: `Mature`,
	AdultsOnly: `Adults Only`,
} as const

const esrbRatingSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
})

const requirementsEn = z.object({
	minimum: z.string(),
	recommended: z.string(),
})

const platformSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	image: z.nullable(z.string()),
	yearEnd: z.nullable(z.number()),
	yearStart: z.nullable(z.number()),
	gamesCount: z.number(),
	imageBackground: z.nullable(z.string()),
	releasedAt: z.nullable(z.string()),
	requirementsEn: z.nullable(requirementsEn),
	requirementsRu: z.nullable(z.string()),
})

export const createGameSchema = z.object({
	slug: z.string(),
	name: z.string(),
	released: z.string(),
	tba: z.boolean(),
	backgroundImage: z.string(),
	rating: z.number(),
	ratingTop: z.number(),
	ratings: z.array(gameRatingSchema),
	ratingsCount: z.number(),
	reviewsTextCount: z.number(),
	added: z.number(),
	addedByStatus: addedByStatusSchema,
	metacritic: z.number(),
	playtime: z.number(),
	suggestionsCount: z.number(),
	esrbRating: esrbRatingSchema,
	platforms: z.array(platformSchema),
	genres: z.array(genreSchema),
	sourceId: z.number().optional(),
})

export const gameSchema = createGameSchema.extend({
	id: z.string().uuid(),
	entityType: z.string(),
	createdAt: z.number(),
	updatedAt: z.number(),
})

export type Platform = z.infer<typeof platformSchema>
export type GameRating = z.infer<typeof gameRatingSchema>
export type AddedByStatus = z.infer<typeof addedByStatusSchema>
export type EsrbRating = z.infer<typeof esrbRatingSchema>
export type CreateGame = z.infer<typeof createGameSchema>
export type Game = z.infer<typeof gameSchema>
export type EsrbRatingName =
	(typeof OEsrbRatingName)[keyof typeof OEsrbRatingName]
export type RequirementsEn = z.infer<typeof requirementsEn>
