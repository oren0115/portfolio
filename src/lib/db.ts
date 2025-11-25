import mongoose from "mongoose";

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const envKeys = Object.keys(process.env).filter((key) =>
      key.includes("MONGO")
    );
    throw new Error(
      `Missing MONGODB_URI. Please define it in your .env.local file.\n` +
        `Found MongoDB-related env vars: ${envKeys.length > 0 ? envKeys.join(", ") : "none"}\n` +
        `Make sure you have a .env.local file in the root directory with MONGODB_URI=your_connection_string`
    );
  }
  return uri;
}

let cached = globalThis.mongooseConnection;

if (!cached) {
  cached = { conn: null, promise: null };
  globalThis.mongooseConnection = cached;
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const MONGODB_URI = getMongoUri();
    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

