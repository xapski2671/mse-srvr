// import { Web5 } from "@web5/api"
// import { webcrypto } from "node:crypto"
// import { v4 as uuidv4 } from "uuid"

// // @ts-ignore
// if (!globalThis.crypto) globalThis.crypto = webcrypto
// const { web5, did: myDid } = await Web5.connect()
import { web5, myDid } from "../index.js"

async function findUserRecordId(web5, did) {
	async function findFrodo(records) {
		let usrArr = []
		for (let record of records) {
			const re = JSON.parse(await record.data.text())
			if (re) {
				usrArr.push(re.did)
			}
		}

		if (usrArr.length > 0) {
			const foundDuplicate = usrArr.findIndex((userDID) => {
				return userDID == did
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

	const { records } = await web5.dwn.records.query({
		message: {
			filter: {
				schema: "https://digitaldreamcrafters120.dev/user",
			},
		},
	})

	if (!records || !(records.length > 0)) {
		return { foundUser: false, userRID: "", userRecord: {} }
	} else {
		const result = await findFrodo(records)
		if (result.length > 0) {
			// const re = await result[0].data.text()
			return { foundUser: true, userRID: result[0].id, userRecord: result[0] }
		} else {
			return { foundUser: false, userRID: "", userRecord: {} }
		}
	}
}

async function findUserRecordIdByUsrName(web5, username) {
	async function findFrodo(records) {
		let usrArr = []
		for (let record of records) {
			const re = JSON.parse(await record.data.text())
			if (re) {
				usrArr.push(re.username)
			}
		}

		if (usrArr.length > 0) {
			const foundDuplicate = usrArr.findIndex((userName) => {
				return userName == username
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

	const { records } = await web5.dwn.records.query({
		message: {
			filter: {
				schema: "https://digitaldreamcrafters120.dev/user",
			},
		},
	})

	if (!records || !(records.length > 0)) {
		return { foundUser: false, userRID: "", userRecord: {} }
	} else {
		const result = await findFrodo(records)
		if (result.length > 0) {
			// const re = await result[0].data.text()
			return { foundUser: true, userRID: result[0].id, userRecord: result[0] }
		} else {
			return { foundUser: false, userRID: "", userRecord: {} }
		}
	}
}

// req.body = {
// 	userDID: UserDID,
// 	projectName: PName,
// 	projectImage: pImg,
// 	projectTagL: PTagL,
// 	artQuantity: AQty,
// 	tiers: tiers,
// }
const submitData = async (req, res) => {
	const project = req.body

	const pData = {
		pName: project.projectName,
		pCreatorUsername: project.username,
		pImage: project.projectImage,
		pTagLine: project.projectTagL,
		pQuantity: project.artQuantity,
	}

	const doesUserExist = await findUserRecordIdByUsrName(web5, project.username)
	if (doesUserExist.foundUser) {
		// check if creator wants to modify an already made project
		// PROJECT RECORD
		const { record: projectRecord } = await web5.dwn.records.create({
			data: pData,
			message: {
				schema: "https://digitaldreamcrafters120.dev/user/project",
				// contextId: doesUserExist.userRID,
				// parentId: doesUserExist.userRID,
				dataFormat: "application/json",
				// protocol: "https://digitaldreamcrafters120.dev",
				// protocolPath: "user/project",
			},
		})
		// console.log("project", projectRecord)

		// update creators created array
		const creatorRecord = doesUserExist.userRecord
		const creatorObject = JSON.parse(await creatorRecord.data.text())
		const updateCreatorRecordResult = await creatorRecord.update({
			data: {
				...creatorObject,
				created: [...creatorObject.created, projectRecord.id],
			},
		})

		// console.log(creatorObject)
		console.log("update rec", updateCreatorRecordResult)

		// TIER RECORDS
		for (let tier of project.tiers) {
			const { record: tierRecord } = await web5.dwn.records.create({
				data: {
					tName: tier.name,
					aViewers: tier.aViewers,
					artWorks: tier.artWorks,
					pName: tier.projectName,
					pImage: tier.projectImage,
					pCreatorUsername: tier.projectCreatorUsername,
				},
				message: {
					schema: "https://digitaldreamcrafters120.dev/user/project/tier",
					// contextId: doesUserExist.userRID,
					// parentId: projectRecord.id,
					dataFormat: "application/json",
					// protocol: "https://digitaldreamcrafters120.dev",
					// protocolPath: "user/project/tier",
				},
			})
			// console.log(tierRecord)

			for (let viewer of tier.aViewers) {
				const userRec = await findUserRecordIdByUsrName(web5, viewer)
				if (userRec.foundUser) {
					const viewerRecord = userRec.userRecord
					const viewerObject = JSON.parse(await viewerRecord.data.text())
					// console.log(viewerObject)
					const updateViewerRecordResult = await viewerRecord.update({
						data: {
							...viewerObject,
							canView: [...viewerObject.canView, tierRecord.id],
						},
					})
				}
			}
		}

		res.json({ status: 200, msg: "project_submitted" })
	} else {
		res.json({ status: 314, msg: "user_not_found" })
	}
}

// const findTier = async (req, res) => {
// 	const { web5, did: myDid } = await Web5.connect()
// 	console.log(req.body)
// 	const { record } = await web5.dwn.records.read({
// 		message: {
// 			filter: {
// 				recordId: req.body.rid,
// 			},
// 		},
// 	})

// 	console.log(JSON.parse(await record.data.text()).tName)
// 	res.send({ status: 200, message: "recieved" })
// }

export { submitData }
