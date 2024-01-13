import Flow from "../../models/Flow";

interface QuickAnswerData {
  title?: string;
  flow?: string;
}

interface Request {
  flowData: QuickAnswerData;
  flowId: string;
}

const UpdateFlowService = async ({
  flowData,
  flowId
}: Request): Promise<Flow> => {
  const { title, flow } = flowData;

  const aflow = await Flow.findOne({
    where: { id: flowId },
    attributes: ["id", "title", "flow"]
  });

  if (!aflow) {
    throw "ERR_NO_QUICK_ANSWERS_FOUND";
  }
  
  await aflow.update({
    title,
    flow
  });

  await aflow.reload({
    attributes: ["id", "title", "flow"]
  });

  return aflow;
};

export default UpdateFlowService;
