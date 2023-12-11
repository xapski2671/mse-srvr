import { Router } from "express"
import { getTierDetails } from "../controllers/getTiersController.js"

const getTiersRoute = Router()

getTiersRoute.post("/", getTierDetails)

export default getTiersRoute
