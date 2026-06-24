import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    if (!decoded.isAdmin) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};