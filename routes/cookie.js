var express = require('express');
var router = express.Router();
var CookieController = require('../controllers/CookieController');


router.get("/search/:search", CookieController.find);
router.get("/:id",CookieController.getOne);
router.get("/", (req,res,next) => { req.listPost = true; next()},CookieController.find);

router.post("/", CookieController.create);
router.put("/:id",CookieController.update);

router.delete("/:id",CookieController.delete);
module.exports = router;