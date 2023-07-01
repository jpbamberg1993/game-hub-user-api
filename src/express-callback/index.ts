import { Request, Response } from 'express'

// Define the httpRequest and httpResponse types
export type HttpRequest = {
	body: any
	query: any
	params: any
	ip: string
	method: string
	path: string | undefined
	headers: {
		// eslint-disable-next-line
		'Content-Type': string | undefined
		Referer: string | undefined
		// eslint-disable-next-line
		'User-Agent': string | undefined
	}
}

export type HttpResponse = {
	headers?: {
		[key: string]: string
	}
	statusCode: number
	body: any
}

// Define the controller type
type Controller = (httpRequest: HttpRequest) => Promise<HttpResponse>

export function makeExpressCallback(controller: Controller) {
	return (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
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
			.then((httpResponse: HttpResponse) => {
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
