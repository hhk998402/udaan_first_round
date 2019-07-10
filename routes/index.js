var express = require('express');
var router = express.Router();
var workerData = require('../models/workers.js');
var assetData = require('../models/assets.js');
var taskData = require('../models/tasks.js');
var workAllocation = require('../models/work-allocation.js');


////////////////// MIDDLEWARES ////////////////////////////

// Middleware to validate worker data
var validate_worker_data = (req,res,next)=>{
    if(!req.body || req.body === undefined){
        res.json({
            code:1,
            message:"Error, the worker details to be added are invalid"
        });
    }
    else{
        if(!req.body.name || req.body.name === undefined || !req.body.skillset || req.body.skillset === undefined){
            res.json({
                code:1,
                message:"Error, the worker details to be added are invalid"
            });
        }
        else{
            next();
        }
    }
};

// Middleware to validate task data
var validate_task_data = (req,res,next)=>{
    if(!req.body || req.body === undefined){
        res.json({
            code:1,
            message:"Error, the task details to be added are invalid"
        });
    }
    else{
        if(!req.body.name || req.body.name === undefined || !req.body.skillset || req.body.skillset === undefined){
            res.json({
                code:1,
                message:"Error, the task details to be added are invalid"
            });
        }
        else{
            next();
        }
    }
};

// Middleware to validate asset data
var validate_asset_data = (req,res,next)=>{
    if(!req.body || req.body === undefined){
        res.json({
            code:1,
            message:"Error, the asset details to be added are invalid"
        });
    }
    else{
        if(!req.body.name || req.body.name === undefined || !req.body.location || req.body.location === undefined){
            res.json({
                code:1,
                message:"Error, the asset details to be added are invalid"
            });
        }
        else{
            next();
        }
    }
};

// Middleware to validate work allocation
var validate_work_allocation = (req,res,next)=>{
    if(!req.body || req.body === undefined){
        res.json({
            code:1,
            message:"Error, the work allocation details to be added are invalid"
        });
    }
    else{
        if(!req.body.assetID || req.body.assetID === undefined || !req.body.taskID || req.body.taskID === undefined || !req.body.workerID || req.body.workerID === undefined || !req.body.timeOfAllocation || req.body.timeOfAllocation === undefined || !req.body.taskToBePerformedBy || req.body.taskToBePerformedBy === undefined){
            res.send({
                code:1,
                message:"Error, the work allocation details to be added are invalid"
            });
        }
        else{
            assetData.find({_id:req.body.assetID}).exec((err, assets) => {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 1,
                        message: 'Error, invalid asset ID has been sent, please check request parameters'
                    });
                }
                else if(assets.length === 0){
                    res.send({
                        code: 1,
                        message: 'Error, asset ID does not exist in the DB, please check request parameters'
                    });
                }
                else{
                    taskData.find({_id:req.body.taskID}).exec((err, tasks) => {
                        if (err) {
                            console.log(err);
                            res.send({
                                code: 1,
                                message: 'Error, invalid task ID has been sent, please check request parameters'
                            });
                        }
                        else if (tasks.length === 0) {
                            res.send({
                                code: 1,
                                message: 'Error, task ID does not exist in the DB, please check request parameters'
                            });
                        }
                        else {
                            workerData.find({_id:req.body.workerID}).exec((err, workers) => {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        code: 1,
                                        message: 'Error, invalid worker ID has been sent, please check request parameters'
                                    });
                                }
                                else if (workers.length === 0) {
                                    res.send({
                                        code: 1,
                                        message: 'Error, worker ID does not exist in the DB, please check request parameters'
                                    });
                                }
                                else {
                                    next();
                                }
                            });
                        }
                    });
                }
            });
            next();
        }
    }
};

////////////////// GET REQUESTS ////////////////////////////

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all workers page. */
router.get('/get-worker', function(req, res, next) {
    workerData.find({}).exec((err, workers) => {
        if (err) {
            console.log(err);
            res.send({
                code: 1,
                message: 'Error, invalid worker ID has been sent, please check request parameters'
            });
        }
        else {
            res.render('allWorkers.ejs',{
                code: 0,
                data: workers
            });
        }
    });
});

/* GET worker's tasks page. */
router.get('/get-worker/:workerID', function(req, res, next) {
    workAllocation.find({workerID:req.params.workerID}).exec((err, workers) => {
        if (err) {
            console.log(err);
            res.send({
                code: 1,
                message: 'Error, invalid worker ID has been sent, please check request parameters'
            });
        }
        else {
            res.render('tasksWorker.ejs',{
                code: 0,
                data: workers
            });
        }
    });
});

/* GET all assets page. */
router.get('/assets/all', function(req, res, next) {
    assetData.find({}).exec((err, assets) => {
        if (err) {
            console.log(err);
            res.send({
                code: 1,
                message: 'DB Error, please try again'
            });
        }
        else {
            res.render('allAssets.ejs',{
                code: 0,
                data: assets
            });
        }
    });
});

////////////////// POST REQUESTS ////////////////////////////

/* POST add worker */
router.post('/add-worker', validate_worker_data, function(req, res, next) {

    let data = new workerData(req.body);

    data.save(function(err,done){
        if(err){
            throw err;
        }else{
            //To handle error when rString generated exists in the DB
            if (err && err.code === 11000) {
                res.send({code: 1, message: 'Duplicate Entry'});
            }
            else if (err && err.code !== 66) {
                res.send({code: 1, message: 'Error, please check internet connection and try again'});
            }else{
                res.send({code: 0, message: 'Successfully added worker'});
            }
        }
    });
});

/* POST add task */
router.post('/add-task', validate_task_data, function(req, res, next) {

    let data = new taskData(req.body);

    data.save(function(err,done){
        if(err){
            throw err;
        }else{
            //To handle error when rString generated exists in the DB
            if (err && err.code === 11000) {
                res.send({code: 1, message: 'Duplicate Entry'});
            }
            else if (err && err.code !== 66) {
                res.send({code: 1, message: 'Error, please check internet connection and try again'});
            }else{
                res.send({code: 0, message: 'Successfully added task'});
            }
        }
    });
});

/* POST add asset */
router.post('/add-asset', validate_asset_data, function(req, res, next) {

    let data = new assetData(req.body);

    data.save(function(err,done){
        if(err){
            throw err;
        }else{
            //To handle error when rString generated exists in the DB
            if (err && err.code === 11000) {
                res.send({code: 1, message: 'Duplicate Entry'});
            }
            else if (err && err.code !== 66) {
                res.send({code: 1, message: 'Error, please check internet connection and try again'});
            }else{
                res.send({code: 0, message: 'Successfully added asset'});
            }
        }
    });
});

/* POST add work allocation */
router.post('/allocate-task', validate_work_allocation, function(req, res, next) {

    let data = new workAllocation(req.body);

    data.save(function(err,done){
        if(err){
            throw err;
        }else{
            //To handle error when rString generated exists in the DB
            if (err && err.code === 11000) {
                res.send({code: 1, message: 'Duplicate Entry'});
            }
            else if (err && err.code !== 66) {
                res.send({code: 1, message: 'Error, please check internet connection and try again'});
            }else{
                res.send({code: 0, message: 'Successfully added work allocation'});
            }
        }
    });
});


module.exports = router;
