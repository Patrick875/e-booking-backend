export const limitDuplication = async (model, value,res) => { 
    const row = await model.findOne({ where: { name : value}})
    if(row){
        return res.status(409).json({ status: 'error' , message: `The same data : ${value} was already `})
    }
 }
