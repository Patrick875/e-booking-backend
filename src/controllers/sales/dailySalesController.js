import { DailyMoney, DailyMoneyDetails, User } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const index = asyncWrapper(async (req, res) => {
	const data = await DailyMoney.findAll({
		include: [
			{
				model: User,
				as: "receiver",
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
		attributes: { exclude: ["createdAt", "updatedAt"] },
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
		let dailysalesDetails = await DailyMoneyDetail.create({
			...element,
			dailysalesId: dailysales.id,
		});
	}

	const result = await DailyMoney.findAll({
		include: [
			{
				model: User,
				as: "receiver",
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
				attributes: { exclude: ["updatedAt"] },
			},
		],
	});

	return res.status(201).json({ status: "ok", data: result });
});

const destroy = asyncWrapper(async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ staus: "error", message: " Id is required" });
	}

	const result = await DailyMoneys.findByPk(req.params.id);
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

const addDetail = asyncWrapper(async (req, res) => {
	const { id, data } = req.body;

	const dailysales = await DailyMoney.findByPk(id);

	if (!dailysales) {
		return res
			.status(404)
			.json({ status: "error", message: "No Dailysales found" });
	}
	let totals = dailysales.totals;

	if (totals.hasOwnProperty(data.currency)) {
		dailysales.totals[data.currency] += data.amount;
	} else {
		dailysales.totals[data.currency] = data.amount;
	}
	dailysales.save();

	let dailysalesDetails = await DailyMoneyDetails.create({
		...data,
		dailysalesId: id,
	});

	const result = await DailyMoneys.findByPk(id, {
		include: [
			{
				model: User,
				as: "receiver",
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

	return res
		.status(200)
		.json({ status: "success", message: "ok", data: result });
});
export default { create, index, update, destroy, addDetail };
