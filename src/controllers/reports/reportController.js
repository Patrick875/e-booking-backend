import { Reservation, PetitStockSale, db } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import { Sequelize, Op } from "sequelize";


const yearlyReservation = asyncWrapper(async (req, res) => {
  const year = req.params.year || new Date().getFullYear();

  // Controller function to handle requests for yearly reservation data

  // Retrieve reservation data for the year
  const reservations = await Reservation.findAll({
    where: {
      checkIn: {
        [Sequelize.Op.between]: [`${year}-01-01`, `${year}-12-31`],
      },
    },
    attributes: ["id", "roomNumber", "checkIn", "checkOut", "amount"],
    order: ["checkIn"],
  });

  // Group reservation data by month
  const reservationDataByMonth = {};
  for (let month = 1; month <= 12; month++) {
    reservationDataByMonth[month] = [];
    const reservationsInMonth = reservations.filter(
      (reservation) => reservation.checkIn.getMonth() + 1 === month
    );
    for (let reservation of reservationsInMonth) {
      reservationDataByMonth[month].push({
        id: reservation.id,
        roomNumber: reservation.roomNumber,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        amount: reservation.amount,
      });
    }
  }

  // Build response object
  const response = {
    year: year,
    reservationDataByMonth: reservationDataByMonth,
  };

  return res.status(200).json({ status: "success", data: response });
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
