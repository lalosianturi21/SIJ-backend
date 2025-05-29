import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import { cloudinary } from "../middleware/uploadPictureMiddleware.js";
import User from "../models/User.js";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, interest, birth, password } = req.body;

    // check whether the user exists or not
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User have already registered");
    }

    // creating a new user
    user = await User.create({
      name,
      interest,
      birth,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      interest: user.interest,
      birth: user.birth,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        interest: user.interest,
        birth: user.birth,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        interest: user.interest,
        birth: user.birth,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId;


    // if (!req.user.admin && userId !== userIdToUpdate) {
    //   let error = new Error("Forbidden resource");
    //   error.statusCode = 403;
    //   throw error;
    // }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof req.body.admin !== "undefined" && req.user.admin) {
      user.admin = req.body.admin;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.interest = req.body.interest || user.interest;
    user.birth = req.body.birth || user.birth;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password length must be at least 6 character");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();

    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      interest: updatedUserProfile.interest,
      birth: updatedUserProfile.birth,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};
const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An error occurred while uploading: " + err.message);
        return next(error);
      }

      let updatedUser = await User.findById(req.user._id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Jika pengguna ingin menghapus foto profil tanpa menggantinya
      if (req.body.removeAvatar === "true") {
        if (updatedUser.avatar) {
          const publicId = updatedUser.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`post_images/${publicId}`);
        }

        updatedUser.avatar = ""; // Hapus avatar dari database
        await updatedUser.save();

        return res.json({
          _id: updatedUser._id,
          avatar: updatedUser.avatar,
          name: updatedUser.name,
          interest: updatedUser.interest,
          birth: updatedUser.birth,
          email: updatedUser.email,
          verified: updatedUser.verified,
          admin: updatedUser.admin,
          token: await updatedUser.generateJWT(),
        });
      }

      // Jika ada file baru yang diunggah, hapus gambar lama
      if (req.file) {
        if (updatedUser.avatar) {
          const publicId = updatedUser.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`post_images/${publicId}`);
        }

        updatedUser.avatar = req.file.path;
        await updatedUser.save();

        return res.json({
          _id: updatedUser._id,
          avatar: updatedUser.avatar,
          name: updatedUser.name,
          interest: updatedUser.interest,
          birth: updatedUser.birth,
          email: updatedUser.email,
          verified: updatedUser.verified,
          admin: updatedUser.admin,
          token: await updatedUser.generateJWT(),
        });
      }

      return res.status(400).json({ message: "No file uploaded" });

    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }
    let query = User.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};




export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
};
