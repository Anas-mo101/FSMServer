import UserFlow from "../../models/UserFlow";
import { SerializeUser } from "../AuthServices/SerializeUser";
import ShowUserService from "./ShowUserService";


interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  lastNode?: string;
  isDone?: boolean;
  flowId?: number;
}

interface Request {
  userData: UserData;
  userId: string | number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const UpdateUserService = async ({ userData, userId }: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const {
    email, password, profile, name,
    lastNode, isDone,
    flowId
  } = userData;

  let body: any = {
    email,
    password,
    profile,
    name
  };

  if (flowId) {
    let userflow;

    if (!user.userflowId) {
      userflow = await UserFlow.create({
        isDone: false,
        flowId: flowId
      });
    }

    if (user.userflowId) {
      userflow = await UserFlow.findByPk(user.userflowId);
      userflow?.update({
        flowId: flowId
      });
    }

    body = {
      ...body,
      userflowId: userflow?.id
    }
  }

  if (user.userflow) {
    let userflow = await UserFlow.findByPk(user.userflow.id);

    userflow?.update({
      lastNode: lastNode,
      isDone: isDone ?? false
    });
  }

  await user.update(body);

  await user.reload();

  return SerializeUser(user);
};

export default UpdateUserService;
