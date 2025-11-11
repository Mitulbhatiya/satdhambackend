// Model

const { createZone_joi, updateZone_name_joi, updateZone_location_joi } = require('../../../joi/zone/zone.joi')
const Zone = require('../../../models/zone/zone.model')

const createZone = async (req, res, next) => {
    try {
        const { error, value } = await createZone_joi.validate(req.body)
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {

            const zone = await Zone.countDocuments();
            const new_zone = new Zone({
                ID: `SATZ${zone + 1}`,
                name: value.name,
                location: value.location,
                pincode: value.pincode,
            })
            await new_zone.save()
                .then((ress) => {
                    // console.log(ress);
                    res.status(200).json({
                        message: "Zone created successfully 😊",
                        result: ress
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                })
        }


    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


const getZone = async (req, res, next) => {
    try {
        await Zone.find({})
            .populate('location')
            .then((ress) => {
                // console.log(ress);
                res.status(200).json({
                    message: "Zone geted successfully 😊",
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


const updateZone = async (req, res, next) => {
    switch (req.body.type) {
        case 'name':
            try {
                const { error, value } = await updateZone_name_joi.validate(req.body)
                if (error) {
                    res.status(302).json({
                        massage: "Validation fails to match the required pattern!",
                        result: "Validation fails to match the required pattern!"
                    })
                } else {
                    await Zone.updateOne({ _id: value._id }, { $set: { name: value.name, pincode: value.pincode } })
                        .then((ress) => {
                            if (ress.matchedCount === 1) {
                                res.status(200).json({
                                    message: "Zone updated successfully 😊",
                                    result: {
                                        _id: value._id,
                                        name: value.name,
                                        pincode: value.pincode
                                    }
                                })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        })
                        .catch(err => {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        })
                }
            } catch (err) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
            }
            break;

        case 'location':
            try {
                const { error, value } = await updateZone_location_joi.validate(req.body)
                if (error) {
                    res.status(302).json({
                        massage: "Validation fails to match the required pattern!",
                        result: "Validation fails to match the required pattern!"
                    })
                } else {
                    await Zone.updateOne({ _id: value._id }, { $set: { location: value.location } })
                        .then((ress) => {
                            if (ress.matchedCount === 1) {
                                Zone.findOne({ _id: value._id })
                                    .populate('location')
                                    .then((ress) => {
                                        // console.log(ress);
                                        res.status(200).json({
                                            message: "Zone updated successfully 😊",
                                            result: ress
                                        })
                                    })
                                    .catch(err => {
                                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                    })
                            } else {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        })
                        .catch(err => {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        })
                }
            } catch (err) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
            }
            break;
        default:
            break;
        // res.status(401).json({ message: "Opps! Somthing went wrong." })
    }

}

module.exports = { createZone, getZone, updateZone }