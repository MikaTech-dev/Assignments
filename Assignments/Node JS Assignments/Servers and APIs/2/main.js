import http from "node:http"
import fs from "node:fs"
import { hostname } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"


// creating path to db
const __filename = fileURLToPath (import.meta.url)
const __dirname =  path.dirname (__filename)
const filePath = path.join (__dirname, "psuedo-db.json")

// creating server
const HOSTNAME = hostname
const PORT = 8000

const server = http.createServer(requestHandler)

server.listen (PORT, HOSTNAME, () => {
    console.log (`Server started at http://${HOSTNAME}:${PORT}`)
})


// read file and parsed it to be logged to console as a JSON parsed/turned to array, and sent to the website as plain JSON.
function requestHandler(req, res) {
    if (req.url == "/menu") {
        fs.readFile (filePath, (err, data) => {
            if (err) {
                console.log(err.cause);
            }
            console.log(JSON.parse(data))
            res.end (data)
        })
    }else {
        res.setHeader ("Content-type", "text/html")
        res.end ("<h1> For now, all you can do is navigate to /menu to get the menu items. In the future, you should be able to make get requests to the base url and get more specific info. </h>")
    }
}