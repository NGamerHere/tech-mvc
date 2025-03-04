import fs from "fs";
import http from "http";
import path from "path";

const folderPath = "./src/controllers";
const classes = {};


const loadControllers = async () => {
    try {
        const files = fs.readdirSync(folderPath);

        const importPromises = files.map(async (file) => {
            const filePath = folderPath +"/" +file;
            if (file.endsWith(".js")) {
                const module = await import(filePath);

                const className = path.basename(file, ".js");
                classes[className] = new module.default();
            }
        });

        await Promise.all(importPromises);
        console.log("All modules imported:", Object.keys(classes));
    } catch (err) {
        console.error("Error reading directory:", err);
    }
};

await loadControllers();


http.createServer(async (req, res) => {
    const method = req.method;
    const url = req.url.split("/").filter(Boolean);

    console.log(`Received ${method} request for ${req.url}`);

    if (url.length === 1) {
        const [className] = url;

        if (classes[className] && typeof classes[className][method] === "function") {
            try {
                const result = await classes[className][method]();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Class or method not found");
        }
    } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid URL format. Use /ClassName/MethodName");
    }
}).listen(8080, () => {
    console.log("Server running at http://localhost:8080");
});
