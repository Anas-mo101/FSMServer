import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";

const DeleteFlowService = async (id: string): Promise<void> => {
  const flow = await Flow.findOne({
    where: { id }
  });

  if (!flow) {
    throw new AppError("ERR_NO_QUICK_ANSWER_FOUND", 400);
    
  }

  await flow.destroy();
};

export default DeleteFlowService;
