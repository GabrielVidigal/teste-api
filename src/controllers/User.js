const User = require("../models/User");
const generateToken = require("../utils/generateToken");

module.exports = {
  async create(req, res) {
    const { name, email, password, telefones } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json("Email já existente");
    }
    try {
      const user = await User.create({
        name,
        email,
        password,
        telefones,
      });
      const responseData = {
        _id: user._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ultimo_login: user.ultimo_login,
        token: generateToken(user._id),
      };
      res.status(201).json(responseData);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json("Usuário não existe!!");
    }

    if (await user.matchPassword(password)) {
      user.ultimo_login = Date.now(); 
      await user.save();
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        ultimo_login: user.ultimo_login,
        
      });
    } else {
      res.status(400).json("E-mail e/ou senha inválidos");
    }
  },
  async update(req, res) {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json("E-mail e/ou senha inválidos");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    try {
      const updateUser = await user.save();
      res.status(201).json(updateUser);
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
