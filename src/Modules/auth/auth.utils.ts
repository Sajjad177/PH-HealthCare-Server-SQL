import jwt, { SignOptions, Secret } from "jsonwebtoken";

export const generateToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn:string
): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as unknown as SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};
