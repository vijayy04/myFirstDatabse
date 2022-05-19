const express = require('express')
const router = express.Router()
const pool = require('../db')

const queries = {
    fetchAll: 'select * from car;',
    FetchById: `select * from car where cid = $1`,
    updateModel: `update car set model = $1 where cid = $2 returning *`,
    insertValues: `insert into car values($1, $2) returning *`,
    insertIntoCOM: `insert into car_owner_mapping(cid) values($1)`,
    delete: `delete from  car where cid = $1 returning *;`,
    deleteFromCOM: `delete from car_owner_mapping where cid = $1`,
}

const isVoid = (key) => key === undefined || key === null || key === "";

router.param('carId', (req, res, next) => {
    const id = parseInt(req.params.carId)
    if (isNaN(id)) {
        res.status(404).send(`Invalid Input ${req.params.carId}`);
    } else {
        next()
    }
})

router.get('/:carId?', async (req, res) => {
    try {
        const id = req.params.carId
        if (isVoid(id)) {
            const all = await pool.query(queries.fetchAll)
            res.json(all.rows)
        }
        else {
            const byId = await pool.query(queries.FetchById, [id])
            if (isVoid(byId.rows[0])) {
                res.status(404).send('no data found')
            } else {
                res.send(byId.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const { cid, model } = req.body;
        const fetchId = await pool.query(queries.FetchById, [cid])
        if (isVoid(cid) && isVoid(model)) {
            res.status(404).send(`please insert cid and model of the car`)
        } else if (isVoid(cid)) {
            res.status(404).send('Please insert cid of the car')
        } else if (isVoid(model)) {
            res.status(404).send('Please insert model of the car')
        } else if (fetchId.rows.length === 0) {
            const postDatabase = await pool.query(queries.insertValues, [cid, model])
            const postDatabaseAuto = await pool.query(queries.insertIntoCOM, [cid])
            if (isVoid(postDatabase.rows[0])) {
                res.status(404).send('no data found')
            } else {
                res.send(postDatabase.rows[0])
            }
        }
        else {
            res.status(404).send('this cid already exist in car database')
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.patch('/', async (req, res) => {
    try {
        let { cid, model } = req.body;
        if (isVoid(isVoid(cid) && isVoid(model))) {
            res.status(400).send('Car Id is important to update the values')
        } else if (isVoid(cid)) {
            res.status(400).send('Car Id is important to update the values')
        } else if (isVoid(model)) {
            res.status(400).send('Please insert model of the car for updating values')
        } else if (!isVoid(cid) && !isVoid(model)) {
            const update = await pool.query(queries.updateModel, [model, cid])
            if (isVoid(update.rows[0])) {
                res.status(404).send('There is no such values in car Database')
            } else {
                res.send(update.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})
router.delete('/:carId?', async (req, res) => {
    try {
        const id = req.params.carId;
        if (isVoid(req.params.carId)) {
            res.status(400).send('Please insert the Car ID for delete');
        }
        else {
            const deleteDatabase = await pool.query(queries.delete, [id])
            if (isVoid(deleteDatabase.rows[0])) {
                res.status(404).send("there is no such values to delete on car Database")
            } else {
                res.send(deleteDatabase.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

module.exports = router