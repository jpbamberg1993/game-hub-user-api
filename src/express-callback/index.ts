import { Request, Response } from 'express'

export type HttpRequestHeaders = {
	// eslint-disable-next-line
	'Content-Type': string
	Referer: string
	// eslint-disable-next-line
	'User-Agent': string
}

export type HttpRequest = {
	body?: unknown
	query?: unknown
	params?: unknown
	ip?: string
	method: string
	path: string
	headers: HttpRequestHeaders
}

export type HttpResponse = {
	headers?: {
		// eslint-disable-next-line
		'Content-Type': string
	}
	statusCode: number
	body: unknown
}

export function makeExpressCallback(controller: unknown) {
	return (req: Request, res: Response) => {
		const httpRequest = {
			body: req.body,
			query: req.query,
			params: req.params,
			ip: req.ip,
			method: req.method,
			path: req.path,
			headers: {
				'Content-Type': req.get(`Content-Type`),
				Referer: req.get(`referer`),
				'User-Agent': req.get(`User-Agent`),
			},
		}
		controller(httpRequest)
			.then((httpResponse) => {
				if (httpResponse.headers) {
					res.set(httpResponse.headers)
				}
				res.type(`json`)
				res.status(httpResponse.statusCode).send(httpResponse.body)
			})
			.catch((e) =>
				res.status(500).send({ error: `An unknown error occurred.` })
			)
	}
}
