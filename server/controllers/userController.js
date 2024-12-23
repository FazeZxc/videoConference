import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs'
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10)

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username: username,
      email : email,
      password : hashedPassword
    });

    res.cookie("token" , generateToken(user._id));
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkUser = (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const logoutUser = async (req, res) =>{
  try{
    res.clearCookie('token')
    res.send("Logged Out Succesfully")
  }catch(error){
    res.status(500).json({message : error.message})
  }
}

export { registerUser, loginUser , logoutUser , checkUser };