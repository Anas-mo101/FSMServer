import express from "express";

import * as QuickAnswerController from "../controllers/FlowController";
import isAuth from "../services/AuthServices/isAuth";

const quickAnswerRoutes = express.Router();

quickAnswerRoutes.get("/flow", isAuth, QuickAnswerController.index);

quickAnswerRoutes.get( "/flow/:flowId", isAuth, QuickAnswerController.show );

quickAnswerRoutes.post("/flow", isAuth, QuickAnswerController.store);

quickAnswerRoutes.put( "/flow/:flowId", isAuth, QuickAnswerController.update );

quickAnswerRoutes.delete( "/flow/:flowId", isAuth, QuickAnswerController.remove);

export default quickAnswerRoutes;
