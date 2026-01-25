import jwt from "jsonwebtoken";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_PASSWORD // ✅ Fixed: Use same secret as user
    );

    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("error in admin middleware", error);
    return res.status(401).json({ error: "Invalid token or expired" });
  }
}

export default adminMiddleware;
