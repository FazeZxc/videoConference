import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "unauthorized",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
