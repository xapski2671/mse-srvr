import express from "express"
import imagesRoute from "./routes/getImagesRoute.js"

const app = express()
app.use(express.static("uploads"))
app.use(express.json())
app.listen(5001, () => {
	console.log("api running on port 5001")
})

app.get("/", (req, res) => {
	res.json("api running on 5001⭐")
})

app.use("/images", imagesRoute)
