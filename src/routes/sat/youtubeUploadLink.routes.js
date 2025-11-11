const express = require('express')
const isValidAdmin = require('../../helper/auth/admin.auth')
const { postYoutubeLink, getYoutubeLink, updateYoutubeLink, deleteYoutubeLink } = require('../../controller/v1/sat/youtubeLinkUpload')
const router = express.Router()


router.post(
    "/post",
    isValidAdmin,
    postYoutubeLink
)

router.post(
    "/get",
    // isValidAdmin,
    getYoutubeLink
)

router.patch(
    "/patch",
    isValidAdmin,
    updateYoutubeLink
)

router.delete(
    "/delete",
    isValidAdmin,
    deleteYoutubeLink
)

module.exports = router