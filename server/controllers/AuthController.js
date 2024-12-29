import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signup = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }
    const user = await User.create({ email, password });

    const token = await createToken(email, user._id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: error.message || "OOPs Something went wrong" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password Both are required");
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("Please Enter the Registered Email");
    }



    let isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(404).send("Enter the correct password");
    }

    //   console.log(user);
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: error.message || "OOPs Something went wrong" });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    // console.log(req.userId);
    const userData = await User.findById(req.userId);
    // console.log(userData);
    if (!userData) {
      return res.status(404).send("User with the given id not found");
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: error.message || "OOPs Something went wrong" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { color, firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .send(" Firstname, LastName and Color is required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: error.message || "OOPs Something went wrong" });
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    // console.log(req.file);

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    fs.renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });

  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: error.message || "OOPs Something went wrong" });
  }
};

export const removeProfileImage = async (req, res, next) => {
    try {
        
        const {userId} = req;
        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(404).send("User not found.");
        }

        if(user.image)
        {
            fs.unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return res.status(200).send("Profile image removed successfully");

    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
};


export const logoutProfile = async (req, res, next) => {
    try {
        
        res.cookie('jwt',"",{maxAge:1,secure:true,sameSite:"None"});

        return res.status(200).send("Logout successfull.");

    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
};
