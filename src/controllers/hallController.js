import { Hall, Reservation } from '../models'

const CreateHall = async (req, res) => {
    if(!req?.body.name || !req?.body.price || !req?.body.size) {
        return res.status(400).json({ status: `error`, message: 'Hall name, size (capacity) and price required'})
    }

    try {
    const hall = await Hall.create(req.body);
    return res.status(201).json({status: "ok", message : "hall created succefully", data: hall});
    } catch (error) {

        return res.status(500).json({ status: `error`, message: error.message, error: error.message })
        
    }

}


const UpdateHall = async (req, res) => {
if(!req.body.id){
    return res.status(400).json({status: `error`,  message: 'Hall id is required'})
}
try{
    Hall.set(req.body)
    await Hall.save()
    return res.status(200).json({status: "ok", message : "hall Updated successfully"});
}
catch(error){
return res.status(400).json({ status: `error`, error: error.message, message: error.message})
}
}

const DeleteHall = async (req, res) => {
    if(!req.params.id){
        return res.status(400).json({ status: `error`, message: 'Hall id is required'})
    }
}

const AllHalls = async (req, res) => {
    try {
       const halls = await Hall.findAll({include: [Reservation]})
        return res.status(200).json({status: "ok", message : "All halls fetched successfully", data: halls});
        
    } catch (error) {

        return res.status(500).json({ status: `error`, message: error.message});
        
    }
}

export default { CreateHall, UpdateHall, DeleteHall, AllHalls }