const { createSubZone_joi, updateSubZone_joi } = require('../../../joi/zone/subzone.joi');
const SubZone = require('../../../models/zone/subzone.model')
const User = require('../../../models/user/user.model')

const createSubZone = async (req, res, next) => {
    try {
        const { error, value } = await createSubZone_joi.validate(req.body)

        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {

            const subzone = await SubZone.find({
                ID: value.ID,
                zoneID: value.zoneID,
            })
            if (subzone.length > 0) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "Duplication" })
            } else {

                const new_subzone = new SubZone({
                    ID: value.ID,
                    zoneID: value.zoneID,
                })
                await new_subzone.save()
                    .then((ress) => {
                        // console.log(ress);
                        res.status(200).json({
                            message: "SubZone created successfully 😊",
                            result: ress
                        })
                    })
                    .catch(err => {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                    })
            }


        }


    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



const getSubZone = async (req, res, next) => {
    try {
        await SubZone.find({})
            .then((ress) => {
                // console.log(ress);
                res.status(200).json({
                    message: "SubZone geted successfully 😊",
                    result: ress
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
            })


    } catch (err) {
        // console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}




// Uodate


const updateSubZone = async (req, res, next) => {
    try {
        const { error, value } = await updateSubZone_joi.validate(req.body)

        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {

            const subzone = await SubZone.find({
                ID: value.ID,
                zoneID: value.zoneID,
            })
            if (subzone.length > 0) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "Duplication" })
            } else {
                await SubZone.updateOne({ _id: value._id }, { $set: { ID: value.ID } })
                    .then((ress) => {
                        if (ress.matchedCount === 1) {
                            User.updateMany({ $and: [{ zone: value.zoneID }, { subzone: value.oldSubzone }] }, { $set: { subzone: value.ID } })
                                .then((result) => {
                                    res.status(200).json({
                                        message: "SubZone updated successfully 😊",
                                        result: {
                                            _id: value._id,
                                            ID: value.ID,
                                        }
                                    })
                                })
                                .catch(err => {
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on user update" })
                                })

                        } else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update" })
                        }
                    })
                    .catch(err => {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on find-update" })
                    })
            }


        }
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



// Delete


const deleteSubZone = async (req, res, next) => {
    try {
        const value = req.body.data
        await SubZone.deleteOne({ $and: [{ ID: value.ID }, { zoneID: value.zoneID }] })
            .then((ress) => {
                res.status(200).json({
                    message: "SubZone deleted successfully 😊",
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on find-update" })
            })

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

module.exports = { createSubZone, getSubZone, updateSubZone, deleteSubZone }