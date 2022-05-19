const chai = require('chai');
const expect = chai.expect;
let should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../server.js')
const assert = require('assert');
const pool = require('../db/index.js');
const { response } = require('express');

chai.use(chaiHTTP);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////------------------ THIS IS FOR OWNER DATABASE ----------------////////////////////////////////

describe('car database api', () => {
    before(async () => {
        const func = async () => {
            await pool.query('delete from car');
        }

        await func();
    })

    /**
     * test the post route for insert the data in car database
     */
    describe("POST /carDatabase/", () => {
        it("It Should insert the data in car Database", (done) => {
            chai.request(server)
                .post("/carDatabase/").type('form').send({ "cid": "1", "model": "lambo" })
                .end((err, response) => {
                    expect(response).to.have.status(200);
                    done();
                })
        })

    /**
     * test the post route for checking the data is available or not in car database
     */
        it("It Should check the data in car Database", (done) => {
            chai.request(server)
                .post("/carDatabase/").type('form').send({ "cid": "1", "model": "lambo" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`this cid already exist in car database`);
                    done();
                })
        })

    /**
     * test the post route for check the cid is avaialbe in car database
     */
        it("It Should check cid is available in car Database", (done) => {
            chai.request(server)
                .post("/carDatabase/").type('form').send({ "model": "lambo" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Please insert cid of the car`);
                    done();
                })
        })

    /**
     * test the post route for checking model is available in car database
     */
        it("It Should check the model is available in car Database", (done) => {
            chai.request(server)
                .post("/carDatabase/").type('form').send({ "cid": "200" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Please insert model of the car`);
                    done();
                })
        })

    /**
     * test the post route for checking cid and model is available in car database
     */
        it("It Should check the cid and model is available in car Database", (done) => {
            chai.request(server)
                .post("/carDatabase/").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`please insert cid and model of the car`);
                    done();
                })
        })
    })

    /**
     * test the GET route for single tasks
     */
    describe("GET /carDatabase/:carId?", () => {
        it("It Should GET single Tasks", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/carDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body).to.contain.property('cid');
                    expect(body).to.contain.property('model');
                    expect(body).to.contain.property('cid').eq(taskId);
                    done();
                })
        })

    /**
     * test the GET route for all tasks
     */
        it("It Should GET all Tasks", (done) => {
            chai.request(server)
                .get("/carDatabase/")
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body.length).to.equal(1);
                    done();
                })
        })

    /**
     * test the GET route for those cid which is not available in car database
     */
        it("It Should GET no exist Tasks", (done) => {
            const taskId = 11111;
            chai.request(server)
                .get("/carDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("no data found");
                    done();
                })
        })

    /**
     * test the GET route for those cid which is not available in car database
     */
        it("It Should GET string values Tasks", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .get("/carDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Invalid Input ${taskId}`);
                    done();
                })
        })
    })

    /**
     * test the patch route for update model according to cid in car database
     */
    describe("patch /carDatabase/", () => {
        it("It Should update model acc. to cid", (done) => {
            chai.request(server)
                .patch("/carDatabase/").type('form').send({ "cid": "1", "model": "BMW" })
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    done();
                })
        })

    /**
     * test the patch route for checking cid and model to update that is available to cid in car database
     */
        it("It Should check cid and model for update that is available or not", (done) => {
            chai.request(server)
                .patch("/carDatabase/").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("Car Id is important to update the values")
                    done();
                })
        })

    /**
     * test the patch route for checking cid to update that is available in car database
     */
        it("It Should check cid for update that is available or not", (done) => {
            chai.request(server)
                .patch("/carDatabase/").type('form').send({ "model": "verna" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("Car Id is important to update the values")
                    done();
                })
        })

    /**
     * test the patch route for checking model to update that is available in car database
     */
        it("It Should check model for update that is available or not", (done) => {
            chai.request(server)
                .patch("/carDatabase/").type('form').send({ "cid": "1" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("Please insert model of the car for updating values")
                    done();
                })
        })

    /**
     * test the patch route for checking cid is not available in car database
     */
        it("It Should check cid is not available for update", (done) => {
            chai.request(server)
                .patch("/carDatabase/").type('form').send({ "cid": "1111", "model": "verna" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("There is no such values in car Database")
                    done();
                })
        })
    })

    /**
     * test the delete route for delete the car tasks
     */
    describe("DELETE /carDatabase/:carId?", () => {
        it("It Should GET single Tasks", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/carDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body).to.contain.property('cid');
                    expect(body).to.contain.property('model');
                    expect(body).to.contain.property('cid').eq(taskId);
                    done();
                })
        })

    /**
     * test the delete route for delete the car id which is not available in car database 
     */
    describe("DELETE /carDatabase/:carId?", () => {
        it("It Should check the delete cid is available or not no exist Tasks", (done) => {
            const taskId = 11111;
            chai.request(server)
                .delete("/carDatabase/" + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("there is no such values to delete on car Database");
                    done();
                })
        })
    })

    /**
     * test the delete route for delete the car id which is in string variable in car database 
     */
        it("It Should check the string valued cid is available or not Tasks", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .delete("/carDatabase/" + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Invalid Input ${taskId}`);
                    done();
                })
        })

    /**
     * test the delete route for delete the car id that we wont put in parameter in car database 
     */
        it("It Should check the delete cid is available or not Tasks", (done) => {
            chai.request(server)
                .delete("/carDatabase/")
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal(`Please insert the Car ID for delete`);
                    done();
                })
        })
    })

});




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////-------------------- THIS IS FOR OWNER DATABSE -------------------//////////////////////////






describe('owner database api', () => {
    before(async () => {
        const func = async () => {
            await pool.query('delete from owner')
        }

        await func();
    })


    /**
 * test the post route for insert the data in owner database
 */
    describe("POST /ownerDatabase/", () => {
        it("It Should insert the data in owner Database", (done) => {
            chai.request(server)
                .post("/ownerDatabase/").type('form').send({ "oid": "1", "ownername": "vijay" })
                .end((err, response) => {
                    expect(response).to.have.status(200);
                    done();
                })
        })

    /**
     * test the post route for checking the data is available or not in owner database
     */
        it("It Should check the data in owner Database", (done) => {
            chai.request(server)
                .post("/ownerDatabase/").type('form').send({ "oid": "1", "ownername": "vijay" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`this oid already exist in owner database`);
                    done();
                })
        })

    /**
     * test the post route for check the oid is avaialbe in owner database
     */
        it("It Should check oid is available in owner Database", (done) => {
            chai.request(server)
                .post("/ownerDatabase/").type('form').send({ "ownername": "vijay" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal(`Please insert oid`);
                    done();
                })
        })

    /**
     * test the post route for checking ownername is available in car database
     */
        it("It Should check the ownername is available in car Database", (done) => {
            chai.request(server)
                .post("/ownerDatabase/").type('form').send({ "oid": "200" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal(`Please insert ownername`);
                    done();
                })
        })

    /**
     * test the post route for checking oid and ownername is available in car database
     */
        it("It Should check the oid and ownername is available in car Database", (done) => {
            chai.request(server)
                .post("/ownerDatabase/").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal(`Please insert oid`);
                    done();
                })
        })
    })

    /**
     * test the GET route for single tasks
     */
    describe("GET /ownerDatabase/:ownerId?", () => {
        it("It Should GET single Tasks", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body).to.contain.property('oid');
                    expect(body).to.contain.property('ownername');
                    expect(body).to.contain.property('oid').eq(taskId);
                    done();
                })
        })

    /**
     * test the GET route for all tasks
     */
        it("It Should GET all Tasks", (done) => {
            chai.request(server)
                .get("/ownerDatabase/")
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body.length).to.equal(1);
                    done();
                })
        })

    /**
     * test the GET route for those oid which is not available in car database
     */
        it("It Should GET no exist Tasks", (done) => {
            const taskId = 11111;
            chai.request(server)
                .get("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("there is no such values in owner Database");
                    done();
                })
        })

    /**
     * test the GET route for those oid which is not available in car database
     */
        it("It Should GET string values Tasks", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .get("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Invalid Input ${taskId}`);
                    done();
                })
        })
    })

    /**
     * test the patch route for update ownername according to oid in owner database
     */
    describe("patch /ownerDatabase/", () => {
        it("It Should update ownername acc. to oid", (done) => {
            chai.request(server)
                .patch("/ownerDatabase/").type('form').send({ "oid": "1", "ownername": "viju" })
                .end((err, response) => {
                    expect(response).to.have.status(200);
                    done();
                })
        })

    /**
     * test the patch route for checking oid to update that is available in owner database
     */
        it("It Should check oid for update that is available or not", (done) => {
            chai.request(server)
                .patch("/ownerDatabase/").type('form').send({ "ownername": "vijaya" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("oid is important to update the values")
                    done();
                })
        })

    /**
     * test the patch route for checking ownername to update that is available in car database
     */
        it("It Should check owner for update that is available or not", (done) => {
            chai.request(server)
                .patch("/ownerDatabase/").type('form').send({ "oid": "1" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("ownername is important to update the values")
                    done();
                })
        })

    /**
     * test the patch route for checking oid is not available in car database
     */
        it("It Should check cid is not available for update", (done) => {
            chai.request(server)
                .patch("/ownerDatabase/").type('form').send({ "oid": "1111", "ownername": "verna" })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("There is no such values in owner database")
                    done();
                })
        })

    /**
     * test the patch route for checking oid and ownername to update that is available to owner in car database
     */
        it("It Should check oid and ownername for update that is available or not", (done) => {
            chai.request(server)
                .patch("/ownerDatabase/").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal("Please insert oid and ownername to update the owners")
                    done();
                })
        })
    })

    /**
     * test the delete route for delete the owner tasks
     */
    describe("DELETE /ownerDatabase/:ownerId?", () => {
        it("It Should GET single Tasks", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(response).to.be.json;
                    expect(body).to.contain.property('oid');
                    expect(body).to.contain.property('ownername');
                    expect(body).to.contain.property('oid').eq(taskId);
                    done();
                })
        })

    /**
     * test the delete route for delete the owner id which is not available in owner database 
     */
        it("It Should check the delete oid is available or not Tasks", (done) => {
            const taskId = 11111;
            chai.request(server)
                .delete("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal("there is no sich values in owner database");
                    done();
                })
        })

    /**
     * test the delete route for delete the owner id which is in string variable in owner database 
     */
        it("It Should check the string valued oid is available or not Tasks", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .delete("/ownerDatabase/" + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404);
                    expect(text).to.equal(`Invalid Input ${taskId}`);
                    done();
                })
        })

    /**
     * test the delete route for delete the owner id that we wont put in parameter in owner database 
     */
        it("It Should check the delete oid is available or not Tasks", (done) => {
            chai.request(server)
                .delete("/ownerDatabase/")
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal(`Please insert the ID for delete`);
                    done();
                })
        })
    })


});





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////------------- THIS IS FOR COM DATABSE ------------------//////////////////////////////////




