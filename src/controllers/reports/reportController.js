import { Reservation , PetitStockSale, db } from '../../models'
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import { Sequelize, Op } from 'sequelize';

const config = require('../../config/config.js');
const env = process.env.NODE_ENV;

let sequelize;

if (config[env].url) {
  sequelize = new Sequelize(config[env].url);
} else {
  sequelize = new Sequelize(process.env.DEV_DATABASE_URL);
}



// function to calculate the total amount for a given month and year
const calculateMonthlyAmount = async (year, month) => {
  const result = await Reservation.findAll({
    attributes: [
      [sequelize.fn('sum', sequelize.col('amount.RWF')), 'RWF_total'],
    ],
    where: {
      [Op.and]: [
        sequelize.where(sequelize.fn('year', sequelize.col('checkIn')), year),
        sequelize.where(sequelize.fn('month', sequelize.col('checkIn')), month)
      ]
    }
  });

  return result[0];
};


// function to calculate the monthly amounts for a given year
const calculateYearlyAmounts = async (year) => {
  const monthlyAmounts = [];
  for (let month = 1; month <= 12; month++) {
    const monthlyAmount = await calculateMonthlyAmount(year, month);
    monthlyAmounts.push(monthlyAmount);
  }
  return monthlyAmounts;
};



const yearlyReservation = asyncWrapper( async ( req, res) => {

const year = req.params.year || new Date().getFullYear();

// const results = await Reservation.findAll({
//   attributes: [
//     [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
//     [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('amount->>RWF'), 'numeric')), 'rwf_total'],
//     [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('amount->>USD'), 'numeric')), 'usd_total']
//   ],
//   where: Sequelize.where(
//     Sequelize.fn('date_part', 'year', Sequelize.col('createdAt')),
//     year
//   ),
//   group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
//   order: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
// });



const results = await calculateYearlyAmounts(year);

// res.json({
//   status: 'success',
//   year: year,
//   yearlyAmounts: results
// });

console.log(results);

return res.status(200).json({status: 'success', data: results});
})

const yearlySales = asyncWrapper( async(req , res) => {

  const year = req.params.year || new Date().getFullYear();
  
const results = await PetitStockSale.findAll({
  attributes: [
    [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
    [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('amount'), 'numeric')), 'rwf_total'],
  ],
  where: Sequelize.where(
    Sequelize.fn('date_part', 'year', Sequelize.col('createdAt')),
    year
  ),
  group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
  order: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
});

return res.status(200).json({status: 'success', data: results});
    
})

export default { yearlyReservation , yearlySales}