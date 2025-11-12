
const Users = require('../../../models/user/user.model')
const Atdetails = require('../../../models/attendance/atdetails')
const multer = require("multer")
const bcrypt = require('bcrypt')
const { getBucket } = require("../../../config/firebase_bucket");

// S3 legacy reference (kept for future use)
// const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { get_each_user_joi, update_active_user_status } = require('../../../joi/users/user.joi')
const { updateUserZone_joi } = require('../../../joi/users/updateZone.joi')

// const bucket_name = process.env.BUCKET_NAME
// const bucket_region = process.env.BUCKET_REGION
// const access_key = process.env.ACCESS_KEY
// const secret_key = process.env.SECRET_KEY
// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: access_key,
//         secretAccessKey: secret_key
//     },
//     region: bucket_region
// })


var upload = multer({
    fileFilter: (req, file, cb) => {
        console.log("file", "--");
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only PNG format allowed!'));
        }

    },
}).single("profile")


const addUser = async (req, res, next) => {
    upload(req, res, async function (err) {
        // if (req.file.size < 1000000) {
        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            const json = JSON.parse(req.body.json)
            // console.log(json);
            if (json.imgStatus === true) {
                if (req.file.size < 1000000) {
                    const users = await Users.countDocuments();
                    const saltRounds = 12
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hash = bcrypt.hashSync("sat@123", salt);
                    const new_user = new Users({
                        ID: `SATP${users + 1}`,
                        password: hash,
                        firstname: json.firstname,
                        middlename: json.middlename,
                        lastname: json.lastname,
                        district: json.district,
                        taluka: json.taluka,
                        village: json.village,
                        zone: json.zone,
                        mobile: json.mobile,
                        gender: json.gender,
                        address: json.address,
                        birthdate: json.birthdate,
                        vistar: json.vistar,
                        subzone: json.subzone,
                        linked: false,
                        role: 'user',
                        attendancePermission: false,
                        attendance: 0,
                        profileurl: `SATP${users + 1}.png`,
                        profilePhotoStatus: true,
                        isActive: true
                    })
                    try {
                        const ress = await new_user.save();
                        if (!ress) {
                            return res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" });
                        }

                        try {
                            const bucket = await getBucket();
                            const fileUpload = bucket.file(`${ress.ID}.png`);
                            await fileUpload.save(req.file.buffer, {
                                metadata: { contentType: req.file.mimetype },
                                public: true,
                                resumable: false,
                            });
                            // Legacy AWS S3 implementation (kept for reference)
                            // const parms = {
                            //     Bucket: bucket_name,
                            //     Key: `${ress.ID}.png`,
                            //     Body: req.file.buffer,
                            //     ContentType: req.file.mimetype
                            // }
                            // const command = new PutObjectCommand(parms)
                            // await s3.send(command)
                            return res.status(200).json({
                                message: "Zone created successfully 😊",
                                result: ress
                            });
                        } catch (uploadErr) {
                            console.error(uploadErr);
                            return res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" });
                        }
                    } catch (saveErr) {
                        console.error(saveErr);
                        return res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" });
                    }
                } else {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
                }
            } else {

                const users = await Users.countDocuments();
                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync("sat@123", salt);
                const new_user = new Users({
                    ID: `SATP${users + 1}`,
                    password: hash,
                    firstname: json.firstname,
                    middlename: json.middlename,
                    lastname: json.lastname,
                    district: json.district,
                    taluka: json.taluka,
                    village: json.village,
                    zone: json.zone,
                    mobile: json.mobile,
                    gender: json.gender,
                    address: json.address,
                    birthdate: json.birthdate,
                    vistar: json.vistar,
                    subzone: json.subzone,
                    linked: false,
                    role: 'user',
                    attendancePermission: false,
                    attendance: 0,
                    profileurl: `SATP${users + 1}.png`,
                    profilePhotoStatus: json.imgStatus,
                    isActive: true
                })
                try {
                    const ress = await new_user.save()
                    res.status(200).json({
                        message: "Zone created successfully 😊",
                        result: ress
                    })
                } catch (err) {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on data save without img" })
                }
            }

        }
        // } else {
        //     res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        // }


    })

}


