// Models
const User = require('../../../models/user/user.model')


const getUserDataByZone = async (req, res, next) => {
    try {
        await User.find({ zone: req.body.zone }, { password: 0 })
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

module.exports = { getUserDataByZone }