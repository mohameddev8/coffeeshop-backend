import { env } from "./server/config/env";
import { connectDatabase } from "./server/config/database";
import { createApp } from "./server/app";
// Server Booting
async function boot (): Promise<void> {
    await connectDatabase();
    const app = createApp();
    app.listen(env.PORT, () => {
        console.log(`\x1b[32m●\x1b[0m [Server] Running on http://localhost:${env.PORT}`);
        console.log(`\x1b[32m●\x1b[0m [Server] Environment: ${env.NODE_ENV}`);
    })
}

// Server Booting Error Handling
boot().catch(error => {
    console.error("\x1b[31m●\x1b[0m [Server] Fatal startup error:", error);
    process.exit(1);
})