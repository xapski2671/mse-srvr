import { web5, myDid } from "../index.js"

// res = [tier object with empty authorized viewers array]
const getPublicTiers = async (req, res) => {
	// look for tiers
	const { records } = await web5.dwn.records.query({
		message: {
			filter: {
				schema: "https://digitaldreamcrafters120.dev/user/project/tier",
			},
		},
	})

	// filter for tiers with empty authorized viewers array
	if (!records || !(records.length > 0)) {
		return []
	} else {
		const result = await findPublicTiers(records)
		if (result.length > 0) {
			res.send({ status: 200, success: true, message: result })
		} else {
			res.send({ status: 319, success: false })
		}
	}
}

async function findPublicTiers(records) {
	let tierArr = []
	for (let record of records) {
		const re = JSON.parse(await record.data.text())
		if (re) {
			tierArr.push({ id: record.id, ...re })
		}
	}

	if (tierArr.length > 0) {
		const foundEmpty = tierArr.filter((tier) => {
			return tier.aViewers.length == 0
		})

		return foundEmpty
	} else {
		return []
	}
}

export { getPublicTiers }
