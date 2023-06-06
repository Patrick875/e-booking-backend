import {
	Invoiced,
	InvoiceDetail,
	User,
	InvoicePayment,
	Account,
	CashFlow,
} from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from "../../utils/generateChonologicId";

const create = asyncWrapper(async (req, res) => {
	const data = req.body;

	if (!data.details || !data.clientName || !data.clientType || !data.function) {
		return res.status(400).json({
			status: "error",
			message: "details ,clientName, clientType , function is requried ",
		});
	}
	let total = 0;

	for (let dataElement of data.details) {
		if (
			(!dataElement.quantity ||
				!dataElement.times ||
				(!dataElement.price && !dataElement.unitPrice),
			!dataElement.name)
		) {
			return res.status(400).json({
				status: "error",
				message: `Quantity, times, price and name are both required under details`,
			});
		}

		total =
			total +
			Number(
				dataElement.price *
					dataElement.quantity *
					(dataElement?.times ? dataElement?.times : 1)
			);
	}

	const invoice = await Invoiced.create({
		userId: req?.user?.id,
		clientName: data.clientName,
		clientType: data.clientType,
		function: data.function,
		total,
		status: "PENDING",
		invoiceGenerated: `IV_${await generateId(Invoiced)}`,
	});

	for (let element of data.details) {
		await InvoiceDetail.create({
			name: element.name,
			times: element.times,
			quantity: element.quantity,
			price: element?.price || element?.unitPrice,
			VAT: element.VAT,
			invoiceId: invoice.id,
		});
	}

	const delivery = await Invoiced.findByPk(invoice.id, {
		include: {
			model: InvoiceDetail,
			attributes: { exclude: ["createdAt", "updatedAt"] },
		},
	});

	return res.status(200).json({
		status: "success",
		message: " Successfull Delivery note created sent",
		data: delivery,
	});
});

const index = asyncWrapper(async (req, res) => {
	const data = await Invoiced.findAll({
		include: [
			{
				model: InvoiceDetail,
				attributes: { exclude: ["createdAt", "updatedAt"] },
			},
			{
				model: InvoicePayment,
				attributes: { exclude: ["createdAt", "updatedAt"] },
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
	});

	return res.status(200).json({ status: "success", data });
});

const payment = asyncWrapper(async (req, res) => {
	const { invoiceId, payment, paymentIdentification, amount, paymentMethod } =
		req.body;
	if (!id) {
		return res.status(404).json({
			status: "error",
			message: "invoice ID is required!!!",
		});
	}
	let invoice = await Invoiced.findByPk(id, {
		include: [
			{
				model: InvoiceDetail,
				attributes: { exclude: ["createdAt", "updatedAt"] },
			},
		],
		attributes: { exclude: ["updatedAt"] },
	});
	if (!invoice) {
		return res.status(404).json({
			status: "error",
			message: "Delivery note related to this Id not found",
		});
	}

	await InvoicePayment.create({
		paymentIdenfication: paymentIdenfication,
		amount: amount,
		paymentMethod: paymentMethod,
		userId: req?.user?.id,
		invoiceId: invoiceId,
	});

	let accountInfo = await Account.findOne({ where: { name: "CASH" } });

	if (!accountInfo) {
		accountInfo = await Account.create({ name: "CASH", balance: 0 });
	}

	const cash_flow = await CashFlow.create({
		prevBalance: accountInfo.balance,
		newBalance: Number(accountInfo.balance) + Number(amount),
		date: new Date(),
		description: `Payment of ${amount} for invoice ${invoiceId} done by ${req.user.id} `,
		amount,
		account: "CASH",
		accountType: "DEBIT",
		doneBy: req.user.id,
		doneTo: "",
		status: "SUCCESS",
	});

	if (cash_flow) {
		accountInfo.set({ balance: cash_flow.newBalance });
	}
	await accountInfo.save();

	return res.status(200).json({
		status: "success",
		message: `Success Invoice payment completed `,
	});
});

const approve = asyncWrapper(async (req, res) => {
	const { id } = req.body;
	if (!id)
		return res.status(404).json({
			status: "error",
			message: "The ID is required",
		});

	let invoice = await Invoiced.findByPk(id, {
		include: [
			{
				model: InvoiceDetail,
				attributes: { exclude: ["createdAt", "updatedAt"] },
			},
		],
		attributes: { exclude: ["updatedAt"] },
	});

	if (!invoice)
		return res.status(404).json({
			status: "error",
			message: "Delivery note related to this Id not found",
		});

	await Invoiced.update({ status: "APPROVED" }, { where: { id } });

	return res
		.status(200)
		.json({ status: "OK", message: " approved", data: invoice });
});

const show = asyncWrapper(async (req, res) => {
	if (!req.params.id) {
		return res
			.status(400)
			.json({ status: "error", message: " Id is required" });
	}

	const data = await Invoiced.findByPk(req.params.id, {
		include: [
			{
				model: InvoiceDetail,
				attributes: { exclude: ["createdAt", "updatedAt"] },
			},
		],
	});

	return res.status(200).json({ status: "Ok", data });
});

const destroy = asyncWrapper(async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ status: "error", message: "Id is required" });
	}

	const invoice = await Invoiced.findByPk(req.params.id);

	if (!invoice) {
		return res
			.status(200)
			.json({ status: "success", message: " InvoiceDetail not found" });
	}

	await invoice.destroy({
		include: [
			{
				model: InvoiceDetail,
				as: "InvoiceDetails",
			},
		],
	});
	return res.status(200).json({
		status: "success",
		message: "InvoiceDetail successfully destroyed",
	});
});

export default { create, index, approve, payment, show, destroy };
