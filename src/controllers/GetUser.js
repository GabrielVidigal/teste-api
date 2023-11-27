const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || decoded.id !== user._id.toString()) {
      return res.status(401).json({ mensagem: "Token inválido" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ mensagem: "Sessão expirada" });
    } else {
      res.status(401).json({ mensagem: "Token inválido" });
    }
  }
};

module.exports = getUser;
