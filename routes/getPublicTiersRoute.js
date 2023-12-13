import { Router } from "express"
import { getPublicTiers } from "../controllers/getPublicTiersController.js"

const getPublicTiersRoute = Router()

getPublicTiersRoute.get("/", getPublicTiers)

export default getPublicTiersRoute
