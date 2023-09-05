import { z } from 'zod'

const gameGenreDtoSchema = z.object({
	id: z.string().uuid(),
	sourceId: z.number(),
	name: z.string(),
	slug: z.string(),
	added: z.number(),
})

export type gameGenreDto = z.infer<typeof gameGenreDtoSchema>

export const genreSchema = z.object({
	id: z.string().uuid(),
	sourceId: z.number(),
	name: z.string(),
	slug: z.string(),
	gamesCount: z.number(),
	imageBackground: z.string(),
	games: gameGenreDtoSchema.array(),
})

export type Genre = z.infer<typeof genreSchema>
