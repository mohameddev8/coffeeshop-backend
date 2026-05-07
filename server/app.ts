import express, {type Application} from "express";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middlewares
import {requestLogger} from "./middlewares/requestLogger";
import {errorHandler} from "./middlewares/errorHandler";
import {notFoundHandler} from "./middlewares/notFoundHandler";

// Routers
import {authRouter} from "./modules/auth/auth.routes.js";
import {categoryRouter} from "./modules/categories/categories.routes.ts";
import {menuRouter} from "./modules/menu/menu.routes.ts";
import {usersRouter} from "./modules/users/users.routes.ts";
import {ordersRouter} from "./modules/orders/orders.routes.ts";


export function createApp(): Application {
    const app = express();

    // Parsing
    app.use(express.json({limit: "10kb"}));
    app.use(express.urlencoded({extended: true}));

    // Logging
    app.use(requestLogger);
    app.use(express.static(path.join(__dirname, "../client")));

    // Api routes
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/categories", categoryRouter)
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