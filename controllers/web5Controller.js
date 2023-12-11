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

// req.body = {username: campbell313}
const signUser = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()
	const usr = await findUser(req, res, web5)
	const udata = {
		username: req.body.username,
		did: myDid,
		canView: [],
		created: [],
	}
	if (usr.foundUser) {
		res.send({
			status: 313,
			code: "username_already_exists",
			message: usr.userFound,
		})
	} else {
		const { record } = await web5.dwn.records.create({
			data: udata,
			message: {
				schema: "https://digitaldreamcrafters119.dev/user",
				dataFormat: "application/json",
			},
		})
		res.send({ status: 200, code: "signed_up", message: udata })
	}
}

// req.body = {username: gonda5667, did: "did:ion:9834.."}
const signable = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()
	const usr = await findUser(req, res, web5)
	if (usr.foundUser) {
		res.send({ status: 313, message: "username_already_exists" })
	} else {
		res.send({ status: 200, message: "username_available" })
	}
}

// req.body = {username: gonda5667, did:"did:ion:9834..."}
const login = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()
	const usr = await findUser(req, res, web5)
	if (usr.foundUser) {
		if (usr.userFound.did == req.body.did) {
			res.send({ status: 200, code: "loggable", message: usr.userFound })
		} else {
			res.send({ status: 315, message: "mismatch" })
		}
	} else {
		res.send({ status: 314, message: "no_such_user" })
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
		const result = await findFrodo(records)
		if (result.length > 0) {
			const re = await result[0].data.text()
			console.log(re)
			return { foundUser: true, userFound: JSON.parse(re) }
		} else {
			return { foundUser: false, userFound: {} }
		}
	}

	async function findFrodo(records) {
		let usrArr = []
		for (let record of records) {
			const re = JSON.parse(await record.data.text())
			if (re) {
				usrArr.push(re.username)
			}
		}

		if (usrArr.length > 0) {
			const foundDuplicate = usrArr.findIndex((user) => {
				return user == req.body.username
			})
			if (foundDuplicate > -1) {
				return [records[foundDuplicate]]
			} else {
				return []
			}
		} else {
			return []
		}
	}
}

export { init, signUser, findUser, login, signable }
