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
const dbConnect = require('./config/dbConnect')

// dbConnect();

console.log(dbConnect);


// database connection

// Connect to the cluster and open the bucket couchbase://localhost

// dbConnect
async function main() {
  var cluster = await couchbase.connect(
    dbConnect.clusterConnStr, 
    {
    username: dbConnect.username,
    password: dbConnect.password,
  })
  console.log("Database Connected Successfully");
  bucketName = dbConnect.bucketName
  
  app.use(morgan("dev"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get('/FeaturedCollection', runAsync(async (req, res) => {
    // options = { parameters: { AIRPORT: searchTerm.toLowerCase() } }
    // let qs = `SELECT * from \`${bucketName}\`.firstCompany.inventory limit 8;`
    let qs = `SELECT *
    FROM (
        SELECT SUBSTR(items.sku, 0, LENGTH(items.sku) - LENGTH("-sku-0")) AS sku,
               COUNT(*) AS count
        FROM \`Ecommerce\`.firstCompany.orders 
        UNNEST items
        GROUP BY SUBSTR(items.sku, 0, LENGTH(items.sku) - LENGTH("-sku-0"))
        ORDER BY count DESC
        LIMIT 8 ) AS top_skus
        JOIN \`Ecommerce\`.firstCompany.inventory AS inventory ON top_skus.sku = inventory.id;`
    const result = await cluster.query(qs)
    const data = result.rows
    const context = ['FeaturedCollection', data]
    return res.send(data)
  }))

  app.get('/ourProduct', runAsync(async (req, res) => {
    // options = { parameters: { AIRPORT: searchTerm.toLowerCase() } }
    // let qs = `SELECT * from \`${bucketName}\`.firstCompany.inventory limit 8;`
    try {
      // Get the search query parameter from the request
      const productName = req.query.search;
      const categoryName = req.query.category;
      if (productName === undefined && categoryName === undefined) {
        return res.status(400).send("Bad Request");
      }
      let qs = '';
      if (categoryName === ''){
        qs = `SELECT i.item,
        MIN(sku.price.base) AS min_price,
        ARRAY_FLATTEN(ARRAY_AGG(DISTINCT sku.\`options\`.images), 1) AS images,
        i.id
        FROM \`Ecommerce\`.firstCompany.inventory AS i
        UNNEST i.skus AS sku
        WHERE i.item LIKE '%${productName}%'
            AND sku.price.base IS NOT NULL
        GROUP BY i.item, i.id
        ORDER BY min_price
        LIMIT 20`;
      } else {
        qs = `SELECT i.item,
        MIN(sku.price.base) AS min_price,
        ARRAY_FLATTEN(ARRAY_AGG(DISTINCT sku.\`options\`.images), 1) AS images,
        i.id
        FROM \`Ecommerce\`.firstCompany.inventory AS i
        UNNEST i.skus AS sku
        WHERE ANY category IN i.categories SATISFIES category = '${categoryName}' END
          AND i.item LIKE '%${productName}%'
          AND sku.price.base IS NOT NULL
        GROUP BY i.item, i.id
        ORDER BY min_price
        LIMIT 20`;
      }

      

      // Execute the N1QL query and get the result
      const result = await cluster.query(qs);
      const data = result.rows;

      // Send the data as the response
      res.send(data);
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  }));

  app.get('/product/:id', runAsync(async (req, res) => {
    const productId = req.params.id;

    const qs = `SELECT * FROM \`${bucketName}\`.firstCompany.inventory WHERE id = '${productId}'`;
    const result = await cluster.query(qs);
    const data = result.rows;
    if (!data || data.length === 0) {
      return res.status(404).send({ error: 'Product not found' });
    }
  
    return res.send(data[0]);
  }));
  

  app.post('/login', runAsync (async (req, res) => {
    const { email, password } = req.body;
    let qs = `SELECT * from \`${bucketName}\`.firstCompany.customers where email = '${email}';`
    const result = await cluster.query(qs)
    // console.log(result)

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