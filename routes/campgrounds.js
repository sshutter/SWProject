const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getCampgrounds).post(protect, createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(protect, updateCampground)
  .delete(protect, deleteCampground);

module.exports = router;
