// import { Web5 } from "@web5/api"
// import { webcrypto } from "node:crypto"
// import { v4 as uuidv4 } from "uuid"

// // @ts-ignore
// if (!globalThis.crypto) globalThis.crypto = webcrypto
import { web5, myDid } from "../index.js"

// req.body.canView = ["bafye2...", "bafy3wq....", "bafyoo6..."]
const getTierDetails = async (req, res) => {
	let tiers = []

	for (let id of req.body.canView) {
		const tier = await findTier(id, web5)
		if (tier) {
			tiers.push(tier)
		}
	}

	tiers.length > 0
		? res.send({ status: 200, message: tiers })
		: res.send({ status: 415, message: "no_viewable_projects" })
}

const findTier = async (id, web5) => {
	const { record } = await web5.dwn.records.read({
		message: {
			filter: {
				recordId: id,
			},
		},
	})

	if (record) {
		const doc = JSON.parse(await record.data.text())
		return doc
	} else {
		return null
	}
}

export { getTierDetails }
