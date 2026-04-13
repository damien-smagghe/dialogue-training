import * as fs from "fs";
import { SimpleCrypto } from "simple-crypto-js";
import password from "./encryptPassword.js";

const dialoguesString = fs.readFileSync("./dialogues.json", "utf8");
const dialogues = JSON.parse(dialoguesString);

// Encrypt
console.log("SimpleCrypto ->", SimpleCrypto);
const crypto = new SimpleCrypto(password);
const encrypted = crypto.encrypt(dialogues, "SHA-256", 100000);

fs.writeFileSync("src/dialogues.enc.json", JSON.stringify({ data: encrypted }));

console.log("");
console.log("Encrypted file saved to: src/dialogues.enc.json");

// Verify
try {
  const decrypted = crypto.decrypt(encrypted, "SHA-256", 100000);
  console.log("");
  console.log("Decryption test:");
  console.log(decrypted.slice(0, 100) + "...");
} catch (err) {
  console.log("Decryption error:", err.message);
}
