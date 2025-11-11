const Donetion = require('../../../models/satshri/donetion.models')

const AddData = async (req, res, next) => {
    try {
        const folder = new Donetion(req.body);
        const savedFolder = await folder.save();
        res.status(200).json({
            message: "Donetion created successfully 😊",
            result: savedFolder
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}

const GetData = async (req, res, next) => {
    try {
        const uploads = await Donetion.find({ userid: req.body.userid })
        // console.log(uploads);
        res.status(200).json({
            message: "Data get successfully 😊",
            result: uploads
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}


// Update

const updateData = async (req, res, next) => {
    try {
        const body = req.body
        await Donetion.updateOne({ _id: String(body._id) }, { $set: { date: body.date, donetion: Number(body.donetion), type: String(body.type), note: String(body.note) } })
            .then((ress) => {
                res.status(200).json({
                    message: "Youtube link Updated it!",
                    result: {
                        _id: body._id,
                        date: body.date,
                        donetion: body.donetion,
                        type: body.type,
                        note: body.note,
                    }
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update" })
            })

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



const deleteData = async (req, res, next) => {
    try {
        const uploads = await Donetion.deleteOne({ _id: req.body._id })
        // console.log(uploads);
        res.status(200).json({
            message: "Data deleted successfully 😊",
            result: uploads
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}
module.exports = { AddData, GetData, updateData, deleteData }