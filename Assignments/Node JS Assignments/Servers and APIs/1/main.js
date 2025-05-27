import http from "node:http"
import fs from "node:fs"
import os from "node:os"


const HOSTNAME = os.hostname
const PORT = 8000

function requestHandler (req, res) {
    // setting datatype so the server knows to parse the file as html
    res.setHeader ("Content-type", "text/html")
   if (req.url === "/index.html") {
        fs.readFile ("./index.html", (err, data) => {
            if (err) {
                res.statusCode = 404
                console.log ("An error occurred trying to read the file", err.cause)
                res.end ("An error occurred trying to read the file")
            }
            res.end(data)
        })
   }else {
        res.statuscode = 404
        console.log("This route is unsupported");
        res.end ("This route is unsupported")
   }
}

const server = http.createServer (requestHandler)

server.listen (PORT, HOSTNAME, () => {
    console.log(`Server sucessfully started on http://${HOSTNAME}:${PORT}/`)
})
