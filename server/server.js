import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

try {
  // Start accepting requests only after the database connects.
  await connectDB();
  app
    .listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    })
    .on("error", () => {
      // For example, another process may already be using this port.
      console.error("Server failed to start");
      process.exit(1);
    });
} catch {
  console.error("Server startup failed");
  process.exit(1);
}
