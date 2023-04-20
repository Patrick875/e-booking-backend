import { CashFlow, Account, User } from "../../models";
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
      message: "The user who carries the money is required",
    });
  }


  if (!req.body.account) {
    return res
      .status(400)
      .json({ status: "error", message: "The account is required" });
  }


  const { account, amount, description, doneTo } = req.body;

  let accountInfo = await Account.findOne({ where: { name: 'CASH' } });

  if (
    !accountInfo 
  ) {
    accountInfo = await Account.create({ name: 'CASH' , balance : 0 });
  }

  const cash_flow = await CashFlow.create({
    prevBalance: accountInfo.balance,
    newBalance: Number(accountInfo.balance + amount),
    date: new Date(),
    description ,
    amount,
    account,
    accountType: "DEBIT",
    doneBy: req.user.id,
    doneTo,
    status: "SUCCESS",
  });

  if (cash_flow) {
    accountInfo.set({ balance : cash_flow.newBalance });
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
 

  if (!req.body.account) {
    return res
      .status(400)
      .json({ status: "error", message: "The account is required" });
  }

  const { accountId, account, amount, description, doneTo } = req.body;

  if (account && accountId) {
    return request
      .status(200)
      .json({
        status: "error",
        message: "Both account and accountId can't be filled at once "
      });
  }

  let accountInfo =  await Account.findOne( { where : { name : 'CASH' }});

  if(!accountInfo) {
    accountInfo = await Account.create({ name: 'CASH' , balance : 0 });
  }


  const cash_flow = await CashFlow.create({
    prevBalance: accountInfo.balance,
    newBalance: Number( accountInfo.balance - amount ),
    date: new Date(),
    amount,
    account,
    description,
    accountType: "CREDIT",
    doneBy: req.user.id,
    doneTo,
    status: "SUCCESS",
  });

  if (cash_flow) {
    accountInfo.set({ balance: cash_flow.newBalance });
  }
  await accountInfo.save();

  return res.status(200).json({
    status: "success",
    message: `Success ${amount} Credited from ${accountInfo.name} account `,
    data: cash_flow,
  });
});

const cashFlows = asyncWrapper(async (req, res) => {
  const data = await CashFlow.findAll({
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

  return res.status(200).json({ status: "success", data });
});
export default { credit, debit, cashFlows };
