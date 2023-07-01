import { DataError } from '../games/games.repository'
import { Nullable } from '../types/utility-types'

export function getErrorMessage(error: Nullable<DataError>) {
	if (error && error.statusCode < 500) {
		return error.message
	}
	return `An unknown error occurred.`
}
