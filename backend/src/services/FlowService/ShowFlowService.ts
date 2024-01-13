import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";

const ShowFlowService = async (id: string): Promise<Flow> => {
  const flow = await Flow.findByPk(id);

  if (!flow) {
    throw new AppError("ERR_NO_QUICK_ANSWERS_FOUND",400);
  }

  return flow;
};

export default ShowFlowService;