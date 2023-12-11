import { Web5 } from "@web5/api"
import { webcrypto } from "node:crypto"

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto

const init = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()

	const protocolDef = {
		protocol: "https://digitaldreamcrafters119.dev",
		published: true,
		types: {
			user: {
				schema: "https://digitaldreamcrafters119.dev/user",
				dataFormats: ["application/json"],
			},
			project: {
				schema: "https://digitaldreamcrafters119.dev/user/project",
				dataFormats: ["application/json"],
			},
			tier: {
				schema: "https://digitaldreamcrafters119.dev/user/project/tier",
				dataFormats: ["application/json"],
			},
		},
		structure: {
			user: {
				$actions: [{ who: "anyone", can: "write" }],
				project: {
					$actions: [
						{ who: "author", of: "project", can: "write" },
						{ who: "anyone", can: "read" },
					],

					tier: {
						$actions: [
							{ who: "author", of: "project", can: "write" },
							{ who: "anyone", can: "read" },
						],
					},
				},
			},
		},
	}

	const queryForProtocol = async (web5) => {
		return await web5.dwn.protocols.query({
			message: {
				filter: {
					protocol: "https://digitaldreamcrafters119.dev",
				},
			},
		})
	}

	const installProtocolLocally = async (web5, protocolDefinition) => {
		return await web5.dwn.protocols.configure({
			message: {
				definition: protocolDefinition,
			},
		})
	}

	const configureProtocol = async (web5, did) => {
		const protocolDefinition = protocolDef

		const { protocols: localProtocol, status: localProtocolStatus } =
			await queryForProtocol(web5)
		console.log({ localProtocol, localProtocolStatus })

		if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
			const { protocol, status } = await installProtocolLocally(
				web5,
				protocolDefinition
			)
			console.log("Protocol installed locally", protocol, status)

			const { status: configureRemoteStatus } = await protocol.send(did)
			console.log(
				"Did the protocol install on the remote DWN?",
				configureRemoteStatus
			)
		} else {
			console.log("Protocol already installed")
		}
	}

	await configureProtocol(web5, myDid)
}

const signUser = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()
	const usr = await findUser(req, res, web5)
	if (usr.foundUser) {
		res.send({ code: 313, message: "username_exists" })
	} else {
		const { record } = await web5.dwn.records.create({
			data: req.body,
			message: {
				schema: "https://digitaldreamcrafters119.dev/user",
				dataFormat: "application/json",
			},
		})
		res.send({ code: 200, message: "signed_in" })
	}
}

async function findUser(req, res, web5) {
	const { records } = await web5.dwn.records.query({
		message: {
			filter: {
				schema: "https://digitaldreamcrafters119.dev/user",
			},
		},
	})

	if (!records || !(records.length > 0)) {
		return { foundUser: false, userFound: {} }
	} else {
		const result = records.filter(findFrodo)
		if (result.length > 0) {
			const re = await result[0].data.text()
			return { foundUser: true, userFound: JSON.parse(re) }
		} else {
			return { foundUser: false, userFound: {} }
		}
	}

	async function findFrodo(rec) {
		try {
			const re = await rec.data.text()
			// console.log(JSON.parse(re).username)
			if (JSON.parse(re).username == req.body.username) {
				return rec
			}
		} catch (error) {
			console.log(error)
		}
	}
}

export { init, signUser, findUser }
