const bcrypt = require('bcrypt')

// Models
const User = require('../../../models/user/user.model')
const Zone = require('../../../models/zone/zone.model')

const userData = async (req, res, next) => {
    try {
        await User.findOne({ _id: req.userData.userId }, { password: 0, createdAt: 0, updatedAt: 0 })
            .then(async (result) => {
                if (result !== null) {
                    await Zone.findOne({ ID: result.zone })
                        .then((result1) => {
                            if (result !== null) {
                                res.status(200).json({
                                    message: "success",
                                    result: result,
                                    zone: result1
                                })
                            } else {
                                res.status(401).json({
                                    message: "No zone data found",
                                    result: result,
                                    zone: result1
                                })
                            }
                        })
                        .catch((err) => {
                            // console.log(err)
                            res.status(301).json({
                                message: "Something went wrong!!",
                                result: err
                            })
                        })
                } else {
                    res.status(401).json({
                        message: "No data found",
                        result: result
                    })
                }
            })
            .catch((err) => {
                // console.log(err)
                res.status(301).json({
                    message: "Something went wrong!!",
                    result: err
                })
            })

    } catch (err) {
        res.status(301).json({
            massage: "Opps, Something went wrong!"
        })
    }
}


// PATCH - Change Password

const changePassword = async (req, res, next) => {
    try {

        await User.findOne({ _id: req.userData.userId })
            .then((result) => {
                if (!result) {

                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }
                const checkPasswordStatus = bcrypt.compareSync(String(req.body.oldPassword), result.password)
                // Check password is mactch or not
                if (checkPasswordStatus !== true) {

                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                } else {

                    const saltRounds = 12
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hash = bcrypt.hashSync(String(req.body.newPassword), salt);
                    User.updateOne({ _id: result._id }, { $set: { password: hash } })
                        .then((result1) => {
                            res.status(200).json({ message: "Password updated!", result: "Password updated!" })
                        })
                        .catch((err) => {
                            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                        })
                }


            })
            .catch((err) => {
                res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
            })

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}




const Logout = async (req, res, next) => {
    try {
        await logintoken.deleteOne({
            userId: req.userData.userId
        })
            .then((result1) => {
                res.status(200).json({ message: "Logouted", result: "Logouted" })
            })
            .catch((err) => {
                res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
            })

    } catch (err) {
        res.status(301).json({
            massage: "Opps, Something went wrong!"
        })
    }
}
module.exports = { userData, changePassword, Logout }