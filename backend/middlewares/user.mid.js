import jwt from "jsonwebtoken";

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1️⃣ Token check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    // 2️⃣ Verify token using ENV secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_PASSWORD);

    // 3️⃣ Attach user info to request
    req.userId = decoded.userId || decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default userMiddleware;
