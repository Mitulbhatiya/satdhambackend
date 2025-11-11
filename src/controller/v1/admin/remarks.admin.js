const { newRemark_joi, getAndDeleteRemark_joi, updateRemark_joi } = require('../../../joi/attendance/remark.joi')
const Remark = require('../../../models/attendance/remark')



// POST - New Offer
const newRemark = async (req, res, next) => {
    try {
        const { error, value } = await newRemark_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            // console.log(value);
            const new_remark = new Remark({
                SATID: value.SATID,
                note: value.note,
                zone: value.zone,
                attendance: value.attendance,
                createdBy: value.createdBy,
                isActive: true
            })
            await new_remark.save()
                .then((ress) => {
                    // console.log(ress);
                    res.status(200).json({
                        message: "Remark created successfully 😊",
                        result: ress
                    })
                })
                .catch(err => {
                    // console.log(err);
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                })
        }

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

//  GET remark by attendace id
const getRemark = async (req, res, next) => {
    try {
        const { error, value } = await getAndDeleteRemark_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            // console.log(value);
            await Remark.find({ attendance: value._id })
                .then((ress) => {
                    res.status(200).json({
                        message: "Remark GET it",
                        result: ress
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })
        }

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// PATCH
const updateRemark = async (req, res, next) => {
    try {
        const { error, value } = await updateRemark_joi.validate(req.body)
        console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Remark.updateOne({ _id: String(value._id) }, { $set: { note: String(value.note), SATID: String(value.SATID) } })
                .then((ress) => {
                    console.log(ress);
                    res.status(200).json({
                        message: "Remark Updated it",
                        result: {
                            _id: value._id,
                            note: value.note,
                            SATID: value.SATID,
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })
        }

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

// DELETE
const deleteRemark = async (req, res, next) => {
    try {
        const { error, value } = await getAndDeleteRemark_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            // console.log(value);
            await Remark.deleteOne({ _id: String(value._id) })
                .then((ress) => {
                    res.status(200).json({
                        message: "Remark DELETE it",
                        result: {
                            id: value._id
                        }
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })
        }

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

module.exports = { newRemark, getRemark, updateRemark, deleteRemark }