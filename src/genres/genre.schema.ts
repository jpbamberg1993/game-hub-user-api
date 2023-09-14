import { z } from 'zod'

const gameGenreDtoSchema = z.object({
	id: z.string().uuid(),
	sourceId: z.number(),
	name: z.string(),
	slug: z.string(),
	added: z.number(),
})

export type gameGenreDto = z.infer<typeof gameGenreDtoSchema>

export const createGenreSchema = z.object({
	sourceId: z.number(),
	name: z.string(),
	slug: z.string(),
	gamesCount: z.number(),
	imageBackground: z.string(),
})

export const genreSchema = createGenreSchema.extend({
	id: z.string().uuid(),
})

export type Genre = z.infer<typeof genreSchema>
