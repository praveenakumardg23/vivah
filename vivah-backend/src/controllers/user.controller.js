import User from "../models/user.model.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-refreshToken");

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};