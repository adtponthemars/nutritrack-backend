import admin from 'firebase-admin';
import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// const serviceAccount = require("../../serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;