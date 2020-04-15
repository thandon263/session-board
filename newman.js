const {runner} = require("newman-stub")
const collection = require("./postman/MoveTheDial .postman_collection.json")
const enviroment = require("./postman/MTD - Development.postman_environment.json")

runner({
    collection,
    enviroment,
    globals: "",
    reporters: ["cli", "html", "junit"],
    timeoutRequest: 2000,
    bail: false,
})
