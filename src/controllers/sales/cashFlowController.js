import { CashBook, Account, User } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const debit = asyncWrapper(async (req, res) => {
  if (!req.body.amount) {
    return res
      .status(400)
      .json({ status: "error", message: "amount must be provided " });
  }
  if (!req.body.doneTo) {
    return res.status(400).json({
      status: "error",
      message: "The ID of who carries the money is required",
    });
  }
  if (!req.body.description) {
    return res
      .status(200)
      .json({ status: "error", message: "The description is required" });
  }

  if (!req.body.account) {
    return res
      .status(400)
      .json({ status: "error", message: "The account is required" });
  }

  const userDoneTo = await User.findByPk(req.body.doneTo);

  if (!userDoneTo)
    return res.status(404).json({
      status: "error",
      message: `The user associated to id ${req.body.doneTo} is not found `,
    });

  const { account, amount, description, doneTo } = req.body;

  let accountInfo = await Account.findOne({ where: { name: account } });

  if (
    !accountInfo ||
    (accountInfo?.name.toLowerCase() != req.body.account.toLowerCase())
  ) {
    accountInfo = await Account.create({ name: account, balance: 0 });
  }

  const cashFlow = await CashBook.create({
    prevBalance: accountInfo.balance,
    newBalance: Number(accountInfo.balance + amount),
    date: new Date(),
    description,
    amount,
    accountType: "DEBIT",
    doneBy: req.user.id,
    doneTo ,
    status: "SUCCESS",
  });

  if (cashFlow) {
    accountInfo.set({ balance: cashFlow.newBalance });
  }
  await accountInfo.save();

  return res.status(200).json({
    status: "success",
    message: `Success ${amount} Debited on ${accountInfo.name} account `,
  });
});

const credit = asyncWrapper(async (req, res) => {
  if (!req.body.amount) {
    return res
      .status(400)
      .json({ status: "error", message: "amount must be provided " });
  }
  if (!req.body.doneTo) {
    return res.status(400).json({
      status: "error",
      message: "The ID of who carries the money is required",
    });
  }
  if (!req.body.description) {
    return res
      .status(200)
      .json({ status: "error", message: "The description is required" });
  }

  if (!req.body.account) {
    return res
      .status(400)
      .json({ status: "error", message: "The account is required" });
  }

  const userDoneTo = await User.findByPk(req.body.doneTo);

  if (!userDoneTo)
    return res.status(404).json({
      status: "error",
      message: `The user associated to id ${req.body.doneTo} is not found `,
      data: cashFlow,
    });

  const { account, amount, description, doneTo } = req.body;

  let accountInfo = await Account.findOne({ where: { name: account } });

  if (
    !accountInfo ||
   ( accountInfo?.name.toLowerCase() != req.body.account.toLowerCase())
  ) {

    return res
      .status(404)
      .send({
        status: "error",
        message: `Invalid account ${account} can't perform credit operation`,
      });
  }

  const cashFlow = await CashBook.create({
    prevBalance: accountInfo. balance,
    newBalance: Number(accountInfo.balance - amount),
    date: new Date(),
    amount,
    description,
    accountType: "CREDIT",
    doneBy: req.user.id,
    doneTo,
    status: "SUCCESS",
  });

  if (cashFlow) {
    accountInfo.set({ balance : cashFlow.newBalance });
  }
  await accountInfo.save();

  return res.status(200).json({
    status: "success",
    message: `Success ${amount} Credited from ${accountInfo.name} account `,
    data: cashFlow,
  });
});

const cashFlows = asyncWrapper( async ( req, res ) => {
  const data = await CashBook.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "roleId",
          ],
        },
      },
    ],
  });

  return res.status(200).json( { status: 'success' , data })

} )
export default { credit, debit, cashFlows };
