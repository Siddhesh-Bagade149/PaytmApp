const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(typeof authHeader);
  console.log(authHeader);
  console.log(authHeader.startsWith("Bearer "));
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ msg: "problem with header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({ msg: "problem inside jwt decode" });
    }
    // req.userId = decoded.userId;
    // next();
  } catch (err) {
    return res.status(403).json({ msg: "problem after decode jwt" });
  }
};
module.exports = {
  authMiddleware,
};