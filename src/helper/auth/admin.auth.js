const jwt = require('jsonwebtoken');
const key = process.env.TOKEN_KEY;
const logintoken = require('../../models/token/token.model')

const isValidAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = req.headers.isauth
        const role = req.headers.isr.split("00000")[1]

        const decoded = jwt.verify(token, key)
        // console.log(token);
        if (!token || isAuth != "true" || role != "isra") {
            return res.status(404).json({
                message: "Forbidden"
            })
        }
        const isLogin = await logintoken.findOne({ token: token })
        if (!isLogin) {
            return res.status(404).json({
                message: "Forbidden"
            })
        } else {
            req.userData = decoded
            next()
        }

    } catch (e) {
        res.status(404).json({
            message: "Forbidden"
        })
    }
}

module.exports = isValidAdmin