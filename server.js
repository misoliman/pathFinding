const express = require("express")
const app = express()
const path = require("path")
const port = 3000 // he had process.env.port

app.use(express.static(path.join(__dirname, "public")))

// app.get("/", (req, res) => {
//     res.sendFile("public/home.html")
// })

app.listen(port, () => {
    console.log("Server is up on port", port)
})