const bodyParser = require("body-parser");
const express = require("express");
// const dbConnect = require("./config/dbConnect");
// const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
// const authRouter = require("./routes/authRoute");
// const productRouter = require("./routes/productRoute");
// // const blogRouter = require("./routes/blogRoute");
// const categoryRouter = require("./routes/prodcategoryRoute");
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
// const couponRouter = require("./routes/couponRoute");
// const uploadRouter = require("./routes/uploadRoute");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
// const { Bucket } = require("couchbase");
const couchbase = require('couchbase')


// dbConnect();

// app.use("/api/user", authRouter);
// app.use("/api/product", productRouter);
// app.use("/api/blog", blogRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
// app.use("/api/brand", brandRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/color", colorRouter);
// app.use("/api/enquiry", enqRouter);
// app.use("/api/upload", uploadRouter);

// app.use(notFound);
// app.use(errorHandler);
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
    // where = 'country="United States"' // hardcode for now
    // let qs = `SELECT airportname from \`travel-sample\`.inventory.airport WHERE ${ where } limit 8;`
    // const result = await cluster.query(qs)
    // const data = result.rows
    // const context = ['FeaturedCollection', data]
    // return res.send(data)
  }))

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