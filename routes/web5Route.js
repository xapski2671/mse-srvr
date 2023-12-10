import { Router } from "express"
import { findUsers, init, signUser } from "../controllers/web5Controller.js"

const web5Route = Router()

web5Route.get("/init", init)
web5Route.get("/find-users", findUsers)
web5Route.get("/sign-user", signUser)

export default web5Route
