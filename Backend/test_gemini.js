import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(".env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test(name) {
  try {
    const model = genAI.getGenerativeModel({ model: name });
    const res = await model.generateContent("hello");
    console.log(`${name} worked!`);
  } catch (e) {
    console.error(`${name} failed:`, e.message);
  }
}

async function run() {
  await test("gemini-1.5-flash-latest");
  await test("gemini-1.0-pro");
  await test("gemini-pro");
  await test("gemini-1.5-pro-latest");
}

run();
