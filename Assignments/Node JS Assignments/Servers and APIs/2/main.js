import http from "node:http"
import fs from "node:fs"
import { hostname } from "node:os"
import path from "node:path"
import { fileURLToPath, parse } from "node:url"


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

    } else if (req.url.startsWith("/menu") && req.method === "GET" && req.url.includes("?id=")) {
        // Handle GET req for the url ~ /menu?id=...
        getOneItem(req, res)

    } else if (req.url === "/menu" && req.method === "GET") {
        getMenu(req, res)

    } else if (req.url === "/menu" && req.method === "POST") {
        postMenu (req, res)

    } else if (req.url.startsWith("/menu") && req.method === "PUT") {
        updateMenuItem(req, res);
    } else if (req.url.startsWith("/menu") && req.method === "DELETE") {
        deleteMenuItem(req, res);
    }else {
        res.statusCode = 404;
        res.end("Not found");
    }
}


function getMenu(req, res) {
    if (req.url == "/menu" && req.method === "GET") {
        fs.readFile (filePath, "utf8", (err, data) => {
            if (err) {
                console.log(err.cause);
                res.end (err)
            }
            // you can't log the data directly if it's not in a format node js can only accept or if you don't specify the file format (usually utf8), hence we parse it, after which it becomes an object
            // apparently JSON.parse can throw an error in event of a failure which won't get caught unless we wrap it in a try catch block
            /// remember, JSON.parse turns JSON Strings into objects.
            try {
                const parsedData = JSON.parse(data)
                console.log (parsedData)
                res.end(JSON.stringify(parsedData))
            } catch (error) {
                console.log("An error occurred while parsing this JSON file: ", error);
                res.end()
            }
        })
    }
}




// Allowing the creating new items
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
        let body = []
        req.on ("data", (chunk) => {
            body.push(chunk)
        })
        req.on ("end", () => {
            const newMenuItem = JSON.parse(body); // logs as buffer, meaning we have to convert it into actual readable JSON
            const updatedData = [...parsedData, ...newMenuItem]
            console.log(updatedData);
            // The two above are a necessecity to process the data sent along with the request, as well as adding the new menu item sent in the body of the request to the menu.


            fs.writeFile (filePath, JSON.stringify (updatedData, null, 2), () => {
                if (err) {
                    console.log("There was an error writing to this file", err.cause);
                    res.end
                } res.end ("New menu item created successfully!")
            })
        })
    })
}




// Getting only one menu item

function getOneItem(req, res) {
    const parsedUrl = parse(req.url, true)

    // Check if the URL path matches "/testing"
    if (parsedUrl.pathname === "/menu") {
        // Extract the 'id' query parameter (e.g. /menu?id=1)
        const { id } = parsedUrl.query;
        
        // If the 'id' parameter is missing, respond with a 400 Bad Request error
        if (!id) {
            res.statusCode = 400; // Bad Request
            res.end("Missing 'id' query parameter");
            console.log ("Request is missing query id")
            return;
        }
        
        // Read the JSON data file that stores the menu items
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                // If an error occurs while reading the file, respond with a 500 Internal Server Error
                res.statusCode = 400;
                res.end("Error reading data");
                return;
            }
            try {
                // Parse the JSON string from the file into a JavaScript object/array
                const menu = JSON.parse(data);
                
                // Search for a menu item where its id matches the provided query parameter
                // Converting both to string ensures that the comparison is type-agnostic
                const menuItem = menu.find((menuItem) => String(menuItem.id) === String(id));
                
                // If no item matches the given id, respond with a 404 Not Found error
                if (!menuItem) {
                    res.statusCode = 404;
                    res.end("Menu item not found");
                } else {
                    // If the item is found, set the response header to indicate JSON data
                    // res.setHeader("Content-Type", "application/json");
                    // Send back the found item as a JSON string
                    res.end(JSON.stringify(item));
                }
            } catch (error) {
                // If an error occurs during JSON parsing, respond with an error
                res.statusCode = 400;
                res.end("Error parsing data");
            }
        });
    }
}

/**
 * Updates a menu item by id.
 * Expects a PUT request to /menu?id=... with updated item data in the request body.
 */
function updateMenuItem(req, res) {
    const parsedUrl = parse(req.url, true);
    if (parsedUrl.pathname === "/menu" && req.method === "PUT") {
        const { id } = parsedUrl.query;
        if (!id) {
            res.statusCode = 400;
            res.end("Missing 'id' query parameter");
            return;
        }

        // Collect the request body data
        let body = [];
        req.on("data", chunk => {
            body.push(chunk);
        });
        req.on("end", () => {
            try {
                const updatedItem = JSON.parse(Buffer.concat(body).toString());
                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Error reading data");
                        return;
                    }
                    let menu = JSON.parse(data);
                    // Find the index of the item to update
                    const index = menu.findIndex(item => String(item.id) === String(id));
                    if (index === -1) {
                        res.statusCode = 404;
                        res.end("Menu item not found");
                        return;
                    }
                    // Update the item
                    menu[index] = { ...menu[index], ...updatedItem };
                    fs.writeFile(filePath, JSON.stringify(menu, null, 2), err => {
                        if (err) {
                            res.statusCode = 500;
                            res.end("Error writing data");
                            return;
                        }
                        res.end("Menu item updated successfully!");
                    });
                });
            } catch (error) {
                res.statusCode = 400;
                res.end("Invalid JSON data");
            }
        });
    }
}

/**
 * Deletes a menu item by id.
 * Expects a DELETE request to /menu?id=...
 */
function deleteMenuItem(req, res) {
    const parsedUrl = parse(req.url, true);
    if (parsedUrl.pathname === "/menu" && req.method === "DELETE") {
        const { id } = parsedUrl.query;
        if (!id) {
            res.statusCode = 400;
            res.end("Missing 'id' query parameter");
            return;
        }
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error reading data");
                return;
            }
            let menu = JSON.parse(data);
            // Filter out the item to delete
            const filteredMenu = menu.filter(item => String(item.id) !== String(id));
            if (filteredMenu.length === menu.length) {
                res.statusCode = 404;
                res.end("Menu item not found");
                return;
            }
            fs.writeFile(filePath, JSON.stringify(filteredMenu, null, 2), err => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Error writing data");
                    return;
                }
                res.end("Menu item deleted successfully!");
            });
        });
    }
}

