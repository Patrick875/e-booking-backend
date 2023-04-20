import { DailyCash, User } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const index = asyncWrapper(async (req, res) => {
  const data = await DailyCash.findAll({
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
  });
  return res.status(200).json({ staus: "ok", data });
});

const update = asyncWrapper(async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ status: "error", message: "id not specified" });
  const data = await DailyCash.findByPk(id);
  if (!data)
    return res.status(404).json({ status: "error", message: "Not found" });

  data.set(req.body);

  await data.save();
  return res
    .status(200)
    .json({ status: "success", message: "Daily sales report updated" });
});

const create = asyncWrapper(async (req, res) => {
  const { amount, currency, paymentMethod, carriedBy } = req.body;

  if ((!amount, !currency, !paymentMethod, !carriedBy)) {
    return res.status.json({
      status: "error",
      message: "amount, currency, paymentMethod, carriedBy are required",
    });
  }
  const data = await DailyCash.create({ ...req.body, receivedBy: req.user.id });

  return res.status(201).json({ status: "ok", data });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ staus: "error", message: " Id is required" });
  }

  const result = await DailyCash.findByPk(req.params.id);
  if (!result) {
    return res
      .status(400)
      .json({ staus: "error", message: "No such record found" });
  }

  await result.destroy();
  return res
    .status(200)
    .json({ staus: "success", message: "Successfully deleted record" });
});
export default { create, index, update, destroy };
