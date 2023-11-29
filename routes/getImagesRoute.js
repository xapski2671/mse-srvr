import { Router } from "express"
import { imagesController } from "../controllers/getImagesController.js"

const imagesRoute = Router()

imagesRoute.get("/:imageId", imagesController)

export default imagesRoute
