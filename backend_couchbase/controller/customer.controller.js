const couchbase = require('couchbase');
const dbConnect = require('../config/dbConnect.js');
const cluster = dbConnect.cluster;
const bucket = dbConnect.bucket;
const collection = bucket.scope('firstCompany').collection('customers');

// Function to handle customer login
exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      // Check if customer with the given email exists
      const customer = await new Customer(bucket).read(email);
      if (!customer) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
  
      // Check if the password is correct
      if (customer.hashedAndSaltedPassword !== password) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
  
      // Send success response
      res.status(200).send({ message: "Login successful" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    }
  };
