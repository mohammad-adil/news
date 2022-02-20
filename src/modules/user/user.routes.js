const router = require("express").Router();
const auth = require("../../middleware/auth");
const _userService = require("./user.service");

router.post("/signup", _userService.doSignup);

module.exports = router;
