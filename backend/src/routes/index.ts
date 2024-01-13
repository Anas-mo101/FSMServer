import { Request, Response, Router } from "express";
import { automation } from '../automation/AutomationClient';
import { 
    AutomationError,
    AutomationNode,
    isAutomationError
} from "../automation/Interfaces";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import flowRoutes from "./flowRoutes";
import isAuth from "../services/AuthServices/isAuth";
import clientAuthRoutes from "./clientAuthRoutes";

const routes = Router();

routes.use(userRoutes);
routes.use(flowRoutes);
routes.use(authRoutes);


//=====

routes.use("/api", clientAuthRoutes);

/**
 * 
 * /POST
 * 
 * http://localhost:3000/index?eventKey=1
 * 
 * header: {
 *    authorization: token => user.id
 * }
 * body: {
 *    ......
 * }
 * 
 * **/

type IndexQuery = { event: string};

type StatusType = "success" | "failed";
type RoutingType = "pop" | "insert" | "pop_n_insert" | "pop_all_n_insert";

interface ResultResponse extends AutomationNode {
    routingType: RoutingType;
}

interface IndexResponse {
    status: StatusType,
    result: ResultResponse | AutomationError
}

const x: IndexResponse = { 
    status: "success",
    result: {
        id: "rew",
        type: "home",
        routingType: "insert",
        data: {

        },
        executionData: {

        }        
    }
}

routes.post('/api/index', isAuth, async (req: Request, res: Response): Promise<Response> => {
    const { event } = req.query as IndexQuery;
    const { body } = req;
    const actId = req.user.id;

    const newNode = await automation.trigger(event, actId, body);

    if (isAutomationError(newNode)) {
        const indexResponse: IndexResponse = {
            status: "failed",
            result: {
                errorCode: newNode.errorCode,
                errorMessage: newNode.errorMessage
            }
        }

        return res.status(newNode.errorCode).json(indexResponse);
    }

    const indexResponse: IndexResponse = {
        status: "success",
        result: {
            ...newNode,
            routingType: "insert"
        }
    }

    return res.status(200).json(indexResponse);
});

export default routes;
