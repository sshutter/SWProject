const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

// @desc Get all bookings
// @route Get /api/v1/bookings
// @access Private
exports.getBookings = async (req, res, next) => {
  let query;
  // General users can see only their appointments
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "campground",
      select: "name province tel",
    });
  } else {
    query = Booking.find().populate({
      path: "campground",
      select: "name province tel",
    });
  }
  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      const: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Booking",
    });
  }
};

//@desc Get single booking
//@route Get /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "campground",
      select: "name description tel",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find booking" });
  }
};

//@desc     Add booking
//@route    POST /api/vi/campgrounds/:campgroundId/booking
//@access   Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.campground = req.params.campgroundId;

    const campground = await Campground.findById(req.params.campgroundId);

    if (!campground) {
      return res.status(404).json({
        success: false,
        massage: `No campground with the id of ${req.params.campgroundId}`,
      });
    }
    // console.log(req.body);

    // add user Id to req.body
    req.body.user = req.user.id;

    // check for existed booking
    const existedBooking = await Booking.find({ user: req.user.id });

    // //If the user is not an admin, they can only create 3 appointment
    // if (existedBooking.length >= 3 && req.user.role !== "admin") {
    //   return res.status(400).json({
    //     success: false,
    //     message: `The user with ID ${req.user.id} has already made 3 appointments`,
    //   });
    // }
    console.log(existedBooking);

    const booking = await Booking.create(req.body);
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        massage: `No booking with the id of ${req.params.id}`,
      });
    }

    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
