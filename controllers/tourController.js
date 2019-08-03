const Tour = require('./../models/tourModel');

// Tour Controllers

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing tour name or price'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime
        // results: tours.length,
        // data: {
        //     tours
        // }
    });
};

exports.getTourById = (req, res) => {
    // Converts string to number
    const id = req.params.id * 1;

    // Finds tour with matching id from parameter
    // const tour = tours.find(el => el.id === id);

    // res.status(200).json({
    //     status: 'success',
    //     tour
    // });
};

exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'success'
        // data: {
        //     tour: newTour
        // }
    });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
