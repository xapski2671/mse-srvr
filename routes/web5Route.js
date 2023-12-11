import { Router } from "express"
import {
	findUser,
	init,
	login,
	signUser,
	signable,
} from "../controllers/web5Controller.js"

const web5Route = Router()

web5Route.get("/init", init)
web5Route.post("/find-user", findUser)
web5Route.post("/sign-user", signUser)
web5Route.post("/signable", signable)
web5Route.post("/login", login)

export default web5Route
