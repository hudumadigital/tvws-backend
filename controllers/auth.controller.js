const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postRegister = async (req, res, next) => {
	const { firstname, lastname, username, password, mobile, email } = req.body;
	// return console.log(req.body)
	email.toString().toLowerCase();
	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const error = new Error("User already exists, user other email");
			error.statusCode = 401;
			throw error;
		}
		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = new User({
			username: username,
			mobile: +mobile,
			firstname: firstname,
			lastname: lastname,
			password: hashedPassword,
			email: email,
		});
		const savedUser = await newUser.save();
		if (!savedUser) {
			const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
			error.statusCode = 500;
			throw error;
		}
		res.status(200).json({ message: "User registered", success: true });
	} catch (error) {
		next(error);
	}
};
exports.postLogin = async (req, res, next) => {
	const { password, email } = req.body;
	try {
		email.toString().toLowerCase();
		const foundUser = await User.findOne({ email: email });
		if (!foundUser) {
			const error = new Error(
				"User with email " + email + " does not exist, Consider register"
			);
			error.statusCode = 401;
			throw error;
		}
		validateHelper(password, foundUser.password, (doMatch) => {
			if (!doMatch) {
				// return res.status(200).json({
				//   message: "Either email or password is incorrect",
				//   isLoggedIn: false,
				// });
				const error = new Error("Either email or password is incorrect");
				error.statusCode = 401;
				throw error;
			}
			if (doMatch) {
				const token = jwt.sign(
					{
						email: foundUser.email,
						userID: foundUser._id,
					},
					"secureSecurityLine",
					{ expiresIn: "1hr" }
				);
				res.status(201).json({
					success: true,
					token: token,
					email: foundUser.email,
					userID: foundUser._id,
					isLoggedIn: true,
					expiresIn: 3600,
					username: foundUser.username,
				});
			}
		});
	} catch (error) {
		next(error);
	}
};
const validateHelper = async (password, hashedPassword, callback) => {
	try {
		const doMatch = await bcrypt.compare(password, hashedPassword);

		if (doMatch) return callback(doMatch);
		return callback(doMatch);
	} catch (error) {
		return callback(false);
	}
};
