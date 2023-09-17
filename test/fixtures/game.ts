import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'
import {
	AddedByStatus,
	CreateGame,
	CreateGenre,
	EsrbRating,
	Game,
	GameRating,
	OEsrbRatingName,
	Platform,
	RequirementsEn,
} from '../../src/games/game.schema'

function createGameRating(): GameRating {
	return {
		id: faker.number.int(),
		title: faker.lorem.words(),
		count: faker.number.int(),
		percent: faker.number.float({ min: 0, max: 100 }),
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
		id: faker.number.int({ min: 0, max: 1_000 }),
		name: faker.system.commonFileName(),
		slug: faker.lorem.slug(),
		image: faker.image.urlLoremFlickr(),
		yearEnd: faker.date.past().getFullYear(),
		yearStart: faker.date.past().getFullYear(),
		gamesCount: faker.number.int({ min: 0, max: 1_000 }),
		imageBackground: faker.image.urlLoremFlickr(),
		releasedAt: faker.date.past().toISOString(),
		requirementsEn: createRequirementsEn(),
		requirementsRu: faker.lorem.sentence(),
	}
}

function createGenre(): CreateGenre {
	return {
		sourceId: faker.number.int({ min: 0, max: 1_000 }),
		name: faker.lorem.words(),
		slug: faker.lorem.slug(),
		gamesCount: faker.number.int({ min: 0, max: 1_000 }),
		imageBackground: faker.image.urlLoremFlickr(),
	}
}

export function createFakeGame(overrides: Partial<Game> = {}): Game {
	const gameId = uuid()

	return {
		slug: faker.lorem.slug(),
		name: faker.lorem.words({ min: 1, max: 3 }),
		released: faker.date.past().toISOString(),
		tba: faker.datatype.boolean(),
		backgroundImage: faker.image.urlLoremFlickr(),
		rating: faker.number.float({ min: 0, max: 5 }),
		ratingTop: faker.number.int({ min: 0, max: 5 }),
		ratings: Array.from(
			{ length: faker.number.int({ min: 1, max: 10 }) },
			createGameRating
		),
		ratingsCount: faker.number.int({ min: 0, max: 1000 }),
		reviewsTextCount: faker.number.int({ min: 0, max: 1000 }),
		added: faker.number.int({ min: 0, max: 1000 }),
		addedByStatus: createAddedByStatus(),
		metacritic: faker.number.int({ min: 0, max: 100 }),
		playtime: faker.number.int({ min: 0, max: 300 }),
		suggestionsCount: faker.number.int({ min: 0, max: 100 }),
		esrbRating: createEsrbRating(),
		platforms: Array.from(
			{ length: faker.number.int({ min: 1, max: 5 }) },
			createPlatform
		),
		genres: Array.from(
			{ length: faker.number.int({ min: 1, max: 5 }) },
			createGenre
		),
		sourceId: faker.number.int(),
		id: gameId,
		entityType: `Game`,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		...overrides,
	}
}
