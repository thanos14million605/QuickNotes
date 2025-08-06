import jwt from "jsonwebtoken";
import { promisify } from "util";

const signAccessToken = async (user, jwtSecret, jwtExpiresIn) => {
  return await jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

// const signRefreshToken = async (
//   user,
//   refreshTokenSecret,
//   refreshTokenExpiresIn
// ) => {
//   return await jwt.sign({ id: user.id }, refreshTokenSecret, {
//     expiresIn: refreshTokenExpiresIn,
//   });
// };

const verifyAccessToken = async (token, accessTokenSecret) => {
  return await promisify(jwt.verify)(token, accessTokenSecret);
};
// const verifyRefreshToken = async (token, refreshTokenSecret) => {
//   return await promisify(jwt.verify)(token, refreshTokenSecret);
// };

export default {
  signAccessToken,
  verifyAccessToken,
  // signRefreshToken,
  // verifyRefreshToken,
};
