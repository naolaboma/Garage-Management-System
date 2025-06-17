const { query, getConnection } = require('../config/db.config');
const crypto = require('crypto');
const Jwt_secret = process.env.JWT_SECRET;

async function createOrder(order) {
  const connection = await getConnection();

  // Generate a unique hash using employee_id, customer_id, vehicle_id, and timestamp
  const uniqueString = `${order.employee_id}-${order.customer_id}-${order.vehicle_id}-${Date.now()}`;
  const order_hash = crypto.createHash('sha256').update(uniqueString + Jwt_secret).digest('hex');

  try {
    await connection.beginTransaction();

    const sql1 = 'INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash) VALUES (?, ?, ?, ?, ?)';
    const [result1] = await connection.query(sql1, [order.employee_id, order.customer_id, order.vehicle_id, 1, order_hash]);
    if (result1.affectedRows !== 1) {
      throw new Error('Failed to insert into orders');
    }

    const order_id = result1.insertId;
    const sql2 = 'INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed) VALUES (?, ?, ?, ?)';
    const [result2] = await connection.query(sql2, [
      order_id,
      order.order_total_price,
      order.additional_request ?? null,
      0
    ]);
    if (result2.affectedRows !== 1) {
      throw new Error('Failed to insert into order_info');
    }

    if (order?.order_services) {
      const sql3 = 'INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)';
      for (let svc of order.order_services) {
        const [result3] = await connection.query(sql3, [order_id, svc.service_id, 0]);
        if (result3.affectedRows !== 1) {
          throw new Error('Failed to insert into order_services');
        }
      }
    }

    const sql4 = 'INSERT INTO order_status (order_id, order_status) VALUES (?, ?)';
    const [result4] = await connection.query(sql4, [order_id, 0]);
    if (result4.affectedRows !== 1) {
      throw new Error('Failed to insert into order_status');
    }

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    console.log('Error creating order:', error.message);
    return false;
  } finally {
    connection.release();
  }
}

async function getOrders(page, limit) {
  const offset = (page - 1) * limit;

  try {
    const sql = `
      SELECT 
        o.order_id,
        o.employee_id,
        CONCAT(ei.employee_first_name, ' ', ei.employee_last_name) AS employee_name,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        oi.order_total_price,
        os.order_status,
        ci.customer_email,
        CONCAT(cinfo.customer_first_name, ' ', cinfo.customer_last_name) AS customer_name,
        v.vehicle_model,
        v.vehicle_tag
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      LEFT JOIN customer_identifier ci ON o.customer_id = ci.customer_id
      LEFT JOIN customer_info cinfo ON o.customer_id = cinfo.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN employee e ON o.employee_id = e.employee_id
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      LIMIT ? OFFSET ?;
    `;

    const orders = await query(sql, [limit, offset]);
    return orders;

  } catch (error) {
    console.log('Error getting orders:', error.message);
    throw new Error('Error getting orders');
  }
}

async function getOrderByHash(hash) {
  try {
    const sql = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        oi.order_total_price,
        oi.additional_request,
        oi.additional_requests_completed,
        os.order_status
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      WHERE o.order_hash = ?;
    `;

    const [order] = await query(sql, [hash]);
    if (!order) return false;

    const sql2 = `
      SELECT 
        os.order_service_id,
        os.service_id,
        os.service_completed,
        cs.service_name,
        cs.service_description
      FROM order_services os
      LEFT JOIN common_services cs ON os.service_id = cs.service_id
      WHERE os.order_id = ?;
    `;

    const services = await query(sql2, [order.order_id]);
    order.order_services = services;

    return order;

  } catch (error) {
    console.log('Error getting order by hash:', error.message);
    throw new Error('Error getting order by hash');
  }
}

async function updateOrder(order) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    if (order.hasOwnProperty('active_order')) {
      const sql1 = 'UPDATE orders SET active_order = ? WHERE order_id = ?';
      const [result1] = await connection.query(sql1, [order.active_order, order.order_id]);
      if (result1.affectedRows !== 1) throw new Error('Failed to update orders');
    }

    if (
      order.hasOwnProperty('order_total_price') ||
      order.hasOwnProperty('additional_request') ||
      order.hasOwnProperty('additional_requests_completed')
    ) {
      const fields = [];
      const params = [];

      if (order.hasOwnProperty('order_total_price')) {
        fields.push('order_total_price = ?');
        params.push(order.order_total_price);
      }
      if (order.hasOwnProperty('additional_request')) {
        fields.push('additional_request = ?');
        params.push(order.additional_request);
      }
      if (order.hasOwnProperty('additional_requests_completed')) {
        fields.push('additional_requests_completed = ?');
        params.push(order.additional_requests_completed);
      }

      if (fields.length > 0) {
        const sql2 = `UPDATE order_info SET ${fields.join(', ')} WHERE order_id = ?`;
        params.push(order.order_id);
        const [result2] = await connection.query(sql2, params);
        if (result2.affectedRows !== 1) throw new Error('Failed to update order_info');
      }
    }

    if (order.hasOwnProperty('order_status')) {
      const sql3 = 'UPDATE order_status SET order_status = ? WHERE order_id = ?';
      const [result3] = await connection.query(sql3, [order.order_status, order.order_id]);
      if (result3.affectedRows !== 1) throw new Error('Failed to update order_status');
    }

    if (order.hasOwnProperty('order_services')) {
      const sql4 = 'DELETE FROM order_services WHERE order_id = ?';
      await connection.query(sql4, [order.order_id]);

      if (Array.isArray(order.order_services) && order.order_services.length > 0) {
        const sql5 = 'INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)';
        for (const svc of order.order_services) {
          const [result5] = await connection.query(sql5, [order.order_id, svc.service_id, svc.service_completed]);
          if (result5.affectedRows !== 1) throw new Error('Failed to insert into order_services');
        }
      }
    }

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    console.log('Error updating order:', error.message);
    return false;
  } finally {
    connection.release();
  }
}

async function getCustomerOrders(id) {
  try {
    const sql = `
      SELECT 
        o.order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        o.active_order,
        o.order_hash,
        oi.order_total_price,
        os.order_status,
        ci.customer_email,
        CONCAT(cinfo.customer_first_name, ' ', cinfo.customer_last_name) AS customer_name,
        v.vehicle_model,
        v.vehicle_tag,
        CONCAT(ei.employee_first_name, ' ', ei.employee_last_name) AS employee_name
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      LEFT JOIN customer_identifier ci ON o.customer_id = ci.customer_id
      LEFT JOIN customer_info cinfo ON o.customer_id = cinfo.customer_id
      LEFT JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
      LEFT JOIN employee e ON o.employee_id = e.employee_id
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      WHERE o.customer_id = ?;
    `;

    const orders = await query(sql, [id]);
    return orders || [];

  } catch (error) {
    console.log('Error getting customer orders:', error.message);
    throw new Error('Error getting customer orders');
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderByHash,
  updateOrder,
  getCustomerOrders
};
