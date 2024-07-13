const express = require("express")
const app = express()
const path = require("path")
const port = process.env.port || 3000

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile("public/home.html")
})

app.listen(port, () => {
    console.log("Server is up on port", port)
})