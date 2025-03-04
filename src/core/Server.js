import fs from "fs";
import path from "path";
import http from "http";
import {  pathToFileURL } from "url";

class Server {
    constructor(controllersPath = "./controllers", port = 8080) {
        this.controllersPath = controllersPath;
        this.port = port;
        this.controllers = {};
    }

    async loadControllers() {
        try {
            const files = fs.readdirSync(this.controllersPath);
            const importPromises = files.map(async (file) => {
                const filePath = path.join(this.controllersPath, file);

                if (file.endsWith(".js")) {
                    const module = await import(pathToFileURL(filePath).href);
                    const className = path.basename(file, ".js");
                    this.controllers[className] = new module.default();
                    console.log(`Loaded controller: ${className}`);
                }
            });

            await Promise.all(importPromises);
            console.log("Controllers loaded:", Object.keys(this.controllers));
        } catch (err) {
            console.error("Error loading controllers:", err);
        }
    }

    start() {
        http.createServer(async (req, res) => {
            const urlParts = req.url.split("/").filter(Boolean);
            if (urlParts.length === 2) {
                const [className, methodName] = urlParts;

                if (this.controllers[className] && typeof this.controllers[className][methodName] === "function") {
                    try {
                        const result = await this.controllers[className][methodName]();
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
        }).listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }
}

export default Server;