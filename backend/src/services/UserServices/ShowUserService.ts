import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";
import User from "../../models/User";
import UserFlow from "../../models/UserFlow";

const ShowUserService = async (id: string | number): Promise<User> => {
  const user = await User.findByPk(id, {
    attributes: ["name", "id", "email", "profile", "tokenVersion"],
    include: [
      { 
        model: UserFlow,
        as: "userflow",
        include: [
          {  model: Flow, as: "flow" }
        ]
      },
    ],
  });

  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 401);
  }

  return user;
};

export default ShowUserService;
