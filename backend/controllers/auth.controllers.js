import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//-----Signup-------
export const signUp = async (req, res) => {
  try {
    //Username
    const { userName, email, password } = req.body;
    const checkUserByUserName = await User.findOne({ userName });
    if (checkUserByUserName) {
      return res.status(400).json({ message: "UserName Already Exist" });
    }
    //Email
    const checkUserByEmail = await User.findOne({ email });
    if (checkUserByEmail) {
      return res.status(400).json({ message: "Email Already Exist" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password all most 6 character" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    })

    const userResponse = await User.findById(user._id).select("-password");

    return res.status(201).json(userResponse)

  } catch (error) {
    return res.status(500).json({message:`signup error ${error}`})
  }
};

//------Login--------

export const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
   
    //Email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user doesn't exist" });
    }
    //password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({message:"incorrect password"})
    }

    
    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    })

    const userResponse = await User.findById(user._id).select("-password");

    return res.status(200).json(userResponse)

  } catch (error) {
    return res.status(500).json({message:`login error ${error}`})
  }
};

//-----logout------

export const logOut = async (req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"logOut successfully"})
  } catch (error) {
    return res.status(500).json({message:`log out error ${error}`})
  }
}
