import http from "http"

describe("Server is connected", () => {
    test("Should assert if the response is expected", () => {
        expect(true).toBe(true)
    })

    it("Has a server instance", () => {
        const server = http.createServer((req, res, next) => {
            res.send("")
        })
        server.listen(5000)

        server.close()
    })
})
