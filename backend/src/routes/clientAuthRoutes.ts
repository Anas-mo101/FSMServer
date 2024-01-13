import express from "express";

import * as SessionController from "../controllers/SessionController";
import isAuth from "../services/AuthServices/isAuth";

const clientAuthRoutes = express.Router();

clientAuthRoutes.post("/login", SessionController.store);
clientAuthRoutes.post("/auth", isAuth, (req, res) => {
    return res.status(200).send();
});


export default clientAuthRoutes;
