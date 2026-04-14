import mongoose from "mongoose";
import dns from "node:dns";

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing");
  }

  mongoose.set("strictQuery", true);
  const connectOptions = {
    serverSelectionTimeoutMS: 10_000
  };

  try {
    await mongoose.connect(mongoUri, connectOptions);
    console.log("MongoDB connected");
    return;
  } catch (err) {
    const msg = String(err?.message || "");
    const isSrvLookupProblem =
      mongoUri.startsWith("mongodb+srv://") &&
      (err?.code === "ECONNREFUSED" || msg.includes("querySrv"));

    // Common Windows/network issue: SRV lookup fails due to DNS. We retry once
    // using well-known public resolvers. You can also override via DNS_SERVERS.
    if (isSrvLookupProblem) {
      const serversRaw = process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8";
      const servers = serversRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (servers.length) {
        dns.setServers(servers);
        console.log(`Retrying MongoDB SRV lookup with DNS servers: ${servers.join(", ")}`);
      }

      await mongoose.connect(mongoUri, connectOptions);
      console.log("MongoDB connected");
      return;
    }

    throw err;
  }
}

