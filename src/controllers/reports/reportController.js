import { Reservation, PetitStockSale, db } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import { Sequelize, Op } from "sequelize";


// function to calculate the monthly amounts for a given year
const calculateYearlyAmounts = async (year) => {
  const yearlyAmounts = {};
  for (let month = 1; month <= 12; month++) {
    const reservations = await Reservation.findAll({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.literal(`date_part('year', "createdAt") = ${year}`),
          Sequelize.literal(`date_part('month', "createdAt") = ${month}`)
        ]
      }
    });
    
    const monthlyAmount = reservations.reduce((total, reservation) => {
      return total + parseFloat(reservation.payment.RWF);
    }, 0);

   
    yearlyAmounts[new Date(year, month - 1).toLocaleString('default', { month: 'long' })] = monthlyAmount;
  }
  return yearlyAmounts;
};


const yearlyReservation = asyncWrapper(async (req, res) => {
  const year = req.params.year || new Date().getFullYear();

    const yearlyAmounts = await calculateYearlyAmounts(year);

  return res.status(200).json({ status: "success", data: yearlyAmounts });
});

const yearlySales = asyncWrapper(async (req, res) => {
  const year = req.params.year || new Date().getFullYear();

  const results = await PetitStockSale.findAll({
    attributes: [
      [
        Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        "month",
      ],
      [
        Sequelize.fn("SUM", Sequelize.cast(Sequelize.col("amount"), "numeric")),
        "rwf_total",
      ],
    ],
    where: Sequelize.where(
      Sequelize.fn("date_part", "year", Sequelize.col("createdAt")),
      year
    ),
    group: [Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt"))],
    order: [Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt"))],
  });

  return res.status(200).json({ status: "success", data: results });
});

export default { yearlyReservation, yearlySales };
