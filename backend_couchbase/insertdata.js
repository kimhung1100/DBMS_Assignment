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

async function insertDataCustomers(numCustomers) {
  // Connect to the cluster and open the bucket couchbase://localhost
  const cluster = await couchbase.connect(clusterConnStr, {
    username,
    password,
  });

  const bucket = cluster.bucket(bucketName);

  // Insert random customer data
  for (let i = 0; i < numCustomers; i++) {
    console.log(`Inserting customer ${i + 1} of ${numCustomers}`);
    const customer = generateRandomCustomer();
    const key = `customer-${i}`;
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
 
function generateRandomInventory(id) {
  const itemNames = [    "Laptop",    "Smartphone",    "Smartwatch",    "Wireless Headphones",    "Bluetooth Speaker",    "Gaming Mouse",    "Gaming Keyboard",    "Gaming Headset",    "External Hard Drive",    "SSD",    "USB Flash Drive",    "MicroSD Card"  ];
  const nameOptions = ["Galaxy", "iPhone", "Pixel", "ThinkPad", "MacBook", "Surface", "iPad", "iMac", "Mac Pro", "Mac Mini", "XPS", "Inspiron", "Alienware", "Razer"]
  const brandOptions = ["Samsung", "Apple", "Google", "Lenovo", "Microsoft", "Dell", "Razer"];
  const codeItems = ["ZA", "JPL", "A", "Y", "X"];
  const codeOptions = ["-01", "-02", "-03", "-04", "-05", "-06", "-07", "-08", "-09", "-10", "-11", "-12", "-13", "-14", "-15", "-16", "-17", "-18", "-19", "-20"];

  const departmentNames = [    "Electronics",    "Computers",    "Accessories",    "Peripherals",    "Storage Devices"  ];
  

  const sizeOptions = ["S", "M", "L"];
  const colorOptions = ["Red", "Green", "Blue", "Black", "White", "Silver"];
  const featureOptions = ["Lightweight", "Water-resistant", "Noise-cancelling", "Wireless"];
  const imageOptions = [    "https://picsum.photos/200",    "https://picsum.photos/200",    "https://picsum.photos/200",    "https://picsum.photos/200"  ];

  const randomItemId = Math.floor(Math.random() * 100000);
  const randomItemName = `${nameOptions[Math.floor(Math.random() * nameOptions.length)]} ${brandOptions[Math.floor(Math.random() * brandOptions.length)]} ${itemNames[Math.floor(Math.random() * itemNames.length)]} ${codeItems[Math.floor(Math.random() * codeItems.length)]}${codeOptions[Math.floor(Math.random() * codeOptions.length)]}`;
  const randomDepartment = departmentNames[Math.floor(Math.random() * departmentNames.length)];

  const skus = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    // const randomSkuId = Math.floor(Math.random() * 100000);
    // const randomPriceBase = parseFloat((Math.random() * (100 - 10) + 10).toFixed(2));
    const randomPriceBase = parseFloat((Math.random() * (1500 - 300) + 500).toFixed(2));

    const randomPriceDiscount = parseFloat((Math.random() * 10).toFixed(2));
    const randomQuantity = Math.floor(Math.random() * (50 - 10) + 10);

    // const skuNum = 1 + skus.length;
    return {
      sku: `inventory-${id}-sku-`,
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
  for (let i = 0; i < skus.length; i++) {
    skus[i].sku = skus[i].sku + i;
  }

  const inventory = {
    id: `inventory-${randomItemId}`,
    item: randomItemName,
    features: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => generateLoremIpsum()),
    categories: [randomDepartment],
    skus
  };

  return inventory;
}

 
async function insertDataInventories(numofInventory) {
  // Connect to the cluster and open the bucket couchbase://localhost
  const cluster = await couchbase.connect(clusterConnStr, {
    username,
    password,
  });

  const bucket = cluster.bucket(bucketName);
  const collection = bucket.defaultCollection();
  for (let i = 0; i < numofInventory; i++) {
    const inventory = generateRandomInventory(i);
    const key = 'inventory-' + i;
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
function generateRandomOrder(i) {
  // Generate random inventory order
  // id: objectID, customer_id: string, payment_id: ObjectId, paymentStatus: string, status: string, 
  // items[] : {sku}
  // shipping: {Adress: {street1: string, street2: string, city: string, state: string, country: string, zip: string}, 
  //            Origin: {street1: string, street2: string, city: string, state: string, country: string, zip: string},
  //           carrier: string, tracking: string}

  // sku generated from inventory
  // const sku = 'sku-'
  // customer_id generated from customer
  // const customer_id = ["hung@gmail.com","jane.doe41@example.com","jane.johnson55@example.com","jane.smith31@example.com","jane.smith39@example.com","jane.smith68@example.com","jane.smith79@example.com","joe.doe38@example.com","joe.doe70@example.com","joe.doe83@example.com","joe.doe97@example.com","joe.johnson3@example.com","joe.johnson69@example.com","joe.johnson75@example.com","joe.johnson82@example.com","joe.smith45@example.com","john.doe43@example.com","john.doe96@example.com","john.johnson13@example.com","john.smith15@example.com","john.smith86@example.com"]
  shippingOrigin = {
    street1: "1234 Main St",
    street2: "Apt 1",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    zip: "94110"
  }
  const randomNum = Math.floor(Math.random() * 100000);
  const randomCustomerID = `customer-${randomNum}`;
  const randomOrderID = Math.floor(Math.random() * 100000);
  const randomPaymentID = randomOrderID + '|' + randomCustomerID;
  const randomPaymentStatus = Math.random() < 0.5 ? 'paid' : 'unpaid';
  const randomStatus = Math.random() < 0.5 ? 'shipped' : 'unshipped';
  const randomItems = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => {
    const randomSkuI = Math.floor(Math.random() * 1000);
    const randomSku = `inventory-${randomSkuI}-sku-0`;
    return { sku: randomSku };
  });
  const randomShipping = {
    Adress: {
      street1: "1234 Main St",
      street2: "Apt 1",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zip: "94110"
    },
    Origin: {
      street1: "1234 Main St",
      street2: "Apt 1",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zip: "94110"
    },
    carrier: "UPS",
    tracking: "123456789"
  }
  const order = {
    id: `order-${i}`,
    customer_id: randomCustomerID,
    payment_id: randomPaymentID,
    paymentStatus: randomPaymentStatus,
    status: randomStatus,
    items: randomItems,
    shipping: randomShipping
  };
   
  return order;
}
async function insertDataOrders(numofOders) {
  // Connect to the cluster and open the bucket couchbase://localhost
  const cluster = await couchbase.connect(clusterConnStr, {
    username,
    password,
  });
  const bucket = cluster.bucket(bucketName);
  const collection = bucket.defaultCollection();
  for (let i = 142000; i < numofOders; i++) {
    const order = generateRandomOrder(i);
    const key = 'order-' + i;
    const value = order;
    const query = `INSERT INTO \`Ecommerce\`.firstCompany.orders (KEY, VALUE) VALUES ("${key}", ${JSON.stringify(value)}) RETURNING *`;
    cluster.query(query, (err, rows) => {
      if (err) {
        console.error(`Error inserting order with id ${key}: ${err.message}`);
      } else {
        console.log(`Inserted order with id ${key}`);
      }
    });
  }

  cluster.close();
  console.log('Disconnected from cluster');

}

async function main() {
    
      // await insertDataCustomers(100000)
      // await insertDataInventories(1000)
      await insertDataOrders(200000)
}




main()