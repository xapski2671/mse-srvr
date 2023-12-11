import { Web5 } from "@web5/api"
/*
Needs globalThis.crypto polyfill.
This is *not* the crypto you're thinking of.
It's the original crypto...CRYPTOGRAPHY.
*/
import { webcrypto } from "node:crypto"
import { v4 as uuidv4 } from "uuid"

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto

const submitData = async (req, res) => {
	const project = req.body
	const { web5, did: myDid } = await Web5.connect()
	// console.log(req.body.tiers[0].artWorks[0])

	const { userRecord } = await web5.dwn.records.create({
		data: {
			name: project.projectName,
			creatorDID: project.userDID,
			image: project.projectImage,
			tagLine: project.projectTagL,
			quantity: project.artQuantity,
			// tiers: project.tiers,
		},
		message: {
			schema: "https://digitaldreamcrafters117.dev/project",
			dataFormat: "application/json",
		},
	})

	const { projectRecord } = await web5.dwn.records.create({
		data: {
			name: project.projectName,
			creatorDID: project.userDID,
			image: project.projectImage,
			tagLine: project.projectTagL,
			quantity: project.artQuantity,
			// tiers: project.tiers,
		},
		message: {
			schema: "https://digitaldreamcrafters117.dev/project",
			dataFormat: "application/json",
		},
	})

	console.log("projectId:", projectRecord.id)

	const { tierRecord } = await web5.dwn.records.create({
		data: {
			name: project.projectName,
			creatorDID: project.userDID,
			image: project.projectImage,
			tagLine: project.projectTagL,
			quantity: project.artQuantity,
			// tiers: project.tiers,
		},
		message: {
			schema: "https://digitaldreamcrafters117.dev/tier",
			dataFormat: "application/json",
		},
	})

	res.json({ code: 200, msg: "thanks" })
}

export { submitData }
