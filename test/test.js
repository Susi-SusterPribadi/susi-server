require('dotenv').config()
const chai = require('chai')
    , chaiHttp = require('chai-http')

    
chai.use(chaiHttp)
chai.should()

//models
const Users = require('../models/users')

// mongoose
const mongoose = require('mongoose')

const server = 'http://localhost:3030'

mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
    , { useNewUrlParser: true } 
    , function(err){
        if(err) console.log(err);
        console.log("connect with  susidb on test mode")
})
mongoose.set('useCreateIndex', true)

describe('Users', function () {
      
    after( function (done) {
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
        , { useNewUrlParser: true } 
        , function(err){
        if(err) console.log(err);
            Users.collection.drop()
            done()
        })
        // mongoose.set('useCreateIndex', true)
    })

    it('Post /users should return a single user who was added', function (done) {
         chai.request(server)
                .post('/users')
                .send({
                    name : 'amsal',
                    birthdate: new Date(),
                    email : 'adrowicaksono@gmail.com',
                    password : 'abc123'
                })
                .end( function (err, res) {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('object')
                    res.body.user.should.have.property('name')
                    res.body.user.should.have.property('email')
                    res.body.user.should.have.property('password')
                    res.body.user.name.should.equal('amsal')
                    res.body.user.email.should.equal('adrowicaksono@gmail.com')
                    done()
                })
    })

    it('Post /users should return error', function (done) {
        chai.request(server)
        .post('/users')
        .send({
            name : 'amsal',
            email : 'amsal',
            password : 'abc123'
        })
        .end( function (err, res) {
           res.should.have.status(400)

            done()
        })

    })
    
    it('Get /users should return array of user',  function (done) {
        chai.request(server)
        .get('/users')
        .end(function (err, res) {
            if(err) console.log('get :',err)
            res.should.have.status(200)
            res.should.be.json
            res.should.be.a('object')
            done()
        })
    })
})

describe('Auth' , function () {
    beforeEach( function (done) {
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
        , { useNewUrlParser: true } 
        , function(err){
            if(err) console.log(err);
            console.log("connect with mongoose test")
            
            Users
                .create({
                    name : 'burhan',
                    birthdate: new Date(),
                    email : 'burhan@gmail.com',
                    password : 'abc123'
                })
                .then( function (res) {
                    console.log("success create from mocha")
                    done()
                })
                .catch(function (err) {
                    console.log(err)
                    done()
                })
            
        })
    })
    
    afterEach( function(done){
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
            , { useNewUrlParser: true } 
            , function(err){
                if(err) console.log(err);
                Users.collection.drop()
                done()
        })
        // mongoose.set('useCreateIndex', true)
        
    })

    it('Post /auth should have email unregistered', function (done) {
        chai
        .request(server)
        .post('/auth')
        .send({
            email : 'abdul@mail.com',
            password : 'abc123',
        })
        .end( function (err, res){
            res.should.have.status(400)
            res.body.msg.should.equal('email unregister')
            done()
        })
    })

    it('Post /auth should have wrong password', function (done){
        chai
        .request(server)
        .post('/auth')
        .send({
            email : 'burhan@gmail.com',
            password :'abc124',
        })
        .end( function(err, res){
            console.log(res.body)
            res.should.have.status(401)
            done()
        })
    })

    it('Post /auth should get authorization for credential', function (done) {
        chai
        .request(server)
        .post('/auth')
        .send({
            email : 'burhan@gmail.com',
            password : 'abc123'
        })
        .end( function (err, res){
            console.log(res.body)
            res.should.have.status(200)
            // res.body.should.have.property('authorization')
            done()
        })
    })
})



describe('Prescription' , function () {
    beforeEach( function (done) {
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
        , { useNewUrlParser: true } 
        , function(err){
            if(err) console.log(err);
            console.log("connect with mongoose test")
            Users
                .create({
                    name : 'susi',
                    birthdate: new Date(),
                    email : 'susi@mail.com',
                    password : 'abc123'
                })
                .then( res => {
                    console.log("success create from mocha")
                    done()
                })
                .catch( err => {
                    console.log(err)
                    done()
                })
            
        })
    })

    afterEach( function(done){
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
            , { useNewUrlParser: true } 
            , function(err){
                if(err) console.log(err);
                Users.collection.drop()
                done()
        })
        // mongoose.set('useCreateIndex', true
    })

    it('Get /prescription should get prescritions of single user who have credential', done => {
        let user = {
            email: 'susi@mail.com',
            password: 'abc123'
        }
         
        chai.request(server).post('/auth').send(user)
        .end( (err, res) => {
            if( err ) console.log(err)
            let authorization = res.body.authorization
            let prescription = {
                label: 'paracetamol',
                route: 'oral',
                expDate: new Date(),
                stock: 3
            }
            chai.request(server).get('/prescription').set('authorization', authorization)
            .send(prescription)
            .end( (err, res) => {
                if (err) console.log(err)
                console.log(res.body)
                done()
            })
        })
        // console.log(authorization)
    })
})


describe('Config' , function () {
    beforeEach( function (done) {
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
        , { useNewUrlParser: true } 
        , function(err){
            if(err) console.log(err);
            console.log("connect with mongoose test")
            Users
                .create({
                    name : 'susi',
                    birthdate: new Date(),
                    email : 'susi@mail.com',
                    password : 'abc123'
                })
                .then( res => {
                    console.log("success create from mocha")
                    done()
                })
                .catch( err => {
                    console.log(err)
                    done()
                })
            
        })
    })

    afterEach( function(done){
        mongoose.connect(`mongodb://${process.env.dbTestAdm}:${process.env.dbTestAdm}@ds259912.mlab.com:59912/susidbtest`
            , { useNewUrlParser: true } 
            , function(err){
                if(err) console.log(err);
                Users.collection.drop()
                done()
        })
        // mongoose.set('useCreateIndex', true
    })

    it('Get /config should get a config of single user who have credential', done => {
        let user = {
            email: 'susi@mail.com',
            password: 'abc123'
        }
         
        chai.request(server).post('/auth').send(user)
        .end( (err, res) => {
            if( err ) console.log(err)
            let authorization = res.body.authorization
            console.log('authorization', authorization)
            let config = {
                morning: 6,
                afternoon: 12,
                night: 18,
                customize: 2
            }
            chai.request(server).get('/config').set('authorization', authorization)
            .send(config)
            .end( (err, res) => {
                if (err) console.log(err)
                console.log(res.body)
                done()
            })
        })
        // console.log(authorization)        
    })

})

describe('Schedule', () => {
    it('get connection', done => {
        chai.request(server).get('/schedule')
        .end( (err, res) => {
            if (err) console.log(err)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('object')
            res.body.should.have.property('prescription')
            res.body.prescription.should.have.property('label')
            res.body.prescription.should.have.property('route')
            res.body.prescription.should.have.property('expDate')
            res.body.prescription.should.have.property('stock')
            res.body.prescription.should.have.property('schedule')
            res.body.prescription.schedule.should.be.a('array')
            
            // res.body.prescription.should.have.property('password')
            // res.body.prescription.name.should.equal('amsal')
            
            done()
        })
    })
})







