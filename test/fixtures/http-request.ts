import { HttpRequest } from '../../src/express-callback/index'
import { faker } from '@faker-js/faker'

export function makeHttpRequest(
	overrides: Partial<HttpRequest> = {}
): HttpRequest {
	return {
		body: {},
		query: {},
		params: {},
		ip: faker.internet.ip(),
		method: `GET`,
		path: `/`,
		headers: {
			'Content-Type': `application/json`,
			Referer: `http://localhost:3000`,
			'User-Agent': `jest`,
		},
		...overrides,
	}
}
