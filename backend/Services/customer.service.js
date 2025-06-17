const { query, getConnection } = require('../config/db.config');
const crypto = require('crypto');

const Jwt_secret = process.env.JWT_SECRET; // Secret for hashing email

async function checkIfCustomerExist(email) {
  const sql = "SELECT * FROM customer_identifier WHERE customer_email = ?";
  const result = await query(sql, [email]);
  return result.length > 0;
}

async function createCustomer(customer) {
  const { customer_first_name, customer_last_name, customer_email, customer_phone_number } = customer;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const newHash = crypto.createHash('sha256').update(customer_email + Jwt_secret).digest('hex');

    // Insert into customer_identifier
    const sql1 = "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const [rows1] = await connection.query(sql1, [customer_email, customer_phone_number, newHash]);

    if (rows1.affectedRows !== 1) {
      throw new Error("Failed to insert into customer_identifier");
    }

    const customer_id = rows1.insertId;

    // Insert into customer_info
    const sql2 = "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    const [rows2] = await connection.query(sql2, [customer_id, customer_first_name, customer_last_name, 1]);

    if (rows2.affectedRows !== 1) {
      throw new Error("Failed to insert into customer_info");
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.log("Error creating customer", error.message);
    throw new Error("Error creating customer");
  } finally {
    connection.release();
  }
}

async function getCustomer(customer_id) {
  const sql = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      ci.customer_hash,
      ci_info.customer_first_name,
      ci_info.customer_last_name,
      ci_info.active_customer_status
    FROM customer_identifier ci
    JOIN customer_info ci_info ON ci.customer_id = ci_info.customer_id
    WHERE ci.customer_id = ?
  `;

  try {
    const rows = await query(sql, [customer_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.log("Error getting customer", error.message);
    throw new Error("Error getting customer");
  }
}

async function getCustomers(page, limit) {
  const sql = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      ci.customer_hash,
      ci_info.customer_first_name,
      ci_info.customer_last_name,
      ci_info.active_customer_status
    FROM customer_identifier ci
    JOIN customer_info ci_info ON ci.customer_id = ci_info.customer_id
    LIMIT ?, ?
  `;
  const sqlCount = `SELECT COUNT(*) as total FROM customer_identifier`;
  const offset = (page - 1) * limit;

  try {
    const [{ total }] = await query(sqlCount);
    const rows = await query(sql, [offset, limit]);
    return { total, data: rows };
  } catch (error) {
    console.log("Error getting customers", error.message);
    throw new Error("Error getting customers");
  }
}

async function updateCustomer(customer) {
  const { customer_id, customer_first_name, customer_last_name, customer_email, customer_phone_number, active_customer_status } = customer;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const newHash = crypto.createHash('sha256').update(customer_email + Jwt_secret).digest('hex');

    // Update customer_identifier
    const sql1 = "UPDATE customer_identifier SET customer_email = ?, customer_hash = ?, customer_phone_number = ? WHERE customer_id = ?";
    const [rows1] = await connection.query(sql1, [customer_email, newHash, customer_phone_number, customer_id]);

    if (rows1.affectedRows !== 1) {
      throw new Error("Failed to update customer_identifier");
    }

    // Update customer_info
    const sql2 = "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? WHERE customer_id = ?";
    const [rows2] = await connection.query(sql2, [customer_first_name, customer_last_name, active_customer_status, customer_id]);

    if (rows2.affectedRows !== 1) {
      throw new Error("Failed to update customer_info");
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.log("Error updating customer", error.message);
    throw new Error("Error updating customer");
  } finally {
    connection.release();
  }
}

async function searchCustomers(keyword) {
  console.log("keyword", keyword);
  const sql = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      ci.customer_hash,
      ci_info.customer_first_name,
      ci_info.customer_last_name,
      ci_info.active_customer_status
    FROM customer_identifier ci
    JOIN customer_info ci_info ON ci.customer_id = ci_info.customer_id
    WHERE ci_info.customer_first_name LIKE ? OR ci_info.customer_last_name LIKE ? OR ci.customer_email LIKE ?
  `;

  const searchKeyword = `%${keyword}%`;

  try {
    const rows = await query(sql, [searchKeyword, searchKeyword, searchKeyword]);
    return rows;
  } catch (error) {
    console.log("Error searching customers", error.message);
    throw new Error("Error searching customers");
  }
}

module.exports = {
  checkIfCustomerExist,
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  searchCustomers,
};
