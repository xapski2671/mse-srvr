import { Router } from "express"
import { findUser, init, signUser } from "../controllers/web5Controller.js"

const web5Route = Router()

web5Route.get("/init", init)
web5Route.post("/find-user", findUser)
web5Route.post("/sign-user", signUser)

export default web5Route
