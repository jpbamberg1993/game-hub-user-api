import { NextFunction, Request, Response } from 'express'

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

function convertKeysToCamelCase(obj: any) {
	if (typeof obj !== `object` || obj === null) {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map((i) => convertKeysToCamelCase(i))
	}

	return Object.keys(obj).reduce((result, key) => {
		const newKey = stringSnakeToCamel(key)
		result[newKey] = convertKeysToCamelCase(obj[key])
		return result
	}, {})
}

function stringSnakeToCamel(str: string) {
	return str.replace(/([-_][a-z])/g, (group) =>
		group.toUpperCase().replace(`-`, ``).replace(`_`, ``)
	)
}
