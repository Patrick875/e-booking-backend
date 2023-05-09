import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role } from "../models";
import dotenv from "dotenv";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";
import { generatePassword } from "../utils/generatePassword";
import sendEmail from "../utils/sendEmail";

dotenv.config();

const handleLogin = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const user = await User.findOne({
    where: { email },
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

  if (!user) return res.status(401).json({ message: "user not registered" }); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // const roles = Object.values(user.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        user,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    await user.save();

    // Creates Secure Cookie with refresh token
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "None",
      expiresIn: expirationDate,
      maxAge: 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    return res
      .status(200)
      .json({ user, accessToken, message: "Loggin succesfull" });
  }
  return res.status(401).json({ message: "Login failed" });
});

const resetPassword = asyncWrapper(async (req, res) => {
  console.log(req.body.email);
  if (!req.body?.email) {
    return res
      .status(400)
      .json({ status: "error", message: "Email is required" });
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User with email not found" });
  }

  const password = generatePassword(6);

  const hashedpassword = await bcrypt.hash(password, 10);

  user.set({ password: hashedpassword });
  user.save();

  // Sent Email

  const emailContent = {
    email: user.email,
    subject: ` ${process.env.APP_NAME} , Password reset`,
    html: `<style type="text/css">
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: #333333;
  }
  h1 {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 10px;
  }
  p {
    margin: 0 0 10px;
  }
  table {
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  td, th {
    padding: 5px;
    border: 1px solid #cccccc;
  }
  th {
    background-color: #eeeeee;
    font-weight: bold;
    text-align: left;
  }
</style>
</head>
<body>
<h1>Your Olympic Hotel Management System Password Has Been Reset</h1>
<p>Dear [User],</p>
<p>We're writing to let you know that your password for the Olympic Hotel Management System has been successfully reset. Please use the following credentials to log in to your account:</p>
<table>
  <tr>
    <th>Username:</th>
    <td>${user.email}</td>
  </tr>
  <tr>
    <th>Password:</th>
    <td> ${password} </td>
  </tr>
</table>
<p>Please log in to the system using your email address and your new password.</p>
<p>If you did not request a password reset or if you have any concerns about the security of your account, please contact our support team immediately at [Support Email or Phone Number].</p>
<p>Thank you,<br>The Olympic Hotel Management Team</p>
</body>`,
  };

  // Send the email

  return (
    (await sendEmail(emailContent, req, res)) &&
    res.status(200).json({
      status: "success",
      message: "User Password reset successfully check your email",
    })
  );
});

export default { handleLogin, resetPassword };
