const express = require('express')
const router = express.Router()

const carDatabase = [{
    carId: 1,
    model: 'maruti',
    price: 2000,
    year: 1990
},
{
    carId: 2,
    model: 'BMW',
    price: 10000,
    year: 2020
},
{
    carId: 3,
    model: 'audi',
    price: 11000,
    year: 2015
},
{
    carId: 4,
    model: 'mercedes',
    price: 12000,
    year: 2010
},
{
    carId: 5,
    model: 'renault',
    price: 5000,
    year: 2005
}
]

const isVoid = (key) => key === undefined || key === null || key === "";

router.param("carId", (req, res, next) => {
    const id = parseInt(req.params.carId);
    if (isNaN(id)) {
        return res.send('CarId is only in number');
    }
    next()
})

router.get('/:carId?', (req, res) => {
    const Id = parseInt(req.params.carId);
    let car = carDatabase.find(check => check.carId === Id)
    if (isVoid(req.params.carId)) {
        return res.send(carDatabase);
    }
    if (isVoid(car)) {
        return res.send('Please enter the correct carID')
    }
    for (let i = 0; i < carDatabase.length; i++) {
        if (carDatabase[i].carId == Id) {
            res.send(carDatabase[i]);
        }
    }

})

router.post('/', (req, res) => {
    let { carId, model, price, year } = req.body
    const Id = parseInt(carId);
    let car = carDatabase.find(check => check.carId === Id);
    if (car) {
        return res.send('This carId already exists!');
    } else if (carId === 0 || carId < 0) {
        return res.send(`this type ${carId} of values dont used in rollNo`)
    } else if (isVoid(carId)) {
        return res.send('Please enter the CarId');
    } else if (typeof (carId) != 'number') {
        return res.send('CarId is only in number format')
    } else if (isVoid(price)) {
        return res.send('Please enter the price of the car')
    } else if (isVoid(year)) {
        return res.send('Please enter the year of the car')
    } else if (isVoid(model)) {
        return res.send('Please enter the Model name of the Car')
    } else if (isVoid(car)) {
        carDatabase.push(req.body);
        res.send(carDatabase);
    }
})

router.patch('/', (req, res) => {
    let { carId, model, price, year } = req.body;
    const Id = parseInt(carId)
    let car = carDatabase.find(check => check.carId === Id);
    if (isVoid(carId)) {
        return res.send('Please enter the CarId');
    } else if (typeof (carId) != 'number') {
        return res.send('CarId is only in number format')
    } else if (isVoid(price)) {
        return res.send('Please enter the price of the car')
    } else if (isVoid(year)) {
        return res.send('Please enter the year of the car')
    } else if (isVoid(model)) {
        return res.send('Please enter the Model name of the Car')
    } else if (car) {
        car.model = model;
        car.price = price;
        car.year = year;
        res.send(req.body);
    }
})

router.delete('/:carId?', (req, res) => {
    const Id = parseInt(req.params.carId)
    let car = carDatabase.find(check => check.carId === Id);
    if (isVoid(Id)) {
        return res.send('Please enter the CarId which you want to delete')
    } else if (isVoid(car)) {
        return res.send('Invalid CarId')
    } else {
        for (let i = 0; i < carDatabase.length; i++) {
            if (carDatabase[i] === car) {
                carDatabase.splice(i, 1);
                res.send(car)
            }
        }
    }
})

module.exports = router