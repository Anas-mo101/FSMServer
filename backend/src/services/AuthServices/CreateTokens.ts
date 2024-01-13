import { sign } from "jsonwebtoken";
import User from "../../models/User";

export const createAccessToken = (user: User): string => {
  const { secret, expiresIn } = {
    secret:  "mysecret",
    expiresIn: "7d",
  };

  return sign(
    { usarname: user.name, profile: user.profile, id: user.id },
    secret,
    {
      expiresIn
    }
  );
};

export const createRefreshToken = (user: User): string => {
  const { refreshSecret, refreshExpiresIn } = {
    refreshSecret: "myanothersecret",
    refreshExpiresIn: "7d"
  }

  return sign({ id: user.id, tokenVersion: user.tokenVersion }, refreshSecret, {
    expiresIn: refreshExpiresIn
  });
};
