import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";

interface Request {
  title: string;
  flow: string;
}

const CreateFlowService = async ({
  title,
  flow
}: Request): Promise<Flow> => {
  const nameExists = await Flow.findOne({
    where: { title }
  });

  if (nameExists) {
    throw new AppError("ERR_DUP_DUPLICATED", 401);
  }

  const aflow = await Flow.create({ 
    title,
    flow
  });

  return aflow;
};

export default CreateFlowService;