const getUser = async (req, res, next) => {
    try {
        await Users.find({})
            .then((ress) => {
                res.status(200).json({
                    message: "Users GET it",
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

const getEachUser = async (req, res, next) => {
    try {
        const { error, value } = await get_each_user_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Users.findOne({ ID: value.id })
                .populate({
                    path: 'locality'
                })
                .then((ress) => {
                    res.status(200).json({
                        message: "User GET it",
                        result: {
                            userData: ress
                        }
                    })
                })
                .catch(err => {
                    // console.log(err);
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                })
        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }

}


var upload1 = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only JPEG & PNG format allowed!'));
        }

    },
}).single("profile")
const updateEachUser = async (req, res, next) => {
    try {
        upload1(req, res, async function (err) {
            const json = JSON.parse(req.body.json)
            console.log(json);
            switch (json.updateProfile) {
                case 'updateWithOutProfile':
                    // console.log(json);
                    await Users.updateOne({ ID: json.ID }, {
                        $set: {
                            firstname: json.firstname,
                            middlename: json.middlename,
                            lastname: json.lastname,
                            gender: json.gender,
                            district: json.district,
                            taluka: json.taluka,
                            village: json.village,
                            mobile: json.mobile,
                            address: json.address,
                            zone: json.zone,
                            vistar: json.vistar,
                            subzone: json.subzone,
                        }
                    })
                        .then((ress) => {
                            res.status(200).json({
                                message: "User GET it",
                                result: json
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                        })
                    break;
                case 'updateWithProfile':
                    // Update datd
                    try {
                        const ress = await Users.updateOne({ ID: json.ID }, {
                            $set: {
                                firstname: json.firstname,
                                middlename: json.middlename,
                                lastname: json.lastname,
                                gender: json.gender,
                                district: json.district,
                                taluka: json.taluka,
                                village: json.village,
                                mobile: json.mobile,
                                address: json.address,
                                zone: json.zone,
                                vistar: json.vistar,
                                subzone: json.subzone,
                                profilePhotoStatus: true
                            }
                        })

                        try {
                            const bucket = await getBucket();
                            const fileRef = bucket.file(json.profileurl);
                            await fileRef.delete().catch((deleteErr) => {
                                if (deleteErr.code !== 404) {
                                    throw deleteErr;
                                }
                            });
                            // Legacy S3 implementation (kept for reference)
                            // const parms = {
                            //     Bucket: bucket_name,
                            //     Key: json.profileurl,
                            // }
                            // const command = new DeleteObjectCommand(parms)
                            // await s3.send(command)

                            const newFileRef = bucket.file(json.profileurl);
                            await newFileRef.save(req.file.buffer, {
                                metadata: { contentType: req.file.mimetype },
                                public: true,
                                resumable: false,
                            });
                            // Legacy S3 implementation (kept for reference)
                            // const parms1 = {
                            //     Bucket: bucket_name,
                            //     Key: json.profileurl,
                            //     Body: req.file.buffer,
                            //     ContentType: req.file.mimetype
                            // }
                            // const command1 = new PutObjectCommand(parms1)
                            // await s3.send(command1)

                            res.status(200).json({
                                message: "User Updated successfully 😊",
                                result: ress
                            })
                        } catch (uploadErr) {
                            console.log(uploadErr);
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                        }
                    } catch (err) {
                        console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on get" })
                    }
                    break;
                default:
                    break;
            }

        })
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }

}



const updateUserZone = async (req, res, next) => {
    try {
        const { error, value } = await updateUserZone_joi.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Users.updateMany(
                { _id: { $in: value.users } },
                { $set: { zone: value.zone, subzone: value.subzone, role: "user" } })
                .then((result1) => {
                    if (result1.matchedCount > 0) {
                        res.status(200).json({
                            message: "Users zone updated",
                            result: {
                                users: value.users,
                                zoneupdate: {
                                    zone: value.zone,
                                    subzone: value.subzone,
                                    role: 'user'
                                }
                            }
                        })
                    } else {
                        res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong" })
                    }
                })
                .catch((err) => {
                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                })
        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


// PATCH
// Active user status
const updateUserActiveStatus = async (req, res, next) => {
    try {
        const { error, value } = await update_active_user_status.validate(req.body)
        // console.log(error, value);
        if (error) {
            res.status(302).json({
                massage: "Validation fails to match the required pattern!",
                result: "Validation fails to match the required pattern!"
            })
        } else {
            await Users.updateOne(
                { _id: value._id },
                { $set: { isActive: value.isActive, role: "user", attendance: 0 } })
                .then((result1) => {
                    if (result1.matchedCount > 0) {
                        Atdetails.deleteMany({ SATID: value._id })
                            .then((result2) => {
                                res.status(200).json({
                                    message: "Users active status updated",
                                    result: {
                                        _id: value._id,
                                        isActive: value.isActive,
                                        role: "user",
                                        attendance: 0
                                    }
                                })
                            })
                            .catch((err) => {
                                res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                            })
                    } else {
                        res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong" })
                    }
                })
                .catch((err) => {
                    res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
                })
        }
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }


}

// Reset user password
const resetUserPassword = async (req, res, next) => {
    try {
        const value = req.body
        const saltRounds = 12
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync("sat@123", salt);
        await Users.updateOne(
            { ID: value.ID },
            { $set: { password: hash } }
        )
            .then((result1) => {
                res.status(200).json({
                    message: "Reset password",
                })
            })
            .catch((err) => {
                res.status(301).json({ message: "Opps! Somthing went wrong.", result: "something went wrong", err: err })
            })
    }
    catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}


const setAllAttendanceToZero = async (req, res, next) => {
    await Users.updateMany({}, { attendance: 0 })
}

module.exports = { setAllAttendanceToZero, addUser, getUser, getEachUser, updateEachUser, updateUserZone, updateUserActiveStatus, resetUserPassword }




// let finalArr = []

// Users.find()
//     .then((res) => {
//         let tempArr =[]
//         res.map(value => {
//             Atdetails.find({ SATID: value._id })
//                 .then((res1) => {
//                     // console.log(res);

//                 })
//                 .catch(err => {
//                     console.log(err);
//                 })
//                 tempArr.push({
//                     user:value,
//                     atDetails:
//                 })
//         })
//     })
//     .catch(err => {
//         console.log(err);
//     })