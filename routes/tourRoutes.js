const express = require('express');
const tourController = require('./../controllers/tourController');

// Routes
const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware function
// Check if body contains the name property and price property

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
