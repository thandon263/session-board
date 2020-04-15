import fetch from "node-fetch"
import AuthRouterTest from "./auth-service"
import {async} from "regenerator-runtime"

const environment = process.env.NODE_ENV || "test"

const configuration = require("../../../knexfile")[environment]

const database = require("knex")(configuration)

describe("Starting the Authentication process", () => {
    test("Register a new user <Test>", done => {
        fetch("http://localhost:5000/api/v1/auth/register", {
            method: "post",
            body: {},
            headers: {"Content-Type": "application/json"},
        })
        done()
    })
})
