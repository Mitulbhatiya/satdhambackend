const express = require('express')
const { adminLogin, userLogin } = require('../../controller/v1/login/login.controller')
const router = express.Router()

// ADMIN
router.post(
    "/admin",
    adminLogin
)

// USER
router.post(
    "/user",
    userLogin
)

module.exports = router