import { Request, Response } from "express";
import ListFlowService from "../services/FlowService/ListFlowService";
import CreateFlowService from "../services/FlowService/CreateFlowService";
import ShowFlowService from "../services/FlowService/ShowFlowService";
import UpdateFlowService from "../services/FlowService/UpdateFlowService";
import DeleteFlowService from "../services/FlowService/DeleteFlowService";
import AppError from "../errors/AppError";
import UserFlow from "../models/UserFlow";
import Flow from "../models/Flow";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
  userflowId: string;
};

type ShowQuery = {
};

interface FlowData {
  title: string;
  flow: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber, userflowId } = req.query as IndexQuery;

  if(userflowId){
    const userflow = await UserFlow.findByPk(userflowId, {
      include: [
        {
          model: Flow,
          as: "flow"
        }
      ]
    });

    return res.status(200).json(userflow);
  }

  const { flows, count, hasMore } = await ListFlowService({
    searchParam,
    pageNumber
  });

  return res.json({ flows, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newFlow: FlowData = req.body;


  const quickAnswer = await CreateFlowService({
    ...newFlow
  });


  return res.status(200).json(quickAnswer);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { flowId } = req.params;
  const quickAnswer = await ShowFlowService(flowId);

  return res.status(200).json(quickAnswer);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const flowData: FlowData = req.body;

  const { flowId } = req.params;

  const quickAnswer = await UpdateFlowService({
    flowData,
    flowId
  });


  return res.status(200).json(quickAnswer);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { flowId } = req.params;

  await DeleteFlowService(flowId);

  return res.status(200).json({ message: "Quick Answer deleted" });
};
