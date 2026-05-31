import "dotenv/config";
import mongoose from "mongoose";
import { serverEnv } from "./config/app-env.js";
import { TIMEOUTS } from "../shared/constants.js";

export async function connectDB() {
  if (!serverEnv.mongoUri) {
    throw new Error("MONGODB_URI must be set");
  }

  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  await mongoose.connect(serverEnv.mongoUri, {
    dbName: serverEnv.mongoDbName,
    serverSelectionTimeoutMS: TIMEOUTS.API_REQUEST,
    connectTimeoutMS: TIMEOUTS.API_REQUEST,
    socketTimeoutMS: TIMEOUTS.API_REQUEST,
  });
}
