const http = require("http")

const App = require("./build/App")

const server = http.createServer(App)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => process.stdout.write(`Server Running on PORT: ${PORT}\n`))
