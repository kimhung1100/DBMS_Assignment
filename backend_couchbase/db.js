const couchbase = require("couchbase");
const config = require("config/dbConnect.js");

const cluster = new couchbase.Cluster(config.HOST, {
  username: config.USERNAME,
  password: config.PASSWORD
});

const bucket = cluster.bucket(config.BUCKET_NAME);

module.exports = bucket;