import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import isAuth from "../services/AuthServices/isAuth";

const authRoutes = Router();

authRoutes.post("/auth/signin", SessionController.aStore);

authRoutes.post("/auth/refresh_token", SessionController.update);

authRoutes.delete("/auth/logout", isAuth, SessionController.remove);

export default authRoutes;