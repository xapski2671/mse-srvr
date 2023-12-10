import { Web5 } from "@web5/api"
/*
Needs globalThis.crypto polyfill.
This is *not* the crypto you're thinking of.
It's the original crypto...CRYPTOGRAPHY.
*/
import { webcrypto } from "node:crypto"

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto
const init = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()

	const protocolDef = {
		protocol: "https://digitaldreamcrafters117.dev",
		published: true,
		types: {
			user: {
				schema: "https://digitaldreamcrafters117.dev/user",
				dataFormats: ["application/json"],
			},
			project: {
				schema: "https://digitaldreamcrafters117.dev/project",
				dataFormats: ["application/json"],
			},
			tier: {
				schema: "https://digitaldreamcrafters117.dev/tier",
				dataFormats: ["application/json"],
			},
			art: {
				schema: "https://digitaldreamcrafters117.dev/art",
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

						art: {
							$actions: [
								{ who: "author", of: "project", can: "write" },
								{ who: "author", of: "project", can: "read" },
								{ who: "recipient", of: "project", can: "read" },
							],
						},
					},
				},
			},
		},
	}

	const queryForProtocol = async (web5) => {
		return await web5.dwn.protocols.query({
			message: {
				filter: {
					protocol: "https://digitaldreamcrafters117.dev",
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

const findUsers = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()

	// const queryForProtocol = async () => {
	// 	return await web5.dwn.protocols.query({
	// 		message: {
	// 			filter: {
	// 				protocol: "https://digitaldreamcrafters117.dev",
	// 			},
	// 		},
	// 	})
	// }

	const queryForProtocol = async () => {
		return await web5.dwn.records.query({
			message: {
				filter: {
					schema: "https://digitaldreamcrafters117.dev/user",
					// recordId:
					// 	"bafyreibuph3mdhsn6z6tol64y5opjdvjiqh3ueq3ca5oyy2jrlunmudt3i",
				},
			},
		})
	}

	const record = await queryForProtocol()
	const recs = record.records
	const id = record.records[0].id
	console.log(id)
	// console.log(text)

	// const result = recs.filter(findFrodo)
	// // console.log(result)
	// const tre = await result[0].data.text()
	// console.log(JSON.parse(tre).username)
	// async function findFrodo(rec) {
	// 	if ((await rec.data.text().did) == myDid) {
	// 		return rec
	// 	}
	// }
}

const signUser = async (req, res) => {
	const { web5, did: myDid } = await Web5.connect()

	const { record } = await web5.dwn.records.create({
		data: {
			username: "frodo",
			did: myDid,
			created: [],
			cview: [],
		},
		message: {
			schema: "https://digitaldreamcrafters117.dev/user",
			dataFormat: "application/json",
		},
	})

	console.log(record)
}

export { init, findUsers, signUser }
