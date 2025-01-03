import jwt from "jsonwebtoken";

const generateToken = (id, username, email) => {
  return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

export default generateToken;
