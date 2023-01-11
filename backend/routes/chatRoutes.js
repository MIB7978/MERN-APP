const express = require("express")
const router = express.Router()
const {protect} = require("../middleware/authMiddleware")
const { route } = require("./userRoutes")
const {accessChat,fetchChat, createGroupChat,renameGroup,addUser,removeUser} = require("../controllers/chatController")



router.post("/",protect,accessChat)
router.get("/",protect,fetchChat)
router.post("/group",protect,createGroupChat)
router.put("/rename",protect,renameGroup)
router.put("/adduser",protect,addUser)
router.delete("/remove",protect,removeUser)
// router.put("/",protect,renameGroup)
// router.put("/",protect,removeGroup)
// router.put("/",protect,addgroup)

module.exports = router