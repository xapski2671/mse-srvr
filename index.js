import express from "express"
import { Web5 } from "@web5/api"
import web5Route from "./routes/web5Route.js"
import submitDataRoute from "./routes/submitDataRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import getTiersRoute from "./routes/getTiersRoute.js"
import { webcrypto } from "node:crypto"
import getPublicTiersRoute from "./routes/getPublicTiersRoute.js"

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto
const { web5, did: myDid } = await Web5.connect()

const PORT = process.env.PORT || 5001

const app = express()
app.use(express.static("uploads"))

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.listen(PORT, () => {
	console.log(`api running on port ${PORT}`)
})

app.get("/", (req, res) => {
	res.json(`api running on port ${PORT}⭐`)
})

// app.use("/images", imagesRoute)
app.use("/web5", web5Route)
app.use("/data", submitDataRoute)
app.use("/get-viewable", getTiersRoute)
app.use("/get-public", getPublicTiersRoute)

export { web5, myDid }
