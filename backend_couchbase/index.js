const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
// const { Bucket } = require("couchbase");
const couchbase = require('couchbase')


// dbConnect();




// database connection

// Connect to the cluster and open the bucket couchbase://localhost
const clusterConnStr = 'couchbase://localhost'
const username = 'Administrator'
const password = '123456'
const bucketName = 'Ecommerce'

async function main() {
  var cluster = await couchbase.connect(
    clusterConnStr, 
    {
    username: username,
    password: password,
  })
  console.log("Database Connected Successfully");
  
  var bucket = cluster.bucket(bucketName)

  app.use(morgan("dev"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get('/FeaturedCollection', runAsync(async (req, res) => {

    // options = { parameters: { AIRPORT: searchTerm.toLowerCase() } }
    let qs = `SELECT * from \`${bucketName}\`.firstCompany.inventory limit 8;`
    const result = await cluster.query(qs)
    const data = result.rows
    const context = ['FeaturedCollection', data]
    return res.send(data)
  }))


  app.post('/api/login', runAsync (async (req, res) => {
    const { email, password } = req.body;
    let qs = `SELECT * from \`${bucketName}\`.firstCompany.customers where email = '${email}';`
    const result = await cluster.query(qs)
    if (result.rows.length === 0) {
      return res.status(205).send("Email not registered");
    }
    else if (result.rows.length === 1) {
      const user = result.rows[0]
      if (password === user.customers.hashedAndSaltedPassword) {
        // Create token
        // const token = jwt.sign(
        //   { user_id: email },
        //   process.env.JWT_KEY
        // );
        // save user token
        // user.token = token;
        return res.status(200).send(user);
      } else{
        return res.status(205).send("Invalid password");
      }
      

        

    }
  }));



  app.listen(PORT, () => {
    console.log(`Connecting to backend Couchbase server`)
    console.log(`Server is running  at PORT ${PORT}`);
  });
}

function runAsync (callback) {
    return function (req, res, next) {
      callback(req, res, next)
        .catch(next)
    }
  }
  
main()