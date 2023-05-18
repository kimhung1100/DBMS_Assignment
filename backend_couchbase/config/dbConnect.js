const couchbase = require('couchbase')

var dbConnect = {
  clusterConnStr: 'couchbase://localhost',
  username: 'Administrator',
  password: '123456',
  bucketName: 'Ecommerce'
  // try {
  //   const cluster = couchbase.connect(clusterConnStr, {
  //     username: username,
  //     password: password,
  //   })
  //   console.log("Database Connected Successfully");
  // } catch (error) {
  //   console.log("Database error");
  // }
};
module.exports = dbConnect;
