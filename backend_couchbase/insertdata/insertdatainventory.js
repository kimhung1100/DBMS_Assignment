import couchbase from 'couchbase';
import uuid from 'uuid';
import faker from 'faker';

const clusterConnStr = 'couchbase://localhost';
const username = 'Administrator';
const password = '123456';
const bucketName = 'Ecommerce';

function generateRandomInventory() {
    // Generate random inventory data
    // id: objectID, item: string, features[]: string, categories[]: string, skus[]: objectId
    const categories = ['laptops', 'smartphones', 'tablets'];
    const features = ['wireless charging', 'water-resistant', 'high resolution screen'];
    const skus = [1, 2, 3, 4, 5];
  
    const inventory = {
      id: uuid.v4(),
      item: faker.commerce.productName(),
      categories: [categories[Math.floor(Math.random() * categories.length)]],
      features: [features[Math.floor(Math.random() * features.length)]],
      skus: [skus[Math.floor(Math.random() * skus.length)]],
    };
  
    return inventory;
  }
  
  export async function insertDataInventory() {
    // Connect to the cluster and open the bucket couchbase://localhost
    const cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
    });
  
    const bucket = cluster.bucket(bucketName);
    const collection = bucket.defaultCollection();
  
    for (let i = 0; i < 1000; i++) {
      const inventory = generateRandomInventory();
      await collection.insert(`inventory::${inventory.id}`, inventory);
      console.log(`Inserted inventory item ${i}`);
    }
  
    cluster.close();
    console.log('Disconnected from cluster');
  }