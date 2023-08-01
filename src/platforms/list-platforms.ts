import { PlatformRepository } from './platform.repository'
import { HttpResponse } from '../express-callback'

export class ListPlatforms {
	constructor(private readonly platformRepository: PlatformRepository) {}

	async getAllPlatforms(): Promise<HttpResponse> {
		const { data, error } = await this.platformRepository.list()

		if (error || !data || data.length === 0) {
			return {
				headers: {
					'Content-Type': `application/json`,
				},
				statusCode: error?.statusCode ?? 404,
				body: {
					error: error?.message ?? `Could not find platforms`,
				},
			}
		}

		return {
			headers: {
				'Content-Type': `application/json`,
			},
			statusCode: 200,
			body: { results: data },
		}
	}
}
