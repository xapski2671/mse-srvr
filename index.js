import express from "express"
import imagesRoute from "./routes/getImagesRoute.js"
import { Web5 } from "@web5/api"
import web5Route from "./routes/web5Route.js"
import submitDataRoute from "./routes/submitDataRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(express.static("uploads"))

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.listen(5001, () => {
	console.log("api running on port 5001")
})

app.get("/", (req, res) => {
	res.json("api running on port 5001⭐")
})

app.use("/images", imagesRoute)
app.use("/web5", web5Route)
app.use("/data", submitDataRoute)
