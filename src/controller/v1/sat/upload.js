const Folder = require("../../../models/sat/folder")
const UploadFile = require("../../../models/sat/upload")

const multer = require("multer")

const { getBucket } = require("../../../config/firebase_bucket");

// S3
// const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')



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
                const folderId = req.body.folderId

                // let filesExist = await UploadFile.countDocuments();


                const bucket = await getBucket();

                await Promise.all(req.files?.map(async data => {
                    // filesExist = filesExist + 1;
                    const newFile = new UploadFile({
                        fileName: `SAT_${Date.now()}_${Math.random().toString(36).substring(7)}.png`,
                        folderId: folderId,
                    });

                    try {
                        const ress = await newFile.save();
                        if (ress) {
                            const fileUpload = bucket.file(`sat/${ress.fileName}`);
                            await fileUpload.save(data.buffer, {
                                metadata: { contentType: data.mimetype },
                                public: true, // Make it public (so it gets a CDN link)
                                resumable: false,
                            });
                            // const params = {
                            //     Bucket: bucket_name,
                            //     Key: `sat/${ress.fileName}`,
                            //     Body: data.buffer,
                            //     ContentType: data.mimetype
                            // };
                            // const command = new PutObjectCommand(params);
                            // await s3.send(command);
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
        const uploads = await UploadFile.find({ folderId: req.body.folderId });
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

            const bucket = await getBucket();


            console.log(req?.files, "Req Files");
            console.log(err, "Err files");

            // 🧩 Validate upload
            if (err || req.files.length > 1) {
                return res.status(401).json({
                    message: "Oops! Something went wrong.",
                    result: "File upload error or more than 1 file uploaded.",
                });
            }

            // Step 1️⃣: Delete the old file from Firebase Storage
            try {
                const oldFile = bucket.file(`sat/${req.body.fileName}`);
                await oldFile.delete().catch((err) => {
                    // Ignore 404 (file not found)
                    if (err.code !== 404) throw err;
                });
                console.log(`Deleted old file: sat/${req.body.fileName}`);
            } catch (deleteErr) {
                console.error("Error deleting old file:", deleteErr);
            }

            // Step 2️⃣: Upload new file(s)
            let responseCount = 0;
            let errorCount = 0;
            const numberOfFiles = req.files?.length || 0;



            try {
                await Promise.all(
                    req.files.map(async (data) => {
                        try {
                            // Generate a new unique filename
                            const newFileName = `SAT_${Date.now()}_${Math.random()
                                .toString(36)
                                .substring(7)}.png`;

                            // Update the database with new filename
                            await UploadFile.updateOne(
                                { _id: String(req.body._id) },
                                { $set: { fileName: newFileName } }
                            );

                            const fileRecord = await UploadFile.findOne({
                                _id: String(req.body._id),
                            });

                            if (fileRecord) {
                                // Upload the file to Firebase
                                const fileUpload = bucket.file(`sat/${fileRecord.fileName}`);

                                await fileUpload.save(data.buffer, {
                                    metadata: { contentType: data.mimetype },
                                    public: true, // makes the file publicly accessible
                                    resumable: false,
                                });

                                // Generate a public CDN URL
                                const publicUrl = `https://storage.googleapis.com/${bucket.name}/sat/${fileRecord.fileName}`;

                                // Optional: update file URL in DB
                                await UploadFile.updateOne(
                                    { _id: fileRecord._id },
                                    { $set: { fileUrl: publicUrl } }
                                );

                                responseCount++;
                            } else {
                                errorCount++;
                            }
                        } catch (uploadErr) {
                            console.error("Error during file upload:", uploadErr);
                            errorCount++;
                        }
                    })
                );

                // Step 3️⃣: Send final response
                res.status(200).json({
                    success: true,
                    message: "Upload completed successfully",
                    responseCount,
                    errorCount,
                    numberOfFiles,
                });
            } catch (uploadErr) {
                console.error("Main upload error:", uploadErr);
                res.status(500).json({
                    success: false,
                    message: "Error uploading files",
                    error: uploadErr.message,
                });
            }
        });
    } catch (err) {
        console.error("Catch block:", err);
        res.status(500).json({
            message: "Error on update!",
            error: err.message,
        });
    }
};


// Update Upload Images Youtube/Link Status

const updateUploadLinkStatus = async (req, res, next) => {
    try {
        const body = req.body
        await UploadFile.updateOne({ _id: String(body._id) }, { $set: { videologo: Boolean(body.videologo), link: String(body.link) } })
            .then((ress) => {
                console.log(ress);
                res.status(200).json({
                    message: "Folder Updated for video it!",
                    result: {
                        _id: body._id,
                        videologo: body.videologo,
                        link: body.link
                    }
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update" })
            })

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}



// Delete
const deleteUpload = async (req, res, next) => {
    try {
        const { fileName, _id } = req.body;

        if (!fileName || !_id) {
            return res.status(400).json({
                message: "Missing required fields: fileName or _id",
            });
        }


        const bucket = await getBucket();

        // Step 1️⃣: Delete file from Firebase Storage
        const filePath = `sat/${fileName}`;
        const file = bucket.file(filePath);

        await file
            .delete()
            .then(async () => {
                console.log(`Deleted file from Firebase Storage: ${filePath}`);

                // Step 2️⃣: Delete file record from MongoDB
                await UploadFile.deleteOne({ _id: String(_id) })
                    .then((result) => {
                        return res.status(200).json({
                            success: true,
                            message: "File deleted successfully!",
                            result,
                        });
                    })
                    .catch((err) => {
                        console.error("MongoDB delete error:", err);
                        return res.status(500).json({
                            success: false,
                            message: "Error deleting from database!",
                            error: err.message,
                        });
                    });
            })
            .catch((err) => {
                console.error("Firebase delete error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting file from Firebase!",
                    error: err.message,
                });
            });
    } catch (err) {
        console.error("Catch error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: err.message,
        });
    }
};


module.exports = { postUpload, getUpload, updateUpload, updateUploadLinkStatus, deleteUpload }