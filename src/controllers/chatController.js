import { Chat, User } from "../models";
import { Op } from "sequelize";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  const { receiver, message, notifyAdmin } = req.body;
  if (!receiver) {
    return res
      .status(400)
      .json({ status: "error", message: " Receiver is required" });
  }
  if (!message) {
    return res
      .status(400)
      .json({ status: "error", message: " Message is required" });
  }

  const sender = req.user.id;

  const chart = await Chat.create({
    sender,
    receiver,
    message,
    status: "PENDING",
    notifyAdmin: notifyAdmin ? notifyAdmin : false,
  });
  const data = await Chat.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "verifiedAT",
          ],
        },
      },
    ],
    where: { [Op.or]: { receiver, sender } },
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ status: "success", data });
});

const show = asyncWrapper(async (req, res) => {
  const sender = req.user.id;
  const { receiver } = req.body;

  const data = await Chat.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "verifiedAT",
          ],
        },
      },
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "verifiedAT",
          ],
        },
      },
    ],
    where: { [Op.or]: { receiver, sender } },
    order: [["createdAt", "ASC"]],
  });

  return res.status(200).json({ status: "success", data });
});

export default { create, show };
