import { PlatformRepository } from './platform.repository'

export class ListPlatforms {
	constructor(private readonly platformRepository: PlatformRepository) {}

	getAllPlatforms() {
		console.log(`hey`)
	}
}
