import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import Discord from 'discord.js'
import { modifyRole, authMiddleware, SERVER } from './util'

const client = new Discord.Client()

const jokes = [
	'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
	'“Debugging” is like being the detective in a crime drama where you are also the murderer.',
	'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
	'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
	'If you listen to a UNIX shell, can you hear the C?',
	'Why do Java programmers have to wear glasses? Because they don’t C#.',
	'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
	'When Apple employees die, does their life HTML5 in front of their eyes?',
	'Without requirements or design, programming is the art of adding bugs to an empty text file.',
	'Before software can be reusable it first has to be usable.',
	'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
	'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
	'There are two ways to write error-free programs; only the third one works.'
]

function defaultResponse(message: Discord.Message) {
	if (!message.mentions.has(client.user!.id)) return

	message.channel.send(
		`Hi. I'm still under development and will be able to help you soon, meanwhile here's a dev joke for you:\n\n${
			jokes[Math.floor(Math.random() * jokes.length)]
		}`
	)

	return true
}

function tryAnsweringStackoverflowQuery(message: Discord.Message): boolean {
	if (!message.content.startsWith('!q')) return false

	const msg = message.content.replace('!q', '')
	const query = encodeURIComponent(msg.trim())
	const link = `https://stackoverflow.com/search?tab=relevance&q=${query}`
	message.channel.send(`HEY! This might help: ${link}`)
	return true
}

client.on('message', message => {
	if (tryAnsweringStackoverflowQuery(message)) return
	if (defaultResponse(message)) return
})

client.on('guildMemberAdd', member => {
	member.send(
		`Welcome to codedamn server! People like you are the fundamental blocks of development community, and although I am a bot, I was coded by one of the developers like you. Make sure you have also linked your Discord account with your codedamn official account on settings page: https://codedamn.com/settings\n\nAll the best!`
	)
})

const app = express()

app.use(authMiddleware)
app.use(express.json())

let server: Discord.Guild

app.post('/refresh-roles', async (req, res) => {
	await server.roles.fetch()
	return res.json({ status: 'ok' })
})

app.post('/add-role', async (req, res) => {
	const { error, value } = modifyRole.validate(req.body)
	if (error) {
		return res.json({ status: 'error', error })
	}

	const { memberID, role } = value

	const member = await server.members.fetch(memberID)

	const memberRole = server.roles.cache.find(r => r.name === role)

	if (!memberRole) {
		return res.json({ status: 'error', error: 'Member role not found' })
	}

	if (!member) {
		return res.json({ status: 'error', error: 'Member not found' })
	}

	console.log(await member.roles.add(memberRole))
	return res.json({ status: 'ok' })
})

app.post('/remove-role', async (req, res) => {
	const { error, value } = modifyRole.validate(req.body)
	if (error) {
		return res.json({ status: 'error', error })
	}

	const { memberID, role } = value

	const member = await server.members.fetch(memberID)

	const memberRole = server.roles.cache.find(r => r.name === role)

	if (!memberRole) {
		return res.json({ status: 'error', error: 'Member role not found' })
	}

	if (!member) {
		return res.json({ status: 'error', error: 'Member not found' })
	}

	console.log(await member.roles.remove(memberRole))
	return res.json({ status: 'ok' })
})

async function boot() {
	await client.login(SERVER.botToken)
	client.once('ready', () => {
		if (client.user) {
			client.user.setActivity({
				name: 'my github code',
				type: 'WATCHING',
				url: 'https://github.com/codedamn/codebot'
			})
		}
	})
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
