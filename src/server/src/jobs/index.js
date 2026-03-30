const cron = require('node-cron');

const autoCancelUnpaid = require('./autoCancelUnpaid');
const autoInProgress   = require('./autoInProgress');
const autoComplete     = require('./autoComplete');
const driverReminder   = require('./driverReminder');

const jobs = [autoCancelUnpaid, autoInProgress, autoComplete, driverReminder];

function startJobs() {
  jobs.forEach((job) => {
    cron.schedule(job.schedule, job.run.bind(job));
    console.log(`[Jobs] Registered: ${job.name} (${job.schedule})`);
  });
}

module.exports = startJobs;
