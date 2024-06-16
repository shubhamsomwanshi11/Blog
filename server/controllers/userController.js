const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')

// Register new usr
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422))
        }
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail })

        if (emailExists)
            return next(new HttpError("User already exists.", 422));
        if ((password.trim()).length < 8)
            return next(new HttpError("Password should be at least 8 characters.", 422))
        if (password != password2)
            return next(new HttpError("Password do not match.", 422))
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email: newEmail, password: hashedPass })
        res.status(201).json(`You are registered sucessfully.`);
    } catch (error) {
        return next(new HttpError("User registation failed.", 422));
    }
}

// Login 
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });
        if (!user)
            return next(new HttpError("Invalid credentials.", 422))

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return next(new HttpError("Invalid credentails."))
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).json({ token, id, name })
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 422))
    }
}

// user profile
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password')
        if (!user)
            return next(new HttpError("User not found", 404));

        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}

// Change user avatar
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an Image.", 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 403));
        }

        // Delete old avatar if it exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    console.error(err);
                    // Proceed without returning, since deletion failure is not critical for new upload
                }
            });
        }

        const { avatar } = req.files;
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture size should be less than 500KB.", 422));
        }

        let fileName = avatar.name;
        let splittedFileName = fileName.split('.');
        let newFileName = `${splittedFileName[0]}_${uuid()}.${splittedFileName[splittedFileName.length - 1]}`;

        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError("Failed to upload image.", 500));
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true });
            if (!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed.", 422));
            }

            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError(error.message || "An error occurred.", 500));
    }
};

// Edit user details
const updateDetails = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmPassword } = req.body;

        if (!name || !email || !currentPassword || !newPassword || !confirmPassword)
            return next(new HttpError("Fill in all fields"), 422);

        const user = await User.findById(req.user.id);
        if (!user)
            return next(new HttpError("User not found", 403));

        const emailExist = await User.findOne({ email })
        if (emailExist && emailExist._id != req.user.id)
            return next(new HttpError("Email already exist.", 422))

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword)
            return next(new HttpError("Invalid current password", 422));

        if (newPassword != confirmPassword)
            return next(new HttpError("New password do not match", 422))

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt);

        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true })
        res.status(200).json(newInfo);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Get author details
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error, 422))
    }
}

module.exports = { registerUser, loginUser, getUser, changeAvatar, updateDetails, getAuthors };