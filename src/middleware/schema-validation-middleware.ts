import { ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'

export function schemaValidationMiddleware<T>(schema: ZodSchema<T>) {
	return function validate(req: Request, res: Response, next: NextFunction) {
		const response = schema.safeParse(req.body)
		if (!response.success) {
			return res.status(400).json({ error: response.error })
		}
		next()
	}
}
