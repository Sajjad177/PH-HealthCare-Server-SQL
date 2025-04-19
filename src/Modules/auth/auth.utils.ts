import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";

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


export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};