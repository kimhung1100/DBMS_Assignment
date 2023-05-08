const couchbase = require("couchbase");

class Customer {
    constructor(bucket) {
      this.bucket = bucket;
    }
  
    async create(customer) {
      try {
        const result = await this.bucket.insert(customer.email, customer);
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  
    
    async read(email) {
        try {
          const query = couchbase.N1qlQuery.fromString(`SELECT * FROM Ecommerce.firstCompany.customers WHERE customer_id = '${email}'`);
          const result = await this.bucket.query(query);
          return result.rows[0];
        } catch (err) {
          console.error(`Error getting user with email ${email}: `, err);
          throw err;
        }
      }
      
    async update(email, updates) {
      try {
        const result = await this.bucket.mutateIn(email, couchbase.MutateInSpec.upsert("fname", updates.fname));
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  
    async delete(email) {
      try {
        const result = await this.bucket.remove(email);
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
  
  module.exports = Customer;



