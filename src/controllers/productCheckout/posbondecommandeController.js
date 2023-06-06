import {
	PosBonDeCommande,
	PosBonDeCommandeDetail,
	PetitStock,
	Product,
	Package,
	ProductPackage,
	User,
} from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
const index = asyncWrapper(async (req, res) => {
	const data = await PosBonDeCommande.findAll({
		include: [
			{
				model: PosBonDeCommandeDetail,
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
						model: ProductPackage,
						attributes: { exclude: ["createdAt", "updatedAt"] },
					},
				],
				attributes: { exclude: ["createdAt", "updatedAt"] },
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

	const posbon = await PosBonDeCommande.findByPk(req.body.id);
	if (!posbon) {
		res.status(400).json({
			status: "bon de commande not found",
			message: "bon de commande not found",
		});
	}

	for (element in req.body.details) {
		let detail = await PosBonDeCommandeDetail.create({
			posbondecommandeId: posbon.id,
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
		await PosBonDeCommande.set(
			{ PosBonDeCommandeDetail: [...newDetails] },
			{ where: { id: posbon.id } }
		);
	}

	res.status(200).json({
		status: "bon de commande updated",
		data: posbon,
	});
});

const destroy = asyncWrapper(async (req, res) => {
	if (!req.body.id) {
		res.status(400).json({
			status: "failed",
			message: "provide the customer bill id",
		});
	}
	const bill = await PosBonDeCommande.findOne({ where: { id: req.body.id } });

	if (bill) {
		await bill.destroy();
		res.status(200).json({
			status: "success",
			message: "bon de commande deleted successfuly",
		});
	} else {
		res.status(200).json({
			status: "Fail",
			message: "bon de commande does not exit",
		});
	}
});

export default { index, update, destroy };
