const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postUpload, getUpload, updateUpload, updateUploadLinkStatus, deleteUpload } = require('../../controller/v1/sat/uploadActivity')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    postUpload
)

router.post(
    "/get",
    // isValidAdmin,
    getUpload
)

router.patch(
    "/patch",
    isValidAdmin,
    updateUpload
)

router.patch(
    "/patch/video/status",
    isValidAdmin,
    updateUploadLinkStatus
)

router.delete(
    "/delete",
    isValidAdmin,
    deleteUpload
)
module.exports = router