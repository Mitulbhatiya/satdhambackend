/*

Currently this is used for
- Sansakar Mandir (Dharmik Pravruti)
 - Gau Mandir (Gau Shala)
 - Yagna Mandir (Yagna Shala)

 used for youtube thubmnail

*/

const UploadFile = require("../../../models/sat/youtubeLink.thumbnai")

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
        const youtube = new UploadFile(req.body);
        const savedYoutube = await youtube.save();
        res.status(200).json({
            message: "Youtube link saved successfully 😊",
            result: savedYoutube
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }


    // try {
    //     await upload(req, res, async function (err) {
    //         console.log(req?.files, "Req Files");
    //         console.log(err, "Err files");
    //         // if (req.file.size < 1000000) {
    //         if (err) {
    //             res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file" })
    //         } else {

    //             let responseCount = 0
    //             let errorCount = 0
    //             const numberOfFiles = req.files?.length
    //             const location = req.body.location
    //             const link = req.body.link

    //             // let filesExist = await UploadFile.countDocuments();


    //             await Promise.all(req.files?.map(async data => {
    //                 // filesExist = filesExist + 1;
    //                 const newFile = new UploadFile({
    //                     fileName: `YTTHUMB_${Date.now()}_${Math.random().toString(36).substring(7)}.png`,
    //                     location: location,
    //                     link: link
    //                 });

    //                 try {
    //                     const ress = await newFile.save();
    //                     if (ress) {
    //                         const params = {
    //                             Bucket: bucket_name,
    //                             Key: `ytthumb/${ress.fileName}`,
    //                             Body: data.buffer,
    //                             ContentType: data.mimetype
    //                         };
    //                         const command = new PutObjectCommand(params);
    //                         await s3.send(command);
    //                         responseCount = responseCount + 1;
    //                     } else {
    //                         errorCount = errorCount + 1;
    //                     }
    //                 } catch (err) {
    //                     console.log(err, "Catch err");
    //                     errorCount = errorCount + 1;
    //                 }
    //             }));

    //             // Send response
    //             res.status(200).json({ responseCount, errorCount, numberOfFiles });

    //         }
    //     })
    // } catch (err) {
    //     res.status(301).json({
    //         message: "Error on create!",
    //         err: err
    //     })
    // }
}


// GEt by folder id

const getUpload = async (req, res, next) => {
    try {
        const uploads = await UploadFile.find({ location: req.body.location });
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
        const body = req.body
        await UploadFile.updateOne({ _id: String(body._id) }, { $set: { link: String(body.link), location: String(body.location) } })
            .then((ress) => {
                res.status(200).json({
                    message: "Youtube link Updated it!",
                    result: {
                        _id: body._id,
                        link: body.link,
                        location: body.location
                    }
                })
            })
            .catch(err => {
                res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update" })
            })

    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }


    // try {
    //     await upload(req, res, async function (err) {
    //         // if (req.file.size < 1000000) {
    //         console.log(req?.files, "Req Files");
    //         console.log(err, "Err files");
    //         if (err || req.files.length > 1) {
    //             res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on file or File is more than 1" })
    //         } else {
    //             const parms = {
    //                 Bucket: bucket_name,
    //                 Key: `ytthumb/${req.body.fileName}`,
    //             }
    //             const command = new DeleteObjectCommand(parms)
    //             await s3.send(command)
    //                 .then(async (ress1) => {
    //                     let responseCount = 0
    //                     let errorCount = 0
    //                     const numberOfFiles = req.files?.length

    //                     await Promise.all(req.files?.map(async data => {
    //                         // console.log(data, "Inside map");
    //                         try {
    //                             const uploadData = await UploadFile.updateOne(
    //                                 { _id: String(req.body._id) },
    //                                 { $set: { fileName: `YTTHUMB_${Date.now()}_${Math.random().toString(36).substring(7)}.png` } }
    //                             )
    //                             if (uploadData) {
    //                                 const ress = await UploadFile.findOne({ _id: String(req.body._id) })
    //                                 if (ress) {
    //                                     console.log(ress, "DB Res");
    //                                     const params1 = {
    //                                         Bucket: bucket_name,
    //                                         Key: `ytthumb/${ress.fileName}`,
    //                                         Body: data.buffer,
    //                                         ContentType: data.mimetype
    //                                     };
    //                                     const command1 = new PutObjectCommand(params1);
    //                                     await s3.send(command1);
    //                                     responseCount = responseCount + 1;
    //                                 } else {
    //                                     errorCount = errorCount + 1;
    //                                 }
    //                             }
    //                         } catch (err) {
    //                             console.log(err, "Err ");
    //                             errorCount = errorCount + 1;
    //                         }
    //                     }));

    //                     // Send response
    //                     res.status(200).json({ responseCount, errorCount, numberOfFiles });

    //                 })
    //         }
    //     })
    // } catch (err) {
    //     console.log(err, "Catch");
    //     res.status(301).json({
    //         message: "Error on create!",
    //         err: err
    //     })
    // }
}



// Update File data
// const updateUploadFileData = async (req, res, next) => {
//     try {
//         const body = req.body
//         await UploadFile.updateOne(
//             { _id: String(body._id) },
//             { $set: { location: String(body.location), link: String(body.link) } }
//         )
//             .then((ress) => {
//                 res.status(200).json({
//                     message: 'Updated Data',
//                     result: ress
//                 });
//             })
//             .catch((err) => {
//                 // console.log(err);
//                 res.status(301).json({
//                     message: 'Something went wrong!!',
//                     result: err
//                 });
//             })
//     } catch (err) {
//         console.log(err, "Catch");
//         res.status(301).json({
//             message: "Error on create!",
//             err: err
//         })
//     }
// }


// Delete
const deleteUpload = async (req, res, next) => {
    try {

        await UploadFile.deleteOne({ _id: String(req.body._id) })
            .then((result) => {
                res.status(200).json({
                    message: "Deleted!",
                    result: result
                })
            })
            .catch(err => {
                res.status(301).json({
                    message: "Error on delete file!",
                    err: err
                })
            })


        // const parms = {
        //     Bucket: bucket_name,
        //     Key: `ytthumb/${req.body.fileName}`,
        // }
        // const command = new DeleteObjectCommand(parms)
        // await s3.send(command)
        //     .then(async (ress1) => {
        //         UploadFile.deleteOne({ _id: String(req.body._id) })
        //             .then((result) => {
        //                 res.status(301).json({
        //                     message: "Deleted!",
        //                     err: result
        //                 })
        //             })
        //             .catch(err => {
        //                 res.status(301).json({
        //                     message: "Error on delete file!",
        //                     err: err
        //                 })
        //             })
        //     })
        //     .catch(err => {
        //         res.status(301).json({
        //             message: "Error on delete file!",
        //             err: err
        //         })
        //     })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}


module.exports = { postUpload, getUpload, updateUpload, deleteUpload }