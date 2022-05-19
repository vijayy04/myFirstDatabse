const express = require('express')
const router = express.Router()
const pool = require('../db')

const queries = {
    fetchAll: 'select * from owner order by oid asc;',
    FetchById: `select * from owner where oid = $1`,
    updateOwnerName: `update owner set ownername = $1 where oid = $2 returning *`,
    insertValues: `INSERT INTO owner VALUES( $1, $2) returning *`,
    insertCOM: `insert into car_owner_mapping(oid) values ($1)`,
    delete: `delete from owner where oid = $1 returning *;`,
    deleteFromCOM: `delete  from car_owner_mapping where oid = $1`
}

const isVoid = (key) => key === undefined || key === null || key === "";

router.param('ownerId', (req, res, next) => {
    const id = parseInt(req.params.ownerId)
    if (isNaN(id)) {
        res.status(404).send(`Invalid Input ${req.params.ownerId}`);
    } else {
        next()
    }
})

router.get('/:ownerId?', async (req, res) => {
    const id = req.params.ownerId;
    if (isVoid(req.params.ownerId)) {
        const fetchAll = await pool.query(queries.fetchAll)
        res.send(fetchAll.rows)
    } else {
        const fetchId = await pool.query(queries.FetchById, [id])
        if (isVoid(fetchId.rows[0])) {
            res.status(404).send('there is no such values in owner Database')
        } else {
            res.send(fetchId.rows[0])
        }
    }
})

router.post('/', async (req, res) => {
    try {
        const { oid, ownername } = req.body;
        const fetchId = await pool.query(queries.FetchById, [oid])
        if (isVoid(isVoid(oid) && isVoid(ownername))) {
            res.status(400).send('Please insert oid')
        } else if (isVoid(oid)) {
            res.status(400).send('Please insert oid')
        } else if (isVoid(ownername)) {
            res.status(400).send('Please insert ownername')
        } else if (fetchId.rows.length === 0) {
            const insertValue = await pool.query(queries.insertValues, [oid, ownername])
            await pool.query(queries.insertCOM, [oid])
            console.log(insertValue.rows)
            if (isVoid(insertValue.rows[0])) {
                res.status(404).send('no data found')
            } else {
                res.send(insertValue.rows[0])
            }
        }
        else {
            res.status(404).send('this oid already exist in owner database')
        }
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

router.patch('/', async (req, res) => {
    try {
        let { oid, ownername } = req.body;
        if (isVoid(isVoid(oid) && (ownername))) {
            res.status(400).send('Please insert oid and ownername to update the owners')
        } else if (isVoid(oid)) {
            res.status(400).send('oid is important to update the values')
        } else if (isVoid(ownername)) {
            res.status(400).send('ownername is important to update the values')
        } else if (!isVoid(ownername)) {
            const updateName = await pool.query(queries.updateOwnerName, [ownername, oid])
            if (isVoid(updateName.rows[0])) {
                res.status(404).send('There is no such values in owner database')
            } else {
                res.send(updateName.rows[0])
            }
        }
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.delete('/:ownerId?', async (req, res) => {
    try {
        const id = req.params.ownerId;
        if (isVoid(req.params.ownerId)) {
            res.status(400).send('Please insert the ID for delete');
        }
        else {
            const remove = await pool.query(queries.delete, [id])
            if (isVoid(remove.rows[0])) {
                res.status(404).send('there is no sich values in owner database')
            } else {
                res.send(remove.rows[0])
            }
        }
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router