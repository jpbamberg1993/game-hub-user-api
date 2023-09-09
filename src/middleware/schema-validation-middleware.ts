import { ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'

export type HttpParameters<T> = {
	body?: ZodSchema<T>
	query?: ZodSchema<T>
	params?: ZodSchema<T>
}

export function schemaValidationMiddleware<T>(schema: HttpParameters<T>) {
	return function validate(req: Request, res: Response, next: NextFunction) {
		if (schema.body) {
			const response = schema.body.safeParse(req.body)
			if (!response.success) {
				return res.status(400).json({ error: response.error })
			}
		}
		if (schema.query) {
			const response = schema.query.safeParse(req.query)
			if (!response.success) {
				return res.status(400).json({ error: response.error })
			}
		}
		if (schema.params) {
			const response = schema.params.safeParse(req.params)
			if (!response.success) {
				return res.status(400).json({ error: response.error })
			}
		}

		next()
	}
}
