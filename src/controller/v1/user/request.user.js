const multer = require("multer")
const Request = require('../../../models/request/request.model')
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

var upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only PNG & JPEG format allowed!'));
        }

    },
}).single("profile")

const addUserReq = async (req, res, next) => {

    upload(req, res, async function (err) {
        console.log(req.file, req.body);
        console.log(req.body);

        if (req.file.size < 1000000) {
            if (err) {
                console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
            } else {
                const json = req.body
                const request = await Request.countDocuments();
                const new_req = new Request({
                    requestType: "Add-User",
                    requestStatus: "Pending",
                    RID: `SATR${request + 1}`,
                    firstname: json.firstname,
                    middlename: json.middlename,
                    lastname: json.lastname,
                    district: json.district,
                    taluka: json.taluka,
                    village: json.village,
                    zone: json.zone,
                    vistar: json.vistar,
                    subzone: json.subzone,
                    mobile: json.mobile,
                    gender: json.gender,
                    address: json.address,
                    birthdate: json.birthdate,
                    profileurl: `SATR${request + 1}.png`,
                    isActive: true,
                    note: json.note
                })
                await new_req.save()
                    .then((ress) => {
                        // const filename = req.file.
                        if (ress) {
                            const parms = {
                                Bucket: bucket_name,
                                Key: `${ress.RID}.png`,
                                Body: req.file.buffer,
                                ContentType: req.file.mimetype
                            }
                            const command = new PutObjectCommand(parms)
                            s3.send(command)
                                .then((ress1) => {
                                    res.status(200).json({
                                        message: "User add req created successfully 😊",
                                        result: ress
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                })
                        } else {
                            console.log("CallErr");
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                    })
            }
        } else {
            console.log(err);
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        }

    })
}



// var upload = multer({
//     fileFilter: (req, file, cb) => {
//         console.log(file);
//         if (file.mimetype == "image/png") {
//             cb(null, true);
//         } else {
//             // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
//             // cb(null, false);
//             return cb(new Error('Only PNG format allowed!'));
//         }

//     },
// }).single("updateProfile")

const updateDetailsReq = async (req, res, next) => {
    upload(req, res, async function (err) {
        console.log(req.file, "No file");
        if (err) {
            console.log(err);
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            const json = req.body
            console.log(json);
            const request = await Request.countDocuments();

            switch (json.type) {
                case 'withprofile':
                    // if (req.file.size < 1000000) {
                    const new_req = new Request({
                        requestType: "Update-User",
                        requestStatus: "Pending",
                        RID: `SATR${request + 1}`,
                        UID: json.UID,
                        firstname: json.firstname,
                        middlename: json.middlename,
                        lastname: json.lastname,
                        district: json.district,
                        taluka: json.taluka,
                        village: json.village,
                        zone: json.zone,
                        vistar: json.vistar,
                        subzone: json.subzone,
                        mobile: json.mobile,
                        gender: json.gender,
                        address: json.address,
                        birthdate: json.birthdate,
                        profileurl: `SATR${request + 1}.png`,
                        isActive: true,
                        note: json.note
                    })
                    await new_req.save()
                        .then((ress) => {
                            // const filename = req.file.
                            if (ress) {
                                const parms = {
                                    Bucket: bucket_name,
                                    Key: `${ress.RID}.png`,
                                    Body: req.file.buffer,
                                    ContentType: req.file.mimetype
                                }
                                const command = new PutObjectCommand(parms)
                                s3.send(command)
                                    .then((ress1) => {
                                        res.status(200).json({
                                            message: "User update req created successfully 😊",
                                            result: ress
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                    })
                            } else {
                                console.log("call");
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }

                        })
                        .catch(err => {
                            console.log(err);
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        })
                    // } else {
                    //     console.log("call");
                    //     res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
                    // }
                    break;

                case 'withoutprofile':
                    const new_req1 = new Request({
                        requestType: "Update-User",
                        requestStatus: "Pending",
                        RID: `SATR${request + 1}`,
                        UID: json.UID,
                        firstname: json.firstname,
                        middlename: json.middlename,
                        lastname: json.lastname,
                        district: json.district,
                        taluka: json.taluka,
                        village: json.village,
                        zone: json.zone,
                        vistar: json.vistar,
                        subzone: json.subzone,
                        mobile: json.mobile,
                        gender: json.gender,
                        address: json.address,
                        birthdate: json.birthdate,
                        isActive: true,
                        note: json.note
                    })
                    await new_req1.save()
                        .then((ress) => {
                            // const filename = req.file.
                            if (ress) {
                                res.status(200).json({
                                    message: "User update req created successfully 😊",
                                    result: ress
                                })
                            } else {
                                console.log("call");
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        })
                    break;
                default:
                    break;
            }

        }

    })
}



// var upload = multer({
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png") {
//             cb(null, true);
//         } else {
//             // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
//             // cb(null, false);
//             return cb(new Error('Only PNG format allowed!'));
//         }

//     },
// }).single("reupdateProfile")

const patch_req = async (req, res, next) => {

    upload(req, res, async function (err) {

        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            const json = req.body
            // console.log(json);
            switch (json.type) {
                case 'withprofile':
                    if (req.file.size < 1000000) {
                        await Request.updateOne({ RID: json.RID }, {
                            $set: {
                                firstname: json.firstname,
                                middlename: json.middlename,
                                lastname: json.lastname,
                                district: json.district,
                                taluka: json.taluka,
                                village: json.village,
                                zone: json.zone,
                                vistar: json.vistar,
                                subzone: json.subzone,
                                mobile: json.mobile,
                                gender: json.gender,
                                address: json.address,
                                birthdate: json.birthdate,
                                profileurl: json.profileurl,
                                note: json.note
                            }
                        })
                            .then((ress) => {

                                const parms = {
                                    Bucket: bucket_name,
                                    Key: json.profileurl,
                                }
                                const command = new DeleteObjectCommand(parms)
                                s3.send(command)
                                    .then((ress1) => {

                                        const parms = {
                                            Bucket: bucket_name,
                                            Key: json.profileurl,
                                            Body: req.file.buffer,
                                            ContentType: req.file.mimetype
                                        }
                                        const command = new PutObjectCommand(parms)
                                        s3.send(command)
                                            .then((ress1) => {
                                                res.status(200).json({
                                                    message: "User update req created successfully 😊",
                                                    result: {
                                                        RID: json.RID,
                                                        firstname: json.firstname,
                                                        middlename: json.middlename,
                                                        lastname: json.lastname,
                                                        district: json.district,
                                                        taluka: json.taluka,
                                                        village: json.village,
                                                        zone: json.zone,
                                                        vistar: json.vistar,
                                                        subzone: json.subzone,
                                                        mobile: json.mobile,
                                                        gender: json.gender,
                                                        address: json.address,
                                                        birthdate: json.birthdate,
                                                        profileurl: json.profileurl,
                                                        note: json.note
                                                    }
                                                })
                                            })
                                            .catch(err => {
                                                // console.log(err);
                                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                            })

                                    })
                                    .catch(err => {
                                        // console.log(err);
                                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                    })

                            })
                            .catch(err => {
                                // console.log(err);
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                            })
                    } else {
                        // console.log("Err called");
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
                    }
                    break;

                case 'withoutprofile':
                    await Request.updateOne({ RID: json.RID }, {
                        $set: {
                            firstname: json.firstname,
                            middlename: json.middlename,
                            lastname: json.lastname,
                            district: json.district,
                            taluka: json.taluka,
                            village: json.village,
                            zone: json.zone,
                            vistar: json.vistar,
                            subzone: json.subzone,
                            mobile: json.mobile,
                            gender: json.gender,
                            address: json.address,
                            birthdate: json.birthdate,
                            note: json.note
                        }
                    })
                        .then((ress) => {
                            // console.log(ress);
                            // const filename = req.file.
                            res.status(200).json({
                                message: "User update req created successfully 😊",
                                result: {
                                    RID: json.RID,
                                    firstname: json.firstname,
                                    middlename: json.middlename,
                                    lastname: json.lastname,
                                    district: json.district,
                                    taluka: json.taluka,
                                    village: json.village,
                                    zone: json.zone,
                                    vistar: json.vistar,
                                    subzone: json.subzone,
                                    mobile: json.mobile,
                                    gender: json.gender,
                                    address: json.address,
                                    birthdate: json.birthdate,
                                    note: json.note
                                }
                            })
                        })
                        .catch(err => {
                            // console.log(err);
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        })
                    break;
                default:
                    break;
            }

        }

    })
}





// GET REQ BY ZONE

const getRequestByZone = async (req, res, next) => {
    try {
        await Request.find({ zone: req.body.zone })
            .then((result) => {
                if (result !== null) {
                    res.status(200).json({
                        message: "success",
                        result: result
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

module.exports = { addUserReq, updateDetailsReq, patch_req, getRequestByZone }


