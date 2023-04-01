import db from "../models";
export const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    //handling try catch block function
    // const t = await db.sequelize.transaction();
    try {
      await fn(req, res, next);
      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      // await t.commit();
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.errors ? err.errors[0].message : err.message,
      });
      // await t.rollback()
    }
  };
};
