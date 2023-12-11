import { Router } from "express"
import { findTier, submitData } from "../controllers/submitDataController.js"

const submitDataRoute = Router()

submitDataRoute.post("/", submitData)
submitDataRoute.post("/find-tier", findTier)

export default submitDataRoute
