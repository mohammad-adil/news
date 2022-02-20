const router = require("express").Router();
const _newsService = require("./news.service");

router.post("/add", _newsService.doAddNews);
router.patch("/update/:_id", _newsService.doUpdateNews);
router.delete("/delete/:_id", _newsService.doDeleteNews);
router.get("/all", _newsService.doGetAllNews);
module.exports = router;
