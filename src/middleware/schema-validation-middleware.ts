import { ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'

export function schemaValidationMiddleware<T>(schema: ZodSchema<T>) {
	return function validate(req: Request, res: Response, next: NextFunction) {
		try {
			schema.parse(req.body)
			next()
		} catch (e: any) {
			return res.status(400).send(e.issues)
		}
	}
}
