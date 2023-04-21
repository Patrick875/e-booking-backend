import { DailyMoney,DailyMoneyDetail, User } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const index = asyncWrapper(async (req, res) => {

  const data = await DailyMoney.findAll({
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
        model: DailyMoneyDetail,
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
        attributes : {exclude: ["createdAt", "updatedAt"]},

      },
    ],
            attributes : {exclude: ["createdAt", "updatedAt"]},

  });
  return res.status(200).json({ staus: "ok", data });
});

const update = asyncWrapper(async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ status: "error", message: "id not specified" });
  const data = await DailyMoney.findByPk(id);
  if (!data)
    return res.status(404).json({ status: "error", message: "Not found" });

  data.set(req.body);

  await data.save();
  return res
    .status(200)
    .json({ status: "success", message: "Daily sales report updated" });
});

const create = asyncWrapper(async (req, res) => {
  const { data, totals } = req.body;

  for (let element of data) {
    const { amount, currency, paymentMethod, carriedBy } = element;

    if ((!amount, !currency, !paymentMethod, !carriedBy)) {
      return res.status.json({
        status: "error",
        message: "amount, currency, paymentMethod, carriedBy are required ",
      });
    }

    if(!await User.findByPk(carriedBy)){
      return res.status(404).json({status: 'error', message: ` User with ID ${carriedBy} not found` })
    }
  }



  if (!totals) {
    return res
      .status(400)
      .json({ status: "error", message: "Totals are required " });
  }

  const dailysales = await DailyMoney.create({
    date: new Date(),
    receivedBy: req.user.id,
    totals,
  });

  for (let element of data) {
   let dailysalesDetails =  await DailyMoneyDetail.create({ ...element, dailysalesId: dailysales.id });

   console.log(dailysalesDetails);
   console.log( ' === ===== ===')
  }

  const result = await DailyMoney.findAll({
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
        model: DailyMoneyDetail,
        include: [
          {
            model: User,
            attributes : {
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
        attributes : { exclude: ["createdAt", "updatedAt"] },

      },
    ],
  });

  return res.status(201).json({ status: "ok", data: result });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ staus: "error", message: " Id is required" });
  }

  const result = await DailyMoney.findByPk(req.params.id);
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
