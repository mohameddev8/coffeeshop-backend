import express, {type Application} from "express";
import path from "path";
import {fileURLToPath} from "url";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middlewares
import {requestLogger} from "./middlewares/requestLogger.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {notFoundHandler} from "./middlewares/notFoundHandler.js";

// Routers
import {authRouter} from "./modules/auth/auth.routes.js";
import {categoryRouter} from "./modules/categories/categories.routes.js";
import {menuRouter} from "./modules/menu/menu.routes.js";
import {usersRouter} from "./modules/users/users.routes.js";
import {ordersRouter} from "./modules/orders/orders.routes.js";


export function createApp(): Application {
    const app = express();

    // Security Middleware
    app.use(helmet());
    app.use(cors({
        origin: env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true
    }));

    // Parsing
    app.use(express.json({limit: "10kb"}));
    app.use(express.urlencoded({extended: true}));

    // Logging
    app.use(requestLogger);
    app.use(express.static(path.join(__dirname, "../client")));

    // Api routes
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/categories", categoryRouter);
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/menu", menuRouter);
    app.use("/api/v1/orders", ordersRouter);

    // SPA
    app.get("*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/index.html"));
    });

    // Error Handlers
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
