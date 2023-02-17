const express = require('express');
const router = express.Router();

const Booking = require('../models/bookingModel');

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormt = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        label({ label: 'booking' }),
        timestamp(),
        myFormt
    ),
    transports: [new transports.Console()]
});

// get a list of bookings from db
router.get('/bookings', async (req, res, next) => {
    logger.info(`Received a GET request on ${req.path} from ${req.hostname}`);
    let rooms = await Booking.find({hotel: req.body.hotel})
    res.send(rooms);
    logger.info(`Response sent for GET ${req.path} to ${req.hostname}`);
});

// add a new booking to db
router.post('/bookings', (req, res, next) => {
    Booking.create(req.body)
    .then( booking => {
        res.send(booking);
    }).catch(next);
});

//update a booking in db
router.put('/bookings/:id', (req, res, next) => {
    Booking.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => {
        Booking.findOne({_id: req.params.id})
        .then( booking => {
            res.send(booking);
        });
    });
});

//delete a booking form db
router.delete('/bookings/:id', (req, res, next) => {
    Booking.findByIdAndRemove({_id: req.params.id})
    .then( booking => {
        res.send(booking);
    });
});

module.exports = router;