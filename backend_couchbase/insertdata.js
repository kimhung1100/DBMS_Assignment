const couchbase = require('couchbase')
const express = require('express');
const faker = require('@faker-js/faker');
const uuid = require('uuid');

const clusterConnStr = 'couchbase://localhost'
const username = 'Administrator'
const password = '123456'
const bucketName = 'Ecommerce'
const PORT = 5001
// const item = faker.commerce.product();
// console.log(item);
// import {insertDataInventory} from './insertdatainventory.js'
function generateLoremIpsum() {
  const words = [
    "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
    "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
    "commodo", "consequat", "Duis", "aute", "irure", "dolor", "in", "reprehenderit", 
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
    "pariatur", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", 
    "est", "laborum"
  ];

  const loremIpsum = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, () => words[Math.floor(Math.random() * words.length)]).join(' ');

  return loremIpsum;
}
function generateRandomCustomer() {
  const firstName = ['John', 'Jane', 'Joe'][Math.floor(Math.random() * 3)];
  const lastName = ['Doe', 'Smith', 'Johnson'][Math.floor(Math.random() * 3)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
  const password = Math.random().toString(36).substring(2, 10); // Generate random password
  const country = ['USA', 'Canada', 'Mexico'][Math.floor(Math.random() * 3)];
  const city = ['New York', 'Los Angeles', 'Toronto', 'Mexico City'][Math.floor(Math.random() * 4)];
  const state = ['NY', 'CA', 'ON', 'DF'][Math.floor(Math.random() * 4)];
  const zip = Math.floor(Math.random() * 90000) + 10000;
  const address = {
    street1: `${Math.floor(Math.random() * 10000)} Main St`,
    street2: `Apt ${Math.floor(Math.random() * 100)}`,
    city,
    state,
    zip,
    country,
  };
  const shippingAddress = {
    street1: `${Math.floor(Math.random() * 10000)} Main St`,
    street2: `Apt ${Math.floor(Math.random() * 100)}`,
    city,
    state,
    zip,
    country,
  };
  return {
    email,
    fname: firstName,
    lname: lastName,
    hashedAndSaltedPassword: password,
    emailVerified: Math.random() < 0.8, // 80% chance of being true
    address,
    shippingAddress,
  };
}

async function insertDataCustomer() {
  // Connect to the cluster and open the bucket couchbase://localhost
  const cluster = await couchbase.connect(clusterConnStr, {
    username,
    password,
  });

  const bucket = cluster.bucket(bucketName);

  // Insert random customer data
  const numCustomers = 10;
  for (let i = 0; i < numCustomers; i++) {
    console.log(`Inserting customer ${i + 1} of ${numCustomers}`);
    const customer = generateRandomCustomer();
    const key = customer.email;
    const value = customer;
    const query = `INSERT INTO \`Ecommerce\`.firstCompany.customers (KEY, VALUE) VALUES ("${key}", ${JSON.stringify(value)}) RETURNING *`;
    cluster.query(query, (err, rows) => {
      if (err) {
        console.error(`Error inserting customer with email ${key}: ${err.message}`);
      } else {
        console.log(`Inserted customer with email ${key}`);
      }
    });
  }
  cluster.close();
  console.log('Disconnected from cluster');
}
  // Generate random inventory data
  // id: objectID, item: string, features[]: string, categories[]: string, 
  // skus[]: {sku: string, price{base: decimal , discount: decimal}, quantity: decimal, options[]: size[]: string, features[]: string, color[]: string, images[]: string]]}
 
function generateRandomInventory() {
  const itemNames = [    "Laptop",    "Smartphone",    "Smartwatch",    "Wireless Headphones",    "Bluetooth Speaker",    "Gaming Mouse",    "Gaming Keyboard",    "Gaming Headset",    "External Hard Drive",    "SSD",    "USB Flash Drive",    "MicroSD Card"  ];

  const departmentNames = [    "Electronics",    "Computers",    "Accessories",    "Peripherals",    "Storage Devices"  ];

  const sizeOptions = ["S", "M", "L"];
  const colorOptions = ["Red", "Green", "Blue", "Black", "White", "Silver"];
  const featureOptions = ["Lightweight", "Water-resistant", "Noise-cancelling", "Wireless"];
  const imageOptions = [    "https://picsum.photos/200",    "https://picsum.photos/200",    "https://picsum.photos/200",    "https://picsum.photos/200"  ];

  const randomItemId = Math.floor(Math.random() * 100000);
  const randomItemName = itemNames[Math.floor(Math.random() * itemNames.length)];
  const randomDepartment = departmentNames[Math.floor(Math.random() * departmentNames.length)];

  const skus = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    const randomSkuId = Math.floor(Math.random() * 100000);
    const randomPriceBase = parseFloat((Math.random() * (100 - 10) + 10).toFixed(2));
    const randomPriceDiscount = parseFloat((Math.random() * 10).toFixed(2));
    const randomQuantity = Math.floor(Math.random() * (50 - 10) + 10);

    return {
      sku: `sku-${randomSkuId}`,
      price: {
        base: randomPriceBase,
        discount: randomPriceDiscount
      },
      quantity: randomQuantity,
      options: {
        size: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => sizeOptions[Math.floor(Math.random() * sizeOptions.length)]),
        features: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => featureOptions[Math.floor(Math.random() * featureOptions.length)]),
        color: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => colorOptions[Math.floor(Math.random() * colorOptions.length)]),
        images: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => imageOptions[Math.floor(Math.random() * imageOptions.length)])
      }
    };
  });

  const inventory = {
    id: `inventory-${randomItemId}`,
    item: randomItemName,
    features: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => generateLoremIpsum()),
    categories: [randomDepartment],
    skus
  };

  return inventory;
}

 
async function insertDataInventory() {
  // Connect to the cluster and open the bucket couchbase://localhost
  const cluster = await couchbase.connect(clusterConnStr, {
    username,
    password,
  });

  const bucket = cluster.bucket(bucketName);
  const collection = bucket.defaultCollection();
  const numofInventory = 10;
  for (let i = 0; i < numofInventory; i++) {
    const inventory = generateRandomInventory();
    const key = inventory.id;
    const value = inventory;
    const query = `INSERT INTO \`Ecommerce\`.firstCompany.inventory (KEY, VALUE) VALUES ("${key}", ${JSON.stringify(value)}) RETURNING *`;
    cluster.query(query, (err, rows) => {
      if (err) {
        console.error(`Error inserting inventory with id ${key}: ${err.message}`);
      } else {
        console.log(`Inserted inventory with id ${key}`);
      }
    });
  }

  cluster.close();
  console.log('Disconnected from cluster');
}
function generateRandomOrder() {
  // Generate random inventory order
  // id: objectID, customer_id: string, payment_id: ObjectId, paymentStatus: string, status: string, 
  // items[] : {sku: ObjectId, quantity: decimal, price: decimal, discount: decimal, preTaxTotal: decimal, tax: decimal, total: decimal}
  // shipping: {Adress: {street1: string, street2: string, city: string, state: string, country: string, zip: string}, 
  //            Origin: {street1: string, street2: string, city: string, state: string, country: string, zip: string},
  //           carrier: string, tracking: string}
  

  return oder;
}

async function main() {
    
      // insertDataCustomer()
      await insertDataInventory()
      // await insertDataOrders()
}




main()