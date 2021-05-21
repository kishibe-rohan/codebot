import Joi from 'joi'
import express from 'express'

export const SERVER = {
	guildID: '794898639070953513',
	botToken: process.env.BOT_TOKEN
}

const SHARED_SECRET = process.env.SHARED_SECRET

export const authMiddleware = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const secret = req.headers['x-auth-secret']
	if (secret !== SHARED_SECRET) {
		return res.json({ status: 'unauthorized' })
	}

	return next()
}

export const modifyRole = Joi.object({
	memberID: Joi.string().required(),
	role: Joi.string().required()
})
	.required()
	.unknown(false)
