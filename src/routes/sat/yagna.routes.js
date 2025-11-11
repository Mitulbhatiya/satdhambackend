const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postUpload, getUpload, updateUpload, deleteUpload } = require('../../controller/v1/sat/yagna')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    postUpload
)

router.get(
    "/get",
    // isValidAdmin,
    getUpload
)

router.patch(
    "/patch",
    isValidAdmin,
    updateUpload
)


router.delete(
    "/delete",
    isValidAdmin,
    deleteUpload
)
module.exports = router