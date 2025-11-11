
const Users = require('../../../models/satshri/users.models')



const multer = require("multer")
const bcrypt = require('bcrypt')
// S3
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')



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
        console.log(file, "file", "--");
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/heic") {
            cb(null, true);
        } else {
            // req.ErrorFromMulter = 'Only .png, .jpg and .jpeg format allowed and file size should be less then   1 MB';
            // cb(null, false);
            return cb(new Error('Only PNG format allowed!'));
        }
    },
}).single("file")



const newUser = async (req, res, next) => {
    await upload(req, res, async function (err) {
        // if (req.file.size < 1000000) {
        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            // console.log(req.body);
            const json = req.body
            if (json.imgStatus == "true") {
                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync("sat@123", salt);
                const new_user = new Users({
                    name: json.name,
                    password: hash,
                    mobile: json.mobile,
                    gender: json.gender,
                    address: json.address,
                    district: json.district,
                    taluka: json.taluka,
                    village: json.village,
                    city: json.city,
                    state: json.state,
                    country: json.country,
                    image: `SATSHRI_${Date.now()}_${Math.random().toString(36).substring(7)}.png`,
                    age: json.age,
                    birthdate: json.birthdate,
                    business: json.business,
                    note: json.note,
                    other: json.other,
                    isActive: true
                })
                await new_user.save()
                    .then((ress) => {
                        // const filename = req.file.
                        if (ress) {
                            const parms = {
                                Bucket: bucket_name,
                                Key: `satshri/${ress.image}`,
                                Body: req.file.buffer,
                                ContentType: req.file.mimetype
                            }
                            const command = new PutObjectCommand(parms)
                            s3.send(command)
                                .then((ress1) => {
                                    res.status(200).json({
                                        message: "User created successfully 😊",
                                        result: ress
                                    })
                                })
                                .catch(err => {

                                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                                })
                        } else {
                            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                        }

                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                    })
            } else {

                const saltRounds = 12
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync("sat@123", salt);
                const new_user = new Users({
                    name: json.name,
                    password: hash,
                    mobile: json.mobile,
                    gender: json.gender,
                    address: json.address,
                    district: json.district,
                    taluka: json.taluka,
                    village: json.village,
                    city: json.city,
                    state: json.state,
                    country: json.country,
                    image: 'NaN',
                    age: json.age,
                    birthdate: json.birthdate,
                    business: json.business,
                    note: json.note,
                    other: json.other,
                    isActive: true
                })
                await new_user.save()
                    .then((ress) => {
                        res.status(200).json({
                            message: "User created successfully 😊",
                            result: ress
                        })

                    })
                    .catch(err => {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on data save without img" })
                    })
            }

        }
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




const updateEachUserData = async (req, res, next) => {
    try {
        const body = req.body
        await Users.updateOne({ _id: body._id }, {
            $set: {
                name: body.name,
                mobile: body.mobile,
                gender: body.gender,
                address: body.address,
                district: body.district,
                taluka: body.taluka,
                village: body.village,
                city: body.city,
                state: body.state,
                country: body.country,
                age: body.age,
                birthdate: body.birthdate,
                business: body.business,
                note: body.note,
                other: body.other,
            }
        })
            .then((ress) => {
                res.status(200).json({
                    message: "User Updated it",
                    result: body
                })
            })
            .catch(err => {
                console.log(err);
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update data" })
            })
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }

}



const addImage = async (req, res, next) => {

    await upload(req, res, async function (err) {
        // if (req.file.size < 1000000) {
        if (err) {
            res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
        } else {
            // console.log(req.body);
            const json = req.body
            console.log(json);
            const imgurl = `SATSHRI_${Date.now()}_${Math.random().toString(36).substring(7)}.png`
            await Users.updateOne({ _id: json._id }, {
                $set: {
                    image: imgurl,
                }
            })
                .then((ress) => {

                    if (ress) {
                        const parms = {
                            Bucket: bucket_name,
                            Key: `satshri/${imgurl}`,
                            Body: req.file.buffer,
                            ContentType: req.file.mimetype
                        }
                        const command = new PutObjectCommand(parms)
                        s3.send(command)
                            .then((ress1) => {
                                res.status(200).json({
                                    message: "User img updated successfully 😊",
                                    result: ress
                                })
                            })
                            .catch(err => {
                                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save img" })
                            })
                    } else {
                        res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on save" })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update data" })
                })
        }
    })
}


const updateImage = async (req, res, next) => {

    try {
        await upload(req, res, async function (err) {
            // if (req.file.size < 1000000) {
            console.log(req?.file, "Req Files");
            console.log(err, "Err files");
            const parms = {
                Bucket: bucket_name,
                Key: `satshri/${req.body.fileName}`,
            }
            const command = new DeleteObjectCommand(parms)
            await s3.send(command)
                .then(async (ress1) => {
                    let responseCount = 0
                    let errorCount = 0
                    try {
                        const responseUpdate = await Users.updateOne(
                            { _id: String(req.body._id) },
                            { $set: { image: `SATSHRI_${Date.now()}_${Math.random().toString(36).substring(7)}.png` } }
                        )
                        if (responseUpdate) {
                            const ress = await Users.findOne({ _id: String(req.body._id) })
                            if (ress) {
                                console.log(ress, "DB Res");
                                console.log(req.file, "Fileee");
                                const params1 = {
                                    Bucket: bucket_name,
                                    Key: `satshri/${ress.image}`,
                                    Body: req.file.buffer,
                                    ContentType: req.file.mimetype
                                };
                                const command1 = new PutObjectCommand(params1);
                                await s3.send(command1);
                                responseCount = responseCount + 1;
                            } else {
                                errorCount = errorCount + 1;
                            }
                        }
                    } catch (err) {
                        console.log(err, "Err ");
                        errorCount = errorCount + 1;
                    }

                    // Send response
                    res.status(200).json({ responseCount, errorCount });

                })
        })
    } catch (err) {
        console.log(err, "Catch");
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}



// Delete
const deleteUpload = async (req, res, next) => {
    try {
        const parms = {
            Bucket: bucket_name,
            Key: `satshri/${req.body.fileName}`,
        }
        const command = new DeleteObjectCommand(parms)
        await s3.send(command)
            .then(async (ress1) => {
                Users.deleteOne({ _id: String(req.body._id) })
                    .then((result) => {
                        res.status(200).json({
                            message: "Deleted!",
                            err: result
                        })
                    })
                    .catch(err => {
                        res.status(301).json({
                            message: "Error on delete data!",
                            err: err
                        })
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(301).json({
                    message: "Error on delete file!",
                    err: err
                })
            })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}



module.exports = { newUser, getUser, updateEachUserData, addImage, updateImage, deleteUpload }