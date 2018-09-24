var kue = require('kue')
  , queue = kue.createQueue();

const scheduleCreate = (data) => {
    var job = queue.create('schedule', data).save( function(err){
        if( !err ) console.log( job.id, "; was created" );
    });

    job.on('complete', function(result){
    console.log('Job completed with data ', result);

    }).on('failed attempt', function(errorMessage, doneAttempts){
    console.log('Job failed ', errorMessage, doneAttempts);

    }).on('failed', function(errorMessage){
    console.log('Job failed', errorMessage );

    }).on('progress', function(progress, data){
    console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

    });
} 

module.exports = {
    scheduleCreate
}