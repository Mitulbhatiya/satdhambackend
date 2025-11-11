const Gaushala = require("../../../models/sat/gaushala")


const multer = require("multer")

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
}).array("files")



// POST

const postUpload = async (req, res, next) => {
    try {
        await upload(req, res, async function (err) {
            console.log(req?.files, "Req Files");
            console.log(err, "Err files");
            // if (req.file.size < 1000000) {
            if (err) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
            } else {

                let responseCount = 0
                let errorCount = 0
                const numberOfFiles = req.files?.length

                // let filesExist = await UploadFile.countDocuments();


                await Promise.all(req.files?.map(async data => {
                    // filesExist = filesExist + 1;
                    const newFile = new Gaushala({
                        fileName: `SAT_${Date.now()}_${Math.random().toString(36).substring(7)}.png`,
                        isBanner: false,
                    });

                    try {
                        const ress = await newFile.save();
                        if (ress) {
                            const params = {
                                Bucket: bucket_name,
                                Key: `gaushala/${ress.fileName}`,
                                Body: data.buffer,
                                ContentType: data.mimetype
                            };
                            const command = new PutObjectCommand(params);
                            await s3.send(command);
                            responseCount = responseCount + 1;
                        } else {
                            errorCount = errorCount + 1;
                        }
                    } catch (err) {
                        console.log(err, "Catch err");
                        errorCount = errorCount + 1;
                    }
                }));

                // Send response
                res.status(200).json({ responseCount, errorCount, numberOfFiles });

            }
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}



// GEt by folder id

const getUpload = async (req, res, next) => {
    try {
        const uploads = await Gaushala.find({});
        res.status(200).json({
            message: "Files get successfully 😊",
            result: uploads
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}

// Update upload
const updateUpload = async (req, res, next) => {

    try {
        await upload(req, res, async function (err) {
            // if (req.file.size < 1000000) {
            console.log(req?.files, "Req Files");
            console.log(err, "Err files");
            if (err || req.files.length > 1) {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file or File is more than 1" })
            } else {
                const parms = {
                    Bucket: bucket_name,
                    Key: `gaushala/${req.body.fileName}`,
                }
                const command = new DeleteObjectCommand(parms)
                await s3.send(command)
                    .then(async (ress1) => {
                        let responseCount = 0
                        let errorCount = 0
                        const numberOfFiles = req.files?.length

                        await Promise.all(req.files?.map(async data => {
                            console.log(data, "Inside map");
                            try {
                                const responseUpdate = await Gaushala.updateOne(
                                    { _id: String(req.body._id) },
                                    { $set: { fileName: `SAT_${Date.now()}_${Math.random().toString(36).substring(7)}.png` } }
                                )
                                if (responseUpdate) {
                                    const ress = await Gaushala.findOne({ _id: String(req.body._id) })
                                    if (ress) {
                                        console.log(ress, "DB Res");
                                        const params1 = {
                                            Bucket: bucket_name,
                                            Key: `gaushala/${ress.fileName}`,
                                            Body: data.buffer,
                                            ContentType: data.mimetype
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
                        }));

                        // Send response
                        res.status(200).json({ responseCount, errorCount, numberOfFiles });

                    })
            }
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
            Key: `gaushala/${req.body.fileName}`,
        }
        const command = new DeleteObjectCommand(parms)
        await s3.send(command)
            .then(async (ress1) => {
                Gaushala.deleteOne({ _id: String(req.body._id) })
                    .then((result) => {
                        res.status(200).json({
                            message: "Deleted!",
                            err: result
                        })
                    })
                    .catch(err => {
                        res.status(301).json({
                            message: "Error on delete file!",
                            err: err
                        })
                    })
            })
            .catch(err => {
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


module.exports = { postUpload, getUpload, updateUpload, deleteUpload }