import { faker } from '@faker-js/faker'
import {
	Game,
	OEsrbRatingName,
	Platform,
	EsrbRating,
	GameRating,
	AddedByStatus,
	RequirementsEn,
} from '../../src/games/game.schema'

function createGameRating(): GameRating {
	return {
		id: faker.datatype.number(),
		title: faker.lorem.words(),
		count: faker.datatype.number(),
		percent: faker.datatype.float({ min: 0, max: 100 }),
	}
}

function createAddedByStatus(): AddedByStatus {
	return {
		yet: faker.number.int({ min: 0, max: 1_000 }),
		owned: faker.number.int({ min: 0, max: 1_000 }),
		beaten: faker.number.int({ min: 0, max: 1_000 }),
		toplay: faker.number.int({ min: 0, max: 1_000 }),
		dropped: faker.number.int({ min: 0, max: 1_000 }),
		playing: faker.number.int({ min: 0, max: 1_000 }),
	}
}

function createEsrbRating(): EsrbRating {
	const name = faker.helpers.objectValue(OEsrbRatingName)
	const slug = name.toLowerCase().replace(/\s/g, `-`).replace(`+`, `-plus`)
	return {
		id: faker.number.int({ min: 0, max: 1_000 }),
		slug,
		name,
	}
}

function createRequirementsEn(): RequirementsEn {
	return {
		minimum: faker.lorem.sentence(),
		recommended: faker.lorem.sentence(),
	}
}

function createPlatform(): Platform {
	return {
		id: faker.datatype.number(),
		name: faker.system.commonFileName(),
		slug: faker.lorem.slug(),
		image: faker.image.imageUrl(),
		yearEnd: faker.date.past().getFullYear(),
		yearStart: faker.date.past().getFullYear(),
		gamesCount: faker.datatype.number(),
		imageBackground: faker.image.imageUrl(),
		releasedAt: faker.date.past().toISOString(),
		requirementsEn: createRequirementsEn(),
		requirementsRu: faker.lorem.sentence(),
	}
}

export function createFakeGame(overrides: Partial<Game> = {}): Game {
	const game = {
		slug: faker.lorem.slug(),
		name: faker.lorem.words({ min: 1, max: 3 }),
		released: faker.date.past().toISOString(),
		tba: faker.datatype.boolean(),
		backgroundImage: faker.image.imageUrl(),
		rating: faker.datatype.float({ min: 0, max: 5 }),
		ratingTop: faker.datatype.number({ min: 0, max: 5 }),
		ratings: Array.from(
			{ length: faker.datatype.number({ min: 1, max: 10 }) },
			createGameRating
		),
		ratingsCount: faker.datatype.number({ min: 0, max: 1000 }),
		reviewsTextCount: faker.datatype.number({ min: 0, max: 1000 }),
		added: faker.datatype.number(),
		addedByStatus: createAddedByStatus(),
		metacritic: faker.datatype.number({ min: 0, max: 100 }),
		playtime: faker.datatype.number({ min: 0, max: 100 }),
		suggestionsCount: faker.datatype.number({ min: 0, max: 100 }),
		esrbRating: createEsrbRating(),
		platforms: Array.from(
			{ length: faker.datatype.number({ min: 1, max: 5 }) },
			createPlatform
		),
		sourceId: faker.datatype.number(),
		id: faker.datatype.number(),
		entityType: faker.random.word(),
		createdAt: Date.now(),
		updatedAt: Date.now(),
		...overrides,
	}

	return game
}
