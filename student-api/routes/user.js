const { Router } = require('express');
const user = require('express');
const router = user.Router()

const studentList = [{
    rollNo: 1,
    name: 'vijay',
    subject: 'eng'
}, {
    rollNo: 2,
    name: 'jay',
    subject: 'eng'
}]

const isVoid = (key) => key === undefined || key === null || key === '';
const isNotVoid = (key) => key != undefined || key != null || key != '';

router.param("rollNo", (req, res, next) => {
    const roll = parseInt(req.params.rollNo);
    if (isNaN(roll)) {
        return res.send('RollNo is only in number format')
    } else {
        next()
    }
})

router.get('/:rollNo?', (req, res) => {
    const rollNo = parseInt(req.params.rollNo);
    if (req.params.rollNo === undefined) {
        return res.send(studentList)
    }
    const student = studentList.find(check => check.rollNo === rollNo);
    if (student === undefined) {
        res.send('Please Enter the correct Roll.No ');
    } else {
        res.send(student);
    }
})

router.delete('/', (req, res) => {
    let { rollNo, name, subject } = req.body
    const roll = parseInt(rollNo);
    if (isVoid(rollNo)) {
        res.status(400).send('please fill the correct values')
    } else {
        for (var i = 0; i < studentList.length; i++) {
            if (studentList[i].rollNo === roll) {
                res.send(studentList[i]);
                return studentList.splice(i, 1);
            }
        }
        res.status(400).send('Please Enter the correct Roll.NO ');
    }
})

router.post('/', (req, res) => {
    const { rollNo, name, subject } = req.body;
    const roll = parseInt(rollNo);
    const student = studentList.find(check => check.rollNo === roll);
    if (roll === 0 || roll < 0) {
        res.status(400).send(`this value ${roll} does not exist anywhere`)
    } else if (isVoid(rollNo)) {
        res.status(400).send('RollNo. is mandatory!!')
    } else if (isVoid(subject)) {
        res.status(400).send('subject is mandatory!!')
    } else if (isVoid(name)) {
        res.status(400).send('Name is mandatory!!')
    } else if (isVoid(student)) {
        studentList.push({ rollNo, name, subject });
        res.send({ rollNo, name, subject });
    } else {
        res.status(400).send('please check the roll no.')
    }

})

router.patch('/', (req, res) => {
    const { rollNo, name, subject } = req.body;
    roll = parseInt(rollNo)
    const student = studentList.find(check => check.rollNo === roll);
    if (student === undefined) {
        res.send('Please Enter the correct Roll.NO ');
    } else if (isVoid(rollNo)) {
        res.send("Please fill the correct values")
    } else if (student.rollNo === roll) {
        if (!isVoid(name)) student.name = name;
        if (!isVoid(subject)) student.subject = subject;
        res.send(student);
    } else {
        res.send('Please check the values')
    }
})

module.exports = router;