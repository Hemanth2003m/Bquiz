const express = require("express");
const router = express.Router();
const { createQuestion } = require("../Controllers/questionController");

router.post("/questions", createQuestion);

module.exports = router;