describe('car_owner_mapping api', () => {
    before(async () => {
        const func = async () => {
            await pool.query('delete from car_owner_mapping')
            await pool.query('delete from car')
            await pool.query('delete from owner')
            await pool.query(`insert into car values(1, 'lambo')`);
            await pool.query(`insert into owner values(1, 'vijay')`);
            await pool.query(`insert into car_owner_mapping values(1, 1)`)
        }

        await func();
    })

    after(async () => {
        const func = async () => {
            await pool.query('delete from car_owner_mapping')
        }

        await func();
    })
    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// THIS IS FOR CID //////////////////////////////////////////////////////////////////

    describe("patch /comDatabase/cid/", () => {
        it("it should update the cid acc to oid", (done) => {
            chai.request(server)
                .patch("/comDatabase/cid").type('form').send({ "cid": "1", "oid": "1" })
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200)
                    expect(body).to.contain.property('cid')
                    expect(body).to.contain.property('oid')
                    expect(body).to.contain.property('cid').eq(1)
                    expect(body).to.contain.property('oid').eq(1)
                    done();
                })
        })

        it("it should update the value which is not available", (done) => {
            chai.request(server)
                .patch("/comDatabase/cid").type('form').send({ 'cid': '2', 'oid': '1' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal('failed :(')
                    done();
                })
        })

        it("it should check nothing in parameter", (done) => {
            chai.request(server)
                .patch("/comDatabase/cid").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })

        it("it should check for cid is not in parameter", (done) => {
            chai.request(server)
                .patch("/comDatabase/cid").type('form').send({ 'oid': '1' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })

        it("it should check for oid is not in parameter", (done) => {
            chai.request(server)
                .patch("/comDatabase/cid").type('form').send({ 'cid': '1' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })
    })

    describe("GET /comDatabase/cid/:carId?", () => {
        it("it should get data from cid and oid", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/comDatabase/cid/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(body).to.have.property('cid');
                    expect(body).to.have.property('oid');
                    expect(body).to.have.property('model');
                    expect(body).to.have.property('ownername');
                    expect(body).to.have.property('cid').eq(taskId)
                    done();
                })
        })

        it("it should check cid which is not available in car owner mapping", (done) => {
            const taskId = 1111;
            chai.request(server)
                .get('/comDatabase/cid/' + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal('failed :( [check again your value]')
                    done();
                })
        })

        it("it should check string values in car owner mapping", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .get('/comDatabase/cid/' + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal(`Invalid Input ${taskId}`)
                    done();
                })
        })

        it("it should check string values in car owner mapping", (done) => {
            chai.request(server)
                .get('/comDatabase/oid/')
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(200)
                    done();
                })
        })
    })



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////// THIS IS FOR OID /////////////////////////////////////////////////////////////////////////////


    describe("patch /comDatabase/oid/", () => {
        it("it should update the oid acc to cid", (done) => {
            chai.request(server)
                .patch("/comDatabase/oid").type('form').send({ "cid": "1", "oid": "1" })
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200)
                    expect(body).to.contain.property('cid')
                    expect(body).to.contain.property('oid')
                    expect(body).to.contain.property('cid').eq(1)
                    expect(body).to.contain.property('oid').eq(1)
                    done();
                })
        })

        it("it should update the value which is not available in oid", (done) => {
            chai.request(server)
                .patch("/comDatabase/oid").type('form').send({ 'cid': '1', 'oid': '2' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal('failed :( [check the values again!!]')
                    done();
                })
        })

        it("it should check nothing in parameter in oid", (done) => {
            chai.request(server)
                .patch("/comDatabase/oid").type('form').send({})
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })

        it("it should check for oid is not in parameter", (done) => {
            chai.request(server)
                .patch("/comDatabase/oid").type('form').send({ 'cid': '1' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })

        it("it should check for cid is not in parameter", (done) => {
            chai.request(server)
                .patch("/comDatabase/oid").type('form').send({ 'oid': '1' })
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(400);
                    expect(text).to.equal('please insert the correct values')
                    done();
                })
        })
    })

    describe("GET /comDatabase/oid/:oid?", () => {
        it("it should get data from cid and oid", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/comDatabase/oid/" + taskId)
                .end((err, response) => {
                    const body = response.body;
                    expect(response).to.have.status(200);
                    expect(body).to.have.property('oid');
                    expect(body).to.have.property('cid');
                    expect(body).to.have.property('model');
                    expect(body).to.have.property('ownername');
                    expect(body).to.have.property('oid').eq(taskId)
                    done();
                })
        })

        it("it should check oid which is not available in car owner mapping", (done) => {
            const taskId = 1111;
            chai.request(server)
                .get('/comDatabase/oid/' + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal('failed :( [check again your value]')
                    done();
                })
        })

        it("it should check string values in car owner mapping", (done) => {
            const taskId = "xyz";
            chai.request(server)
                .get('/comDatabase/oid/' + taskId)
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(404)
                    expect(text).to.equal(`Invalid Input ${taskId}`)
                    done();
                })
        })

        it("it should check string values in car owner mapping", (done) => {
            chai.request(server)
                .get('/comDatabase/oid/')
                .end((err, response) => {
                    const text = response.text;
                    expect(response).to.have.status(200)
                    done();
                })
        })
    })

});