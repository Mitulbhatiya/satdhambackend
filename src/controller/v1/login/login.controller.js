
const bcrypt = require('bcrypt')

const { adminSchema_joi, userSchema_joi } = require('../../../joi/login/login.joi')
// Genarate hash value
const s_key = "VK]$Ko=d#06@01"
var CryptoJS = require("crypto-js");
// JWT 
const jwt = require('jsonwebtoken')
const key = process.env.TOKEN_KEY;

// Models
const Admin = require('../../../models/admin/user.admin')
const User = require('../../../models/user/user.model')
const logintoken = require('../../../models/token/token.model')

const adminLogin = async (req, res, next) => {
    console.log(req.body);
    try {
        const { error, value } = adminSchema_joi.validate(req.body)
        console.log(error, value);
        if (error) {
            res.status(301).json({
                massage: "Validation fails to match the required pattern!"
            })
        }
        await Admin.findOne({ adminid: value.adminid })
            .then((result) => {
                // console.log(result);
                if (!result || result.isActive !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }
                const checkPasswordStatus = bcrypt.compareSync(value.password, result.password)
                // Check password is mactch or not
                if (checkPasswordStatus !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }

                // generate token 
                const token = jwt.sign(
                    { userId: result._id },
                    key,
                    { expiresIn: "365d" }
                )

                // console.log(token, "token");
                // user data alarady in data base
                // If user -> update details
                // else -> create new user
                logintoken.findOne({ userId: result._id })
                    .then((user) => {
                        var aes = CryptoJS.AES.encrypt('Thisisloginbyadminrole', s_key).toString();
                        // console.log(user);

                        // split by 00000 in frontend and apply condition
                        if (user) {
                            logintoken.updateOne({ _id: user._id }, { $set: { onModel: 'admin', token: token } })
                                .then((success) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: aes + "00000" + "isra"
                                    })
                                })
                        } else {
                            const new_user = new logintoken({
                                userId: result._id,
                                onModel: 'admin',
                                token: token,
                            })
                            new_user.save()
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: aes + "00000" + "isra"
                                    })
                                })
                                .catch(err => {
                                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                })
                        }
                    })
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



const userLogin = async (req, res, next) => {
    try {
        const { error, value } = userSchema_joi.validate(req.body)
        if (error) {
            res.status(301).json({
                massage: "Validation fails to match the required pattern!"
            })
        }
        await User.findOne({ mobile: value.id })
            .then((result) => {
                if (!result || result.isActive !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }
                const checkPasswordStatus = bcrypt.compareSync(value.password, result.password)
                // Check password is mactch or not
                if (checkPasswordStatus !== true) {
                    return res.status(301).json({
                        message: "Invalid authentication.",
                    })
                }

                // generate token 
                const token = jwt.sign(
                    { userId: result._id },
                    key,
                    { expiresIn: "365d" }
                )

                // console.log(token, "token");
                // user data alarady in data base
                // If user -> update details
                // else -> create new user
                logintoken.findOne({ userId: result._id })
                    .then((user) => {
                        var aes = CryptoJS.AES.encrypt('Thisisloginbyadminrole', s_key).toString();
                        // console.log(user);

                        // split by 00000 in frontend and apply condition
                        if (user) {
                            logintoken.updateOne({ _id: user._id }, { $set: { onModel: 'user', token: token } })
                                .then((success) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: result.role
                                    })
                                })
                        } else {
                            const new_user = new logintoken({
                                userId: result._id,
                                onModel: 'user',
                                token: token,
                            })
                            new_user.save()
                                .then((ress) => {
                                    res.status(200).json({
                                        message: "Login succ..",
                                        token: token,
                                        isAuth: true,
                                        role: result.role
                                    })
                                })
                                .catch(err => {
                                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                })
                        }
                    })
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


module.exports = { adminLogin, userLogin }






// const body = req.body
// const saltRounds = 12
// const salt = bcrypt.genSaltSync(saltRounds);
// const hash = bcrypt.hashSync(String(body.password), salt);
// console.log(hash);
// const new_user = new Admin({
//     name: "Vivek",
//     adminid: body.adminid,
//     password: hash,
//     isActive: true,
//     type: "main"
// })
// new_user.save()
//     .then((ress) => {
//         res.status(200).json({
//             message: "User Login Success"
//         })
//     })
//     .catch((err) => {
//         res.status(401).json({
//             message: err
//         })
//     })