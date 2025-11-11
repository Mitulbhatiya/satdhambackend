const YoutubeLink = require("../../../models/youtubeLink/youtube.model")

// Create

const postYoutubeLink = async (req, res, next) => {
    try {
        const youtube = new YoutubeLink(req.body);
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
}


// GEt -all
const getYoutubeLink = async (req, res, next) => {
    try {
        const youtube = await YoutubeLink.find();
        res.status(200).json({
            message: "Youtube link get successfully 😊",
            result: youtube
        })
    } catch (err) {
        res.status(301).json({
            message: "Error on get!",
            err: err
        })
    }
}



// Update

const updateYoutubeLink = async (req, res, next) => {
    try {
        const body = req.body
        await YoutubeLink.updateOne({ _id: String(body._id) }, { $set: { youtubeLink: String(body.youtubeLink) } })
            .then((ress) => {
                res.status(200).json({
                    message: "Youtube link Updated it!",
                    result: {
                        _id: body._id,
                        youtubeLink: body.youtubeLink
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

const deleteYoutubeLink = async (req, res, next) => {
    try {
        const body = req.body
        await YoutubeLink.deleteOne({ _id: String(body._id) })
            .then((ress) => {
                res.status(200).json({
                    message: "Youtube Link Deleted it!",
                    result: {
                        _id: body._id,
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


module.exports = { postYoutubeLink, getYoutubeLink, updateYoutubeLink, deleteYoutubeLink }