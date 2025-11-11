const Request = require('../../../models/request/request.model')
const User = require('../../../models/user/user.model')
const bcrypt = require('bcrypt')

// S3
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { get_each_user_joi } = require('../../../joi/users/user.joi')

const bucket_name = process.env.BUCKET_NAME
const bucket_region = process.env.BUCKET_REGION
const access_key = process.env.ACCESS_KEY
const secret_key = process.env.SECRET_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key
    },
    region: bucket_region
})





const getAllRequest = async (req, res, next) => {
    try {
        await Request.find({})
            .then((ress) => {
                res.status(200).json({
                    message: "Request GET it",
                    result: ress
                })
            })
            .catch(err => {
                // console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
            })
    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


const updateRequest = async (req, res, next) => {
    // console.log(req.body.type);
    try {
        switch (req.body.type) {
            case 'rejected':
                await Request.updateOne({ RID: req.body.RID }, { $set: { requestStatus: "Rejected" } })
                    .then((ress) => {
                        // console.log(ress);
                        const parms = {
                            Bucket: bucket_name,
                            Key: `${req.body.RID}.png`,
                        }
                        const command = new DeleteObjectCommand(parms)
                        s3.send(command)
                            .then((ress1) => {
                                res.status(200).json({
                                    message: "Request Rejected it",
                                    result: {
                                        req: {
                                            RID: req.body.RID,
                                            requestStatus: "Rejected"
                                        },
                                        user: null
                                    }
                                })
                            })
                            .catch(err => {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                            })
                    })
                    .catch(err => {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                    })
                break;
            case 'Add-User':
                const users = await User.countDocuments();
                await Request.findOne({ RID: req.body.RID })
                    .then((ress) => {
                        const saltRounds = 12
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hash = bcrypt.hashSync("sat@123", salt);
                        const new_user = new User({
                            ID: `SATP${users + 1}`,
                            password: hash,
                            firstname: ress.firstname,
                            middlename: ress.middlename,
                            lastname: ress.lastname,
                            district: ress.district,
                            taluka: ress.taluka,
                            village: ress.village,
                            zone: ress.zone,
                            vistar: ress.vistar,
                            subzone: ress.subzone,
                            mobile: ress.mobile,
                            gender: ress.gender,
                            address: ress.address,
                            birthdate: ress.birthdate,
                            linked: false,
                            role: 'user',
                            attendancePermission: false,
                            attendance: 0,
                            profileurl: ress.profileurl,
                            profilePhotoStatus: true,
                            isActive: true
                        })
                        new_user.save()
                            .then((ress) => {
                                // const filename = req.file.
                                Request.updateOne({ RID: req.body.RID }, { $set: { requestStatus: "Accepted" } })
                                    .then((ress1) => {
                                        res.status(200).json({
                                            message: "User Added successfully 😊",
                                            result: {
                                                req: {
                                                    RID: req.body.RID,
                                                    requestStatus: "Accepted"
                                                },
                                                user: ress
                                            }
                                        })
                                    })
                                    .catch(err => {
                                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                    })
                            })
                            .catch(err => {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            })
                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                    })
                break;
            case 'Update-User':
                await Request.findOne({ RID: req.body.RID })
                    .then((ress) => {
                        if (ress.profileurl) {
                            User.findOne({ ID: ress.UID })
                                .then(res1 => {

                                    // Update Image Delete Old image
                                    const parms = {
                                        Bucket: bucket_name,
                                        Key: res1.profileurl,
                                    }
                                    const command = new DeleteObjectCommand(parms)
                                    s3.send(command)
                                        .then((res2) => {
                                            // Update user data
                                            // Update User data
                                            User.updateOne({ ID: ress.UID }, {
                                                $set: {
                                                    firstname: ress.firstname,
                                                    middlename: ress.middlename,
                                                    lastname: ress.lastname,
                                                    district: ress.district,
                                                    taluka: ress.taluka,
                                                    village: ress.village,
                                                    zone: ress.zone,
                                                    vistar: ress.vistar,
                                                    subzone: ress.subzone,
                                                    mobile: ress.mobile,
                                                    gender: ress.gender,
                                                    address: ress.address,
                                                    birthdate: ress.birthdate,
                                                    profileurl: ress.profileurl,
                                                    profilePhotoStatus: true
                                                }
                                            })
                                                .then((ress1) => {
                                                    // Update Request status when success
                                                    Request.updateOne({ RID: req.body.RID }, { $set: { requestStatus: "Accepted" } })
                                                        .then((ress1) => {

                                                            // Find update user data
                                                            User.findOne({ ID: ress.UID })
                                                                .then((ress5) => {
                                                                    res.status(200).json({
                                                                        message: "User updated successfully 😊",
                                                                        result: {
                                                                            req: {
                                                                                RID: req.body.RID,
                                                                                requestStatus: "Accepted"
                                                                            },
                                                                            user: "update",
                                                                            data: ress5
                                                                        }
                                                                    })
                                                                })
                                                                .catch(err => {
                                                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                                                })
                                                        })
                                                        .catch(err => {
                                                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                                        })
                                                })
                                                .catch(err => {
                                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                                })
                                        })
                                        .catch(err => {
                                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                        })
                                })
                                .catch(err => {
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong user" })
                                })

                            // Update request ststus
                            // Find updated user data

                        } else {
                            // Update User data
                            User.updateOne({ ID: ress.UID }, {
                                $set: {
                                    firstname: ress.firstname,
                                    middlename: ress.middlename,
                                    lastname: ress.lastname,
                                    district: ress.district,
                                    taluka: ress.taluka,
                                    village: ress.village,
                                    zone: ress.zone,
                                    vistar: ress.vistar,
                                    subzone: ress.subzone,
                                    mobile: ress.mobile,
                                    gender: ress.gender,
                                    address: ress.address,
                                    birthdate: ress.birthdate,
                                }
                            })
                                .then((ress1) => {
                                    // Update Request status when success
                                    Request.updateOne({ RID: req.body.RID }, { $set: { requestStatus: "Accepted" } })
                                        .then((ress1) => {

                                            // Find update user data
                                            User.findOne({ ID: ress.UID })
                                                .then((ress5) => {
                                                    res.status(200).json({
                                                        message: "User updated successfully 😊",
                                                        result: {
                                                            req: {
                                                                RID: req.body.RID,
                                                                requestStatus: "Accepted"
                                                            },
                                                            user: "update",
                                                            data: ress5
                                                        }
                                                    })
                                                })
                                                .catch(err => {
                                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                                })
                                        })
                                        .catch(err => {
                                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                        })
                                })
                                .catch(err => {
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                                })
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                    })
                break;

            default:
                break;
        }

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}
module.exports = { getAllRequest, updateRequest }