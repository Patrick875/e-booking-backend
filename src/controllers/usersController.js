/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import { User, Role } from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";

import sendEmail from "../utils/sendEmail";

const getAllUsers = asyncWrapper(async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Role,
			attributes: { exclude: ["createdAt", "updatedAt"] },
		},
		attributes: {
			exclude: ["password", "createdAt", "updatedAt", "refreshToken"],
		},
	});
	res.status(200).json({ message: "ok", users });
});

const getUser = asyncWrapper(async (req, res) => {
	if (!req.params?.id) {
		return res.status(400).json({ message: "Bad Request" });
	}

	if (!isNaN(req.params.id)) {
		return res
			.status(400)
			.json({ message: "Bad Request ID should be a number" });
	}
	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res
			.status(204)
			.json({ message: `User with id : ${req.params.id} does not exist` });
	}
	res.status(200).json(user);
});

const createUser = asyncWrapper(async (req, res) => {
	if (
		!req.body?.firstName ||
		!req.body?.lastName ||
		!req.body?.email ||
		!req.body?.phone
	) {
		return res
			.status(400)
			.json({ message: "Please provide all required information" });
	}

	// check for duplicate usernames in the db
	const duplicate = await User.findOne({ where: { email: req.body.email } });
	if (duplicate) return res.status(409).json({ message: `User already exist` }); // Conflict

	req.body["password"] = await bcrypt.hash("12345678", 10);
	req.body["roleId"] = req.body?.role ? req.body.role : 1;

	const role = await Role.findByPk(req.body?.roleId);
	if (!role) {
		return res.status(404).json({ message: "Role does not exist" });
	}
	const user = await User.create(req.body);
	return res.status(201).json({ message: "ok", user });
});

const deleteUser = asyncWrapper(async (req, res) => {
	if (isNaN(req.params.id)) {
		return res
			.status(400)
			.json({ status: `error`, message: "Id must be a number" });
	}
	if (!req.params.id) {
		return res.status(400).json({ message: "Please provide user id" });
	}

	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res
			.status(204)
			.json({ message: `User with id : ${req.params.id} does not exist` });
	}

	await user.destroy();

	return res
		.status(200)
		.json({ status: "ok", message: "User deleted successfully" });
});

const updateUser = asyncWrapper(async (req, res) => {
	if (!req.body?.id) {
		return res
			.status(400)
			.json({ status: "error", message: " Id is required" });
	}
	if (!req.body.id) {
		return res
			.status(400)
			.json({ status: "error", message: "Please provide user id" });
	}

	const user = await User.findByPk(req.body.id);
	if (!user) {
		return res.status(404).json({
			status: "error",
			message: `User with id : ${req.body.id} does not exist`,
		});
	}

	if (req.body.role) {
		const role = await Role.findByPk(req.body.role);
		if (!role) {
			return res.status(204).json({
				status: "error",
				message: `Role with id : ${req.body.role} does not exist`,
			});
		}
	}

	user.set({ ...req.body, roleId: req.body.role });
	user.save();

	return res
		.status(200)
		.json({ status: "ok", message: "User updated successfully", data: user });
});

const changePassword = asyncWrapper(async (req, res, next) => {
	const { password, newPassword, confirmPassword } = req.body;

	const user = await User.findOne({
		where: { email: req.user.email },
		include: {
			model: Role,
			as: "Role",
			attributes: { exclude: ["createdAt", "updatedAt"] },
		},
		attributes: {
			exclude: [
				"createdAt",
				"updatedAt",
				"refreshToken",
				"roleId",
				"verifiedAT",
			],
		},
	});

	if ((!password, !newPassword, !confirmPassword)) {
		return res.status(400).json({
			status: "error",
			message: " Password, newPassword and confirmPassword are required",
		});
	}

	if (newPassword != confirmPassword) {
		return res.status(400).json({
			status: "error",
			message: "Password and confirm password do not match.",
		});
	}
	// evaluate password
	const match = await bcrypt.compare(password, user.password);
	if (match) {
		// const roles = Object.values(user.roles).filter(Boolean);
		user.set({ password: await bcrypt.hash(newPassword, 10) });
		user.save();
	}

	// Sent Email

	const emailContent = {
		email: user.email,
		subject: ` ${process.env.APP_NAME} , Password Changed`,
		html: `
        <body stye="font-family: Arial, sans-serif; font-size: 14px;line-height: 1.4;color: #333333; ">
        <h1 style="font-size: 18px;font-weight: bold;margin: 0 0 10px;">Your Olympic Hotel Management System Password Has Been Changed</h1>
        <p style="margin: 0 0 10px;">Dear ${user.firstname}</p>
        <p style="margin: 0 0 10px;">We're writing to let you know that your password for the Olympic Hotel Management System has been successfully Changed .
        Please use the new credentials to log in to your account:</p>
        <table style=" border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <th style="background-color: #eeeeee;font-weight: bold;text-align: left;">Username:</th>
            <td>${user.email}</td>
          </tr>
          <tr>
            <th style= "background-color: #eeeeee;font-weight: bold;text-align: left;">Password:</th>
            <td> ${newPassword} </td>
          </tr>
        </table>
        <p>Please log in to the system using your email address and your new password.</p>
        <p>If you did not request a password reset or if you have any concerns about the security of your account, <br /> please contact our support team immediately at [Support Email or Phone Number].</p>
        <p>Thank you,<br>The Olympic Hotel Management Team</p>
        </body>`,
	};

	// Send the email

	return (
		(await sendEmail(emailContent, req, res)) &&
		res
			.status(200)
			.json({ status: "success", message: "Passwor reset successfull" })
	);
});

const disactivate = asyncWrapper(async (req, res) => {
	if (isNaN(req.params.id)) {
		return res
			.status(400)
			.json({ status: `error`, message: "Id must be a number" });
	}
	if (!req.params.id) {
		return res.status(400).json({ message: "Please provide user id" });
	}

	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res
			.status(204)
			.json({ message: `User with id : ${req.params.id} does not exist` });
	}

	user.set({ status: "DISACTIVE" });
	await user.save();

	return res
		.status(200)
		.json({ status: "success", message: "userd Disactivated", data: user });
});

const reactivate = asyncWrapper(async (req, res) => {
	if (isNaN(req.params.id)) {
		return res
			.status(400)
			.json({ status: `error`, message: "Id must be a number" });
	}
	if (!req.params.id) {
		return res.status(400).json({ message: "Please provide user id" });
	}

	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res
			.status(204)
			.json({ message: `User with id : ${req.params.id} does not exist` });
	}

	user.set({ status: "ACTIVE" });
	await user.save();

	return res
		.status(200)
		.json({ status: "success", message: "userd re-activated", data: user });
});
export default {
	getAllUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
	changePassword,
	disactivate,
	reactivate,
};
