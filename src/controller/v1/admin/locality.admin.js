// Model

const { newLocation_joi, updateLocation_joi } = require("../../../joi/locality/locality.joi")
const Location = require("../../../models/locality/locality.model")


const multer = require('multer');
const csv = require("csvtojson");

// POST - New Offer
const newLocation = async (req, res, next) => {
    try {
        const { error, value } = await newLocation_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            // console.log(value);
            const localation = await Location.find({
                state: value.state,
                city: value.city,
                country: value.country,
            })
            if (localation.length > 0) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "Duplication" })
            } else {
                const new_location = new Location({
                    state: value.state,
                    city: value.city,
                    country: value.country,
                })
                await new_location.save()
                    .then((ress) => {
                        // console.log(ress);
                        const data = {
                            _id: ress._id,
                            state: value.state,
                            city: value.city,
                            country: value.country,
                        }
                        res.status(200).json({
                            message: "Location created successfully 😊",
                            result: data
                        })
                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                    })
            }
        }


    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// GET
const getLocation = async (req, res, next) => {
    try {
        await Location.find({}, { createdAt: 0, updatedAt: 0 })
            .then((ress) => {
                res.status(200).json({
                    message: "Location GET it",
                    result: ress
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// PATCH
const updateLocation = async (req, res, next) => {
    try {
        const { error, value } = await updateLocation_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Location.updateOne({ _id: String(value._id) }, { $set: { state: String(value.state), country: String(value.country), city: String(value.city) } })
                .then((ress) => {
                    res.status(200).json({
                        message: "Location Updated it",
                        result: {
                            _id: value._id,
                            state: value.state,
                            country: value.country,
                            city: value.city
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

// DELETE
const deleteLocation = async (req, res, next) => {

    try {
        await Location.deleteOne({ _id: String(req.body.id) })
            .then((ress) => {
                res.status(200).json({
                    message: "Offer DELETE it",
                    result: {
                        id: req.body.id
                    }
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



var upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only csv format allowed!'));
        }
    },
}).single("locationCSV")
// POST By CSV
const AddLocationByCSV = async (req, res, next) => {
    upload(req, res, async function (err) {
        const body = req.body;
        // console.log(req.file);

        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {

            await csv().fromString(req.file.buffer.toString())
                .then(
                    async json => {
                        json.map(location => {
                            location.country = location["COUNTRY"];
                            location.state = location["STATE"];
                            location.city = location["CITY"];
                        })
                        await Location.insertMany(json)
                            .then(result => {
                                res.status(200).json({
                                    message: "Locality added it",
                                    result: result
                                })
                            })
                            .catch(err => {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on Save CSV" })
                            })
                    })
        }

    })
}

module.exports = { newLocation, getLocation, updateLocation, deleteLocation, AddLocationByCSV }