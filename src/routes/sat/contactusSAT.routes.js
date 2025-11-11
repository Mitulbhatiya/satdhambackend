const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postContactUS, getAllContactUs, getContactUSByType } = require('../../controller/v1/sat/contactus_sat')
const router = express.Router()


router.post(
    "/post",
    postContactUS
)

router.get(
    "/get",
    isValidAdmin,
    getAllContactUs
)

router.get(
    "/get/query",
    isValidAdmin,
    getContactUSByType
)

module.exports = router