import User from "../../models/User";
import { SerializeUser } from "../AuthServices/SerializeUser";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  profile?: string;
  whatsappId?: number;
  digitalmuUrl?: string;
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const CreateUserService = async ({
  email,
  password,
  name,
  profile = "admin",
}: Request): Promise<Response> => {

  const user = await User.create(
    {
      email,
      password,
      name,
      profile,
    },
  );

  await user.reload();

  return SerializeUser(user);
};

export default CreateUserService;
