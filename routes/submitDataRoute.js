import { Router } from "express"
import { submitData } from "../controllers/submitDataController.js"

const submitDataRoute = Router()

submitDataRoute.post("/", submitData)

export default submitDataRoute
