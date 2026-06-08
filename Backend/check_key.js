import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(".env") });

console.log("Key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "undefined");
console.log("Starts with:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 4) : "undefined");
