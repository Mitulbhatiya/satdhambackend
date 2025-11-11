const { query } = require("express");
const Folder = require("../../../models/sat/folderSeva")
const UploadFile = require("../../../models/sat/uploadSeva")

// Create

const postFolder = async (req, res, next) => {
    try {
        const folder = new Folder(req.body);
        const savedFolder = await folder.save();
        res.status(200).json({
            message: "Folder created successfully 😊",
            result: savedFolder
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on create!",
            err: err
        })
    }
}


// GEt -all
const getFolder = async (req, res, next) => {
    try {
        // Extract year and month from query parameters, defaulting to current year and month if not provided
        const qyear = req.query.year ? String(req.query.year) : undefined;
        const qmonth = req.query.month ? String(req.query.month) : undefined;
        // const qlocation = req.query.location ? String(req.query.location) : undefined;
        console.log(qyear, qmonth);
        let folders;
        if (qyear === undefined && qmonth === undefined) {
            const d = new Date();
            const year = String(d.getFullYear());
            const month = d.toLocaleString('en-EN', { month: 'long' });
            folders = await Folder.find({ year, month });
        } else {
            if (qyear && qmonth) {
                // console.log("aa");
                folders = await Folder.find({ year: qyear, month: qmonth });
            } else if (qyear) {
                // console.log("bb");
                folders = await Folder.find({ year: qyear });
            } else if (qmonth) {
                // console.log("cc");
                folders = await Folder.find({ month: qmonth });
            } else {
                throw new Error("Invalid query parameters");
            }
        }

        // Send the response
        res.status(200).json({
            message: "Folders retrieved successfully 😊",
            result: folders,
        });

    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving folders.",
            error: error.message,
        });
    }

}


// Update

const updateFolder = async (req, res, next) => {
    try {
        const body = req.body
        await Folder.updateOne({ _id: String(body._id) }, { $set: { date: body.date, description: String(body.description), title: String(body.title), month: String(body.month), year: String(body.year), videologo: Boolean(body.videologo) } })
            .then((ress) => {
                res.status(200).json({
                    message: "Folder Updated it!",
                    result: {
                        _id: body._id,
                        date: body.date,
                        description: body.description,
                        title: body.title,
                        month: body.month,
                        year: body.year,
                        videologo: body.videologo
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


// Update Folder Youtube/Link Status

const updateFolderLinkStatus = async (req, res, next) => {
    try {
        const body = req.body
        await Folder.updateOne({ _id: String(body._id) }, { $set: { videologo: body.videologo } })
            .then((ress) => {
                res.status(200).json({
                    message: "Folder Updated for video it!",
                    result: {
                        _id: body._id,
                        videologo: body.videologo
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

const deleteFolder = async (req, res, next) => {
    try {
        const body = req.body
        const numberOfEntries = await UploadFile.countDocuments({ folderId: String(body._id) });
        if (numberOfEntries == 0) {
            await Folder.deleteOne({ _id: String(body._id) })
                .then((ress) => {
                    res.status(200).json({
                        message: "Folder Deleted it!",
                        result: {
                            _id: body._id,
                        }
                    })
                })
                .catch(err => {
                    res.status(401).json({ message: "Opps! Somthing went wrong.", result: "something went wrong on update" })
                })
        } else {
            res.status(301).json({ message: "Opps! Somthing went wrong.", result: "Files available in this folder" })
        }


    } catch (err) {
        res.status(401).json({ message: "Opps! Somthing went wrong.", result: err })
    }
}

// Make a thumbnail

const makeThumbnail = async (req, res, next) => {
    try {
        const body = req.body
        await Folder.updateOne({ _id: String(body._id) }, { $set: { thumbnail: body.thumbnail } })
            .then((ress) => {
                res.status(200).json({
                    message: "Thmbnail Updated it!",
                    result: {
                        _id: body._id,
                        thumbnail: body.thumbnail
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







// Make a banner image

const makeBanner = async (req, res, next) => {
    try {
        const body = req.body
        await Folder.updateOne({ _id: String(body._id) }, { $set: { bannerImg1: body.bannerImg1 } })
            .then((ress) => {
                res.status(200).json({
                    message: "bannerImg Updated it!",
                    result: {
                        _id: body._id,
                        bannerImg1: body.bannerImg1
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
module.exports = { postFolder, getFolder, updateFolder, updateFolderLinkStatus, deleteFolder, makeThumbnail, makeBanner }