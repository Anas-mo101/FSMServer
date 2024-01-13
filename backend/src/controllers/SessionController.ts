import { Request, Response } from "express";
import AppError from "../errors/AppError";
import AuthUserService from "../services/UserServices/AuthUserService";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";
import { SendRefreshToken } from "../services/AuthServices/SendRefreshToken";

export const aStore = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const { token, serializedUser, refreshToken } = await AuthUserService({
    email,
    password
  });

  SendRefreshToken(res, refreshToken!);

  if(serializedUser.profile === "user"){
    throw new AppError("UNAUTH_ACESSS", 401);
  }

  return res.status(200).json({
    token,
    user: serializedUser
  });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const { token, serializedUser } = await AuthUserService({
    email,
    password
  });

  if(serializedUser.profile === "admin"){
    throw new AppError("UNAUTH_ACESSS", 401);
  }

  return res.status(200).json({
    token,
    user: serializedUser
  });
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token: string = req.cookies.jrt;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const { user, newToken, refreshToken } = await RefreshTokenService(
    res,
    token
  );

  SendRefreshToken(res, refreshToken);

  return res.json({ token: newToken, user });
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  res.clearCookie("jrt");

  return res.send();
};
