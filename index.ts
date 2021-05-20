import express from 'express'
import Discord from 'discord.js'
import { modifyRole, authMiddleware, SERVER } from './util'

const client = new Discord.Client()

const app = express()

app.use(authMiddleware)
app.use(express.json())

let server: Discord.Guild

app.post('/refresh-roles', async (req, res) => {
	await server.roles.fetch()
	return { status: 'ok' }
})

app.post('/add-role', async (req, res) => {
	const { error, value } = modifyRole.validate(req.body)
	if (error) {
		return { status: 'error', error }
	}

	const { memberID, role } = value

	const member = await server.members.fetch(memberID)

	const memberRole = server.roles.cache.find(r => r.name === role)

	if (!memberRole) {
		return { status: 'error', error: 'Member role not found' }
	}

	if (!member) {
		return { status: 'error', error: 'Member not found' }
	}

	console.log(await member.roles.add(memberRole))
	return { status: 'ok' }
})

app.post('/remove-role', async (req, res) => {
	const { error, value } = modifyRole.validate(req.body)
	if (error) {
		return { status: 'error', error }
	}

	const { memberID, role } = value
	const server = client.guilds.cache.get(SERVER.guildID)

	if (!server) {
		return { status: 'error', error: 'Guild ID server not found' }
	}
	const memberRole = server.roles.cache.find(r => r.name === role)

	if (!memberRole) {
		return { status: 'error', error: 'Member role not found' }
	}

	const member = server.members.cache.get(memberID)

	if (!member) {
		return { status: 'error', error: 'Member not found' }
	}

	console.log(await member.roles.remove(memberRole))
	return { status: 'ok' }
})

async function boot() {
	await client.login(SERVER.botToken)
	server = await client.guilds.fetch(SERVER.guildID)

	if (!server) {
		throw new Error('Could not find discord server')
	}

	await server.roles.fetch()

	app.listen(6666, () => {
		console.log('Bot REST API listening on 6666')
	})
}

boot()
