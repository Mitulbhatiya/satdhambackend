const jwt = require('jsonwebtoken');
const key = process.env.TOKEN_KEY;
const logintoken = require('../../models/token/token.model')

const isValidUser = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = req.headers.isauth
        const role = req.headers.isr

        console.log(token, isAuth, role);
        const decoded = jwt.verify(token, key)
        const roleArr = ['zonesubadmin', 'admin', 'user']
        if (!token || isAuth != "true" || !roleArr.includes(role)) {
            return res.status(404).json({
                message: "Forbidden!"
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
        console.log(e);
        res.status(404).json({
            message: "Forbidden"
        })
    }
}

module.exports = isValidUser