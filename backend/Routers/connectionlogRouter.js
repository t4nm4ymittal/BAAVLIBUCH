const express  = require('express')
const connectionlogRouter = express.Router()


const {logconnection} = require('../controller/connectionlogController')


connectionlogRouter.use(logconnection)

module.exports = connectionlogRouter


