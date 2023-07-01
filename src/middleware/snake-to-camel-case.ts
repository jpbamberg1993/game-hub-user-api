import { NextFunction, Request, Response } from 'express'
import { ObjectOrArray } from '../types/utility-types'

export function snakeToCamelCase(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.body) {
		next()
	}
	req.body = convertKeysToCamelCase(req.body)
	next()
}

function convertKeysToCamelCase(obj: ObjectOrArray): ObjectOrArray {
	if (typeof obj !== `object` || obj === null) {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map((i) => convertKeysToCamelCase(i)) as ObjectOrArray
	}

	return Object.keys(obj).reduce(
		(result: { [key: string]: ObjectOrArray }, key: string) => {
			const newKey = stringSnakeToCamel(key)
			result[newKey] = convertKeysToCamelCase(obj[key] as ObjectOrArray)
			return result
		},
		{}
	)
}

function stringSnakeToCamel(str: string) {
	return str.replace(/([-_][a-z])/g, (group) =>
		group.toUpperCase().replace(`-`, ``).replace(`_`, ``)
	)
}
