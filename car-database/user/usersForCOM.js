const express = require('express')
const router = express.Router()
const pool = require('../db')

const queries = {
    fetchByCid: `select * from car left join car_owner_mapping com on car.cid = com.cid 
    left join owner on com.oid = owner.oid where com.cid = $1 ;`,
    fetchByOid: `select * from car left join car_owner_mapping com on car.cid = com.cid 
    left join owner on com.oid = owner.oid where com.oid = $1;`,
    fetchAll: `select * from car left join car_owner_mapping com on car.cid = com.cid 
    left join owner on com.oid = owner.oid order by com.cid asc;`,
    fetchOid: 'selct * from car_owner_mapping where oid = $1',
    fetchCid: `select * from car_owner_mapping where cid = $1`,
    updateForCid: `update car_owner_mapping set oid = $1 where cid = $2 returning *`,
    updateForOid: `update car_owner_mapping set cid = $1 where oid = $2 returning *`,
}

const isVoid = (key) => key === undefined || key === null || key === "";

router.param('oid', (req, res, next) => {
    const id = parseInt(req.params.oid);
    if (isNaN(id)) {
        res.status(404).send(`Invalid Input ${req.params.oid}`)
    }
    else {
        next();
    }
})
router.get('/oid/:oid?', async (req, res) => {
    try {
        const id = req.params.oid;
        if (isVoid(id)) {
            const fetchAll = await pool.query(queries.fetchAll)
            res.send(fetchAll.rows[0])
        }
        else {
            const fetchByOid = await pool.query(queries.fetchByOid, [id])
            if (isVoid(fetchByOid.rows[0])) {
                res.status(404).send('failed :( [check again your value]')
            } else {
                res.send(fetchByOid.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.param('carId', (req, res, next) => {
    const id = parseInt(req.params.carId);
    if (isNaN(id)) {
        res.status(404).send(`Invalid Input ${req.params.carId}`)
    }
    else {
        next();
    }
})

router.get('/cid/:carId?', async (req, res) => {
    try {
        const id = req.params.carId;
        if (isVoid(id)) {
            const fetchAll = await pool.query(queries.fetchAll)
            res.send(fetchAll.rows[0])
        }
        else {
            const fetchByCid = await pool.query(queries.fetchByCid, [id])
            if (isVoid(fetchByCid.rows[0])) {
                res.status(404).send('failed :( [check again your value]')
            } else {
                res.send(fetchByCid.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.patch('/cid/', async (req, res) => {
    try {
        const { cid, oid } = req.body;
        if (isVoid(req.body)) {
            res.status(400).send(`please insert the cid and oid for insert query`)
        } else if (isVoid(cid) || isVoid(oid)) {
            res.status(400).send(`please insert the correct values`)
        } else if ((!isVoid(cid)) && (!isVoid(oid))) {
            const updateForCid = await pool.query(queries.updateForCid, [oid, cid])
            if (isVoid(updateForCid.rows[0])) {
                res.status(404).send('failed :(')
            } else {
                res.send(updateForCid.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.patch('/oid/', async (req, res) => {
    try {
        const { cid, oid } = req.body;
        if (isVoid(req.body)) {
            res.status(400).send(`please insert the cid and oid for insert query`)
        } else if (isVoid(cid) || isVoid(oid)) {
            res.status(400).send(`please insert the correct values`)
        } else if ((!isVoid(cid)) && (!isVoid(oid))) {
            const updateForOid = await pool.query(queries.updateForOid, [cid, oid])
            if (isVoid(updateForOid.rows[0])) {
                res.status(404).send('failed :( [check the values again!!]')
            } else {
                res.send(updateForOid.rows[0])
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})


module.exports = router