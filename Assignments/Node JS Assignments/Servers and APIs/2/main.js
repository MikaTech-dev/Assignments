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


// read file and parsed it to be logged to console as a JSON parsed/turned to array, and sent to the website as plain JSON upon get request.
function requestHandler(req, res) {
    if (req.url === "/") {
        res.setHeader ("Content-type", "text/html")
        res.end ("<h1>Use thunderbolt to make requests to the server and see results</h1>")
    }
    // Get request
    if (req.url === "/menu" && req.method === "GET") {
        getMenu(req, res)
    }
    if (req.url === "/menu" && req.method === "POST") {
        postMenu (req, res)
    }
}


function getMenu(req, res) {
    if (req.url == "/menu" && req.method === "GET") {
        fs.readFile (filePath, "utf8", (err, data) => {
            if (err) {
                console.log(err.cause);
            }
            // you can't log the data directly if it's not in a format node js can only accept or if you don't specify the file format (usually utf8), hence we parse it, after which it becomes an object
            // apparently JSON.parse can throw an error in event of a failure which won't get caught unless we wrap it in a try catch block
            /// remember, JSON.parse turns JSON Strings into objects.
            try {
                const parsedData = JSON.parse(data)
                console.log (parsedData)
                res.end()
            } catch (error) {
                console.log("An error occurred while parsing this JSON file: ", error);
                res.end()
            }
        })
    }else {
        res.setHeader ("Content-type", "text/html")
        res.end ("<h1> For now, all you can do is navigate to /menu to get the menu items. In the future, you should be able to make get requests to the base url and get more specific info. </h>")
    }
}


function postMenu(req,res) {
    // since we want to update the file, first we need to read it, collect the data in it, add to it, and write the updated data back to the file.
    fs.readFile (filePath, "utf8", (err, data) => {
        if (err) {
            console.log("An error occurred while reading the requested data: ", err)
            res.end
        }
        const parsedData = JSON.parse(data)
        try {
            console.log (parsedData)
            res.end (data)
        } catch (error) {
            console.log(`An error occurred while parsing this JSON file for the ${req.method} method: ${error}`);
        }
    // handling body data
        
    })
}