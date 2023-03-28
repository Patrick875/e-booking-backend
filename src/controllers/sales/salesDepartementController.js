import { SalesDepartement } from '../../models'
import { asyncWrapper } from '../../utils/handlingTryCatchBlocks'

const index = asyncWrapper( async (req, res) => {
    const data = await SalesDepartement.findAll({});
    return res.status(200).json({status: 'ok', data, message: 'all sales department' })
})
const create = asyncWrapper( async (req, res) => {
    if(!req.body?.name){
        return res.status(400).json({ status: 'error', message: 'The name filed is required' })
    }
   const data =  await SalesDepartement.create(req.body)

    return res.status(201).json({status: 'ok', data, message: 'All data'})
})

const destroy = asyncWrapper (async (req, res) => {
    if(!req.params?.id || isNaN(req.params.id)) return res.status(404).json({status: 'error', message: 'Id is required and should be a number'})
    const {id} = req.params

    const department = await SalesDepartement.findByPk(id)

    if(!department) return request.status(204).json({ status: 'error',message: 'Not Found'}) 

    await department.destroy()

    return request.status(200).json({ status: 'success', message: 'Departement deleted successfully' })
})

const update = asyncWrapper( async (req, res) => {
    if(!req.body?.id){
        return res.status(400).json({stats: 'error', message: 'Error updating Id is required' })
    }

    const department = await SalesDepartement.findByPk(id)

    if(!department) return request.status(204).json({ status: 'error',message: 'Not Found'})

    department.set(req.body)

    await department.save()

    return req.status(200).json({ status: 'success',message: 'Department updated successfully', data: department })
})

export default { index, update, destroy, create }