import { asyncWrapper } from "./handlingTryCatchBlocks";
import db from '../models'
import Op from 'sequelize';
import moment from 'moment'


module.exports = async function generateOrderId(Model) {
  const now = moment().format('YYYY-MM-DD');
  const count = await Model.count({
    where: {
      createdAt: {
        [db.Sequelize.Op.gte]: now,
        [db.Sequelize.Op.lt]: moment(now).add(1, 'days').format('YYYY-MM-DD')
      }
    }
  });
  const lastRecord = await Model.findOne({
    order: [['createdAt', 'DESC']]
  });
  const lastDate = lastRecord ? moment(lastRecord.createdAt).format('YYYY-MM-DD') : null;
  const index = lastDate === now ? count : 1;
  const paddedIndex = index.toString().padStart(4, '0'); // Pad the index with leading zeros

  const date = moment(now);

  const year = date.year();
  const month = date.month() + 1; // Month is zero-indexed, so add 1
  const day = date.date();

  return `${paddedIndex}/${month}/${year}`;
};

  