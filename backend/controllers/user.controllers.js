import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Get current user error",
      error: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name, email } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (image !== undefined) updateFields.image = image;

    let user = await User.findByIdAndUpdate(req.userId, updateFields, { new: true }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `profile error ${error}` });
  }
};

export const getOtherUsers = async (req, res) => {
    try {
        // req.userId comes from your isAuth middleware
        const loggedInUserId = req.userId; 

        // Find all users WHERE _id is NOT EQUAL ($ne) to the logged-in user's ID
        // .select("-password") ensures we don't send passwords to the frontend
        const otherUsers = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password");

        return res.status(200).json(otherUsers);

    } catch (error) {
        console.log("Get Other Users Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
