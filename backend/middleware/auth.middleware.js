import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("req.cookies:", req.cookies);
  console.log("req.headers['authorization']:", req.headers["authorization"]);

  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers["authorization"]) {
    token = req.headers["authorization"].replace("Bearer ", "");
  } else {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // attach payload to request
    next();
  });
};
