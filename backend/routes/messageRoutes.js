const express = require('express')
const router  = express.Router()
const {protect} = require("../middleware/authMiddleware")
const {sendMessage } = require("../controllers/messageController")
const {allMessage} = require("../controllers/messageController")
router.post("/",protect,sendMessage)

router.get("/:chatId",protect,allMessage)

module.exports = router