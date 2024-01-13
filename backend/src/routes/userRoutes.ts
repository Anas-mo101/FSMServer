import { Router } from "express";

import * as UserController from "../controllers/UserController";
import isAuth from "../services/AuthServices/isAuth";

const userRoutes = Router();

userRoutes.get("/users", isAuth, UserController.index);

userRoutes.post("/users", isAuth, UserController.store);

userRoutes.put("/users/:userId", isAuth, UserController.update);

userRoutes.get("/users/:userId", isAuth, UserController.show);

userRoutes.delete("/users/:userId", isAuth, UserController.remove);

export default userRoutes;
