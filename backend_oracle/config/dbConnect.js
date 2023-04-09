const couchbase = require('couchbase')

const dbConnect = () => {
  const clusterConnStr = 'couchbase://localhost'
  const username = 'Administrator'
  const password = '123456'
  const bucketName = 'travel-sample'
  try {
    const cluster = couchbase.connect(clusterConnStr, {
      username: username,
      password: password,
    })
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};
module.exports = dbConnect;
