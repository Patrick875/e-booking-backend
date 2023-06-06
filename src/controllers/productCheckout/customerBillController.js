import {
	CustomerBill,
	CustomerBillDetail,
	User,
	Product,
	Package,
	PetitStock,
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
const index = asyncWrapper(async (req, res) => {
	const data = await CustomerBill.findAll({
		include: [
			{
				model: CustomerBillDetail,
				attributes: { exclude: ["createdAt", "updatedAt"] },
				include: [
					{
						model: Product,
						attributes: { exclude: ["createdAt", "updatedAt"] },
						include: [
							{
								model: Package,
								attributes: { exclude: ["createdAt", "updatedAt"] },
							},
						],
					},
					{
						model: Package,
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
				],
			},
			{
				model: PetitStock,
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

const update = asyncWrapper(async (req, res) => {
	let newDetails = [];

	if (!req.body.id || !req.body.details || !req.body.amount) {
		res.status(400).json({
			status: "failed",
			message: "provide the customer bill id, details and amount",
		});
	}

	const customerbill = await CustomerBill.findByPk(req.body.id);
	if (!customerbill) {
		res.status(400).json({
			status: "customer bill not found",
			message: "customer bill not found",
		});
	}

	for (element in req.body.details) {
		let detail = await CustomerBillDetail.create({
			customerbillId: customerbill.id,
			packageId: element.packageId,
			productId: element.productId,
			quantity: element.quantity,
			userId: req.user.id,
			date: new Date(),
		});
		if (detail) {
			newDetails.push(detail);
		}
	}

	if (newDetails && newDetails.length !== 0) {
		await Customer.set(
			{ CustomerBillDetail: [...newDetails] },
			{ where: { id: customerbill.id } }
		);
	}

	res.status(200).json({
		status: "Customer bill updated",
		data: customerbill,
	});
});

const destroy = asyncWrapper(async (req, res) => {
	if (!req.body.id) {
		res.status(400).json({
			status: "failed",
			message: "provide the customer bill id",
		});
	}
	const bill = await CustomerBill.findOne({ where: { id: req.body.id } });

	if (bill) {
		await bill.destroy();
		res.status(200).json({
			status: "success",
			message: "Customer bill deleted successfuly",
		});
	}
});

export default { index, update, destroy };
