import AppError from "../../errors/AppError";
import User from "../../models/User";

const DeleteUserService = async (id: string | number): Promise<void> => {
  const user = await User.findOne({
    where: { id }
  });

  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 401);
  }

  await user.destroy();
};

export default DeleteUserService;
