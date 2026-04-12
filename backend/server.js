const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'hell_db Ahh',
  waitForConnections: true,
  connectionLimit: 10
});
let menuOptionHasTypeColumn = null;
let menuOptionValueHasDefaultColumn = null;
let menuOptionDefaultsEnsured = false;
let ordersHasCustomerNameColumn = null;

const webRootDir = path.join(__dirname, '..');
app.use(express.static(webRootDir));

// Friendly page routes
const pageRoutes = {
  '/': 'frontend/login/customer-login.html',
  '/customer-login': 'frontend/login/customer-login.html',
  '/staff-login': 'frontend/login/staff-login.html',

  '/customer-dashboard': 'frontend/User/customer-dashboard.html',
  '/customer-reviews': 'frontend/User/reviews.html',
  '/menu-detail': 'frontend/User/menu-detail.html',
  '/cart': 'frontend/User/cart.html',
  '/my-orders': 'frontend/User/my-orders.html',
  '/payment': 'frontend/User/cart.html',

  '/admin': 'frontend/admin/dashboard_Admin.html',
  '/admin/dashboard': 'frontend/admin/dashboard_Admin.html',
  '/admin/menu-items': 'frontend/admin/menu-items.html',
  '/admin/orders': 'frontend/admin/orders.html',
  '/admin/order-detail': 'frontend/admin/order-detail.html',
  '/admin/payments': 'frontend/admin/payments.html',
  '/admin/reviews': 'frontend/admin/reviews.html',
  '/admin/profile': 'frontend/admin/profile.html',
  '/admin/attendance': 'frontend/admin/attendance.html',
  '/admin/cooks': 'frontend/admin/cooks.html',

  '/cook/profile': 'frontend/cook/ck-profile.html', 
  '/cook': 'frontend/cook/ck-dsb.html',
  '/cook/dashboard': 'frontend/cook/ck-dsb.html',
  '/cook/orders': 'frontend/cook/ck-od.html',

  '/cashier': 'frontend/cashier/Cashier.html'
};

Object.entries(pageRoutes).forEach(([route, relativePath]) => {
  app.get(route, (_req, res) => {
    res.sendFile(path.join(webRootDir, relativePath));
  });
});

// Convenience aliases: allow "/page-name.html" in addition to "/page-name"
Object.entries(pageRoutes).forEach(([route, relativePath]) => {
  if (route === '/' || route.endsWith('.html')) return;
  app.get(`${route}.html`, (_req, res) => {
    res.sendFile(path.join(webRootDir, relativePath));
  });
});

// Shared frontend helper path for friendly routes (e.g. /customer-login uses ../app.js -> /app.js)
app.get('/app.js', (_req, res) => {
  res.sendFile(path.join(webRootDir, 'frontend/app.js'));
});

const normalizeMethod = (method = '') => {
  const m = String(method).trim().toUpperCase();
  if (m === 'CASH') return 'CASH';
  if (m === 'CARD') return 'CARD';
  if (m === 'QR PAYMENT' || m === 'QR') return 'QR';
  return 'OTHER';
};

function getOptionTemplatesByCategoryId(categoryId) {
  // Based on DB structure in provided dump:
  // 1=main dish, 2=noodle, 3=snack, 4=drink
  if (Number(categoryId) === 4) {
    return [
      {
        name: 'ความหวาน',
        type: 'single',
        values: [
          { label: 'หวานน้อย', price_add: 0 },
          { label: 'ปกติ', price_add: 0 },
          { label: 'หวานมาก', price_add: 0 }
        ]
      }
    ];
  }

  if (Number(categoryId) === 3) {
    return [
      {
        name: 'ซอส',
        type: 'single',
        values: [
          { label: 'ซอสมะเขือเทศ', price_add: 0 },
          { label: 'ซอสพริก', price_add: 0 },
          { label: 'มายองเนส', price_add: 0 }
        ]
      }
    ];
  }

  return [
    {
      name: 'ขนาด',
      type: 'single',
      values: [
        { label: 'ธรรมดา', price_add: 0 },
        { label: 'พิเศษ', price_add: 10 }
      ]
    },
    {
      name: 'ระดับความเผ็ด',
      type: 'single',
      values: [
        { label: 'ไม่เผ็ด', price_add: 0 },
        { label: 'เผ็ดน้อย', price_add: 0 },
        { label: 'เผ็ดมาก', price_add: 0 }
      ]
    }
  ];
}

async function authenticateStaff({ username, password, role }) {
  const user = String(username || '').trim();
  const pass = String(password || '').trim();
  const targetRole = String(role || '').trim().toLowerCase();
  if (!user || !pass) return null;

  // 1. เช็ค Login ของ Cook
  if (!targetRole || targetRole === 'cook') {
    const [cookRows] = await pool.query(
      'SELECT cook_id, username, password, status FROM cooks WHERE username = ? LIMIT 1',
      [user]
    );
    const cook = cookRows[0];
    if (cook && String(cook.status || '').toUpperCase() === 'ACTIVE') {
      // ใช้ bcrypt เทียบรหัสผ่าน
      const isMatch = await bcrypt.compare(pass, cook.password);
      if (isMatch) {
        return {
          role: 'cook',
          staff_id: `CK-${String(cook.cook_id).padStart(2, '0')}`,
          name: cook.username
        };
      }
    }
  }

  // 2. เช็ค Login ของ Admin
  if (!targetRole || targetRole === 'admin') {
    const [adminRows] = await pool.query(
      'SELECT admin_id, username, password FROM admin WHERE username = ? LIMIT 1',
      [user]
    );
    const admin = adminRows[0];
    if (admin) {
      // ใช้ bcrypt เทียบรหัสผ่าน
      const isMatch = await bcrypt.compare(pass, admin.password);
      if (isMatch) {
        return {
          role: 'admin',
          staff_id: `AD-${String(admin.admin_id).padStart(2, '0')}`,
          name: admin.username
        };
      }
    }
  }

  return null;
}

async function ensureMenuOptionDefaults() {
  if (menuOptionDefaultsEnsured) return;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (menuOptionHasTypeColumn === null) {
      const [colRows] = await conn.query(
        `SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_option'
           AND COLUMN_NAME = 'option_type'
         LIMIT 1`
      );
      menuOptionHasTypeColumn = colRows.length > 0;
    }

    if (menuOptionValueHasDefaultColumn === null) {
      const [defaultColRows] = await conn.query(
        `SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_option_value'
           AND COLUMN_NAME = 'is_default'
         LIMIT 1`
      );
      menuOptionValueHasDefaultColumn = defaultColRows.length > 0;
    }

    const [menuRows] = await conn.query(
      `SELECT menu_id, category_id
       FROM menu
       WHERE deleted_at IS NULL AND status = 'AVAILABLE'
       ORDER BY menu_id`
    );

    for (const menu of menuRows) {
      const templates = getOptionTemplatesByCategoryId(menu.category_id);

      for (const template of templates) {
        const [optionRows] = await conn.query(
          'SELECT option_id FROM menu_option WHERE menu_id = ? AND name = ? LIMIT 1',
          [menu.menu_id, template.name]
        );

        let optionId = optionRows[0]?.option_id;
        if (!optionId) {
          const [insertOpt] = await conn.query(
            'INSERT INTO menu_option (menu_id, name) VALUES (?, ?)',
            [menu.menu_id, template.name]
          );
          optionId = insertOpt.insertId;
        }

        if (menuOptionHasTypeColumn) {
          await conn.query(
            'UPDATE menu_option SET option_type = ? WHERE option_id = ?',
            [template.type === 'multi' ? 'multi' : 'single', optionId]
          );
        }

        const [valueRows] = await conn.query(
          'SELECT value FROM menu_option_value WHERE option_id = ?',
          [optionId]
        );
        const existingValues = new Set(valueRows.map((v) => String(v.value || '').trim()));

        for (let idx = 0; idx < template.values.length; idx += 1) {
          const value = template.values[idx];
          if (existingValues.has(value.label)) continue;
          if (menuOptionValueHasDefaultColumn) {
            await conn.query(
              'INSERT INTO menu_option_value (option_id, value, price_add, is_default) VALUES (?, ?, ?, ?)',
              [optionId, value.label, Number(value.price_add || 0), idx === 0 ? 1 : 0]
            );
          } else {
            await conn.query(
              'INSERT INTO menu_option_value (option_id, value, price_add) VALUES (?, ?, ?)',
              [optionId, value.label, Number(value.price_add || 0)]
            );
          }
        }
      }
    }

    await conn.commit();
    menuOptionDefaultsEnsured = true;
  } catch (err) {
    await conn.rollback();
    console.warn('Auto option seed failed:', err.message);
  } finally {
    conn.release();
  }
}

async function ensureOrdersCustomerColumn() {
  if (ordersHasCustomerNameColumn !== null) return;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT 1
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'orders'
         AND COLUMN_NAME = 'customer_name'
       LIMIT 1`
    );
    if (!rows.length) {
      await conn.query('ALTER TABLE orders ADD COLUMN customer_name VARCHAR(120) NULL AFTER table_id');
      await conn.query('CREATE INDEX idx_orders_table_customer ON orders (table_id, customer_name)');
      ordersHasCustomerNameColumn = true;
      return;
    }
    ordersHasCustomerNameColumn = true;
  } catch (err) {
    console.warn('Ensure orders.customer_name failed:', err.message);
    ordersHasCustomerNameColumn = false;
  } finally {
    conn.release();
  }
}

async function syncOrderStatusFromItems(conn, orderId) {
  const [orderRows] = await conn.query(
    'SELECT status FROM orders WHERE order_id = ? LIMIT 1',
    [orderId]
  );
  const currentOrder = orderRows[0];
  if (!currentOrder) return;

  const currentStatus = String(currentOrder.status || '').toUpperCase();
  if (currentStatus === 'DONE' || currentStatus === 'CANCELLED') return;

  const [items] = await conn.query(
    'SELECT item_status FROM order_item WHERE order_id = ?',
    [orderId]
  );
  if (!items.length) return;

  const statuses = items.map((x) => String(x.item_status || 'PENDING').toUpperCase());
  const has = (s) => statuses.includes(s);

  let nextStatus = 'PENDING';
  if (has('COOKING')) nextStatus = 'COOKING';
  else if (has('READY') || has('SERVED')) nextStatus = 'SERVING';
  else nextStatus = 'PENDING';

  await conn.query(
    'UPDATE orders SET status = ? WHERE order_id = ?',
    [nextStatus, orderId]
  );
}

async function getMenuBundle() {
  await ensureMenuOptionDefaults();

  const [categories] = await pool.query('SELECT category_id, name FROM category ORDER BY category_id');
  const [menus] = await pool.query(
    `SELECT menu_id, name_menu, price, image_url, status, category_id
     FROM menu
     WHERE deleted_at IS NULL AND status = 'AVAILABLE'
     ORDER BY menu_id`
  );
  if (menuOptionHasTypeColumn === null) {
    const [colRows] = await pool.query(
      `SELECT 1
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'menu_option'
         AND COLUMN_NAME = 'option_type'
       LIMIT 1`
    );
    menuOptionHasTypeColumn = colRows.length > 0;
  }

  const optionTypeSelect = menuOptionHasTypeColumn
    ? `mo.option_type`
    : `'single' AS option_type`;

  if (menuOptionValueHasDefaultColumn === null) {
    const [defaultColRows] = await pool.query(
      `SELECT 1
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'menu_option_value'
         AND COLUMN_NAME = 'is_default'
       LIMIT 1`
    );
    menuOptionValueHasDefaultColumn = defaultColRows.length > 0;
  }

  const isDefaultSelect = menuOptionValueHasDefaultColumn
    ? 'mov.is_default'
    : '0 AS is_default';

  const [options] = await pool.query(
    `SELECT mo.option_id, mo.menu_id, mo.name AS option_name, ${optionTypeSelect},
            mov.value_id, mov.value, mov.price_add, ${isDefaultSelect}
     FROM menu_option mo
     JOIN menu_option_value mov ON mov.option_id = mo.option_id
     ORDER BY mo.option_id, mov.value_id`
  );

  const optionsByMenu = new Map();
  for (const row of options) {
    if (!optionsByMenu.has(row.menu_id)) optionsByMenu.set(row.menu_id, new Map());
    const groupMap = optionsByMenu.get(row.menu_id);
    if (!groupMap.has(row.option_id)) {
      groupMap.set(row.option_id, {
        option_id: row.option_id,
        name: row.option_name,
        type: String(row.option_type || 'single').toLowerCase() === 'multi' ? 'multi' : 'choice',
        values: []
      });
    }
    groupMap.get(row.option_id).values.push({
      value_id: row.value_id,
      value: row.value,
      price_add: Number(row.price_add || 0),
      is_default: Number(row.is_default || 0) === 1
    });
  }

  return categories.map((cat) => ({
    category_id: cat.category_id,
    name: cat.name,
    menus: menus
      .filter((m) => m.category_id === cat.category_id)
      .map((m) => ({
        menu_id: m.menu_id,
        name: m.name_menu,
        price: Number(m.price),
        image: m.image_url,
        option_groups: Array.from(optionsByMenu.get(m.menu_id)?.values() || [])
      }))
  }));
}

// --- CUSTOMER APIs ---

app.post('/api/auth/staff/login', async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    const session = await authenticateStaff({ username, password, role });
    if (!session) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ status: 'success', session: { ...session, loginAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/customer/login', async (req, res) => {
  try {
    const { table_id, name } = req.body || {};
    const tableId = Number(table_id || 0);
    const username = String(name || '').trim();
    if (!tableId || !username) {
      return res.status(400).json({ error: 'table_id and name are required' });
    }

    const [tableRows] = await pool.query(
      'SELECT table_id, table_number FROM tables WHERE table_id = ? OR table_number = ? LIMIT 1',
      [tableId, tableId]
    );
    const table = tableRows[0];
    if (!table) return res.status(404).json({ error: 'Table not found' });

    res.json({
      status: 'success',
      session: {
        table_id: Number(table.table_id),
        table_number: Number(table.table_number),
        name: username,
        loginAt: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customer/menu', async (req, res) => {
  try {
    const data = await getMenuBundle();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customer/reviews', async (req, res) => {
  const menuId = Number(req.query.menu_id || 0);
  const tableId = Number(req.query.table_id || 0);
  const customerName = String(req.query.customer_name || '').trim();
  if (!menuId) return res.status(400).json({ error: 'menu_id is required' });

  try {
    await ensureOrdersCustomerColumn();
    if (!tableId || !customerName) {
      return res.status(400).json({ error: 'table_id and customer_name are required' });
    }
    const [rows] = await pool.query(
      `SELECT r.review_id, r.order_id, r.menu_id, r.rating, r.comment, r.created_at, m.name_menu
       FROM review r
       JOIN orders o ON o.order_id = r.order_id
       JOIN menu m ON m.menu_id = r.menu_id
       WHERE r.menu_id = ?
         AND o.table_id = ?
         ${ordersHasCustomerNameColumn ? 'AND o.customer_name = ?' : ''}
       ORDER BY r.created_at DESC`,
      ordersHasCustomerNameColumn
        ? [menuId, tableId, customerName]
        : [menuId, tableId]
    );
    res.json(rows.map((r) => ({
      review_id: r.review_id,
      order_id: r.order_id,
      menu_id: r.menu_id,
      itemName: r.name_menu,
      stars: Number(r.rating || 0),
      text: r.comment || '',
      time: r.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customer/reviews', async (req, res) => {
  const { order_id, menu_id, rating, comment, table_id, customer_name } = req.body;
  if (!order_id || !menu_id || !rating) {
    return res.status(400).json({ error: 'order_id, menu_id and rating are required' });
  }

  try {
    await ensureOrdersCustomerColumn();
    const tableId = Number(table_id || 0);
    const customerName = String(customer_name || '').trim();
    if (!tableId || !customerName) {
      return res.status(400).json({ error: 'table_id and customer_name are required' });
    }

    const [ownRows] = await pool.query(
      `SELECT 1 FROM orders
       WHERE order_id = ?
         AND table_id = ?
         ${ordersHasCustomerNameColumn ? 'AND customer_name = ?' : ''}
       LIMIT 1`,
      ordersHasCustomerNameColumn
        ? [Number(order_id), tableId, customerName]
        : [Number(order_id), tableId]
    );
    if (!ownRows.length) {
      return res.status(403).json({ error: 'You can review only your own order items' });
    }

    await pool.query(
      `INSERT INTO review (order_id, menu_id, rating, comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = CURRENT_TIMESTAMP`,
      [order_id, menu_id, rating, comment || '']
    );
    res.json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/customer/checkout', async (req, res) => {
  const {
    table_id = 1,
    customer_name = '',
    method = 'CASH',
    payment_detail = '',
    items = []
  } = req.body || {};

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'items is required' });
  }

  const conn = await pool.getConnection();
  try {
    await ensureOrdersCustomerColumn();
    await conn.beginTransaction();

    const customerName = String(customer_name || '').trim();
    if (!customerName) throw new Error('customer_name is required');

    const [orderResult] = await conn.query(
      ordersHasCustomerNameColumn
        ? 'INSERT INTO orders (table_id, customer_name, status) VALUES (?, ?, "PENDING")'
        : 'INSERT INTO orders (table_id, status) VALUES (?, "PENDING")',
      ordersHasCustomerNameColumn ? [table_id, customerName] : [table_id]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const menuId = Number(item.menu_id || item.menuId);
      const quantity = Math.max(1, Number(item.qty || item.quantity || 1));
      if (!menuId) throw new Error('Invalid menu_id in items');

      const [menuRows] = await conn.query('SELECT price FROM menu WHERE menu_id = ?', [menuId]);
      if (!menuRows.length) throw new Error(`menu_id ${menuId} not found`);
      const basePrice = Number(menuRows[0].price);

      const note = String(item.note || '').trim();
      const [itemResult] = await conn.query(
        'INSERT INTO order_item (order_id, menu_id, quantity, price, note) VALUES (?, ?, ?, ?, ?)',
        [orderId, menuId, quantity, basePrice, note || null]
      );

      const orderItemId = itemResult.insertId;
      const selectedOptions = Array.isArray(item.selectedOptions) ? item.selectedOptions : [];
      for (const opt of selectedOptions) {
        const valueId = Number(opt.option_value_id || opt.value_id || opt.optionValueId);
        if (!valueId) continue;

        const [valueRows] = await conn.query(
          'SELECT price_add FROM menu_option_value WHERE value_id = ?',
          [valueId]
        );
        if (!valueRows.length) continue;

        await conn.query(
          'INSERT INTO order_item_option (order_item_id, option_value_id, price_add) VALUES (?, ?, ?)',
          [orderItemId, valueId, Number(valueRows[0].price_add || 0)]
        );
      }
    }

    const [orderRows] = await conn.query('SELECT total_price FROM orders WHERE order_id = ?', [orderId]);
    const totalPayment = Number(orderRows[0]?.total_price || 0);

    await conn.query(
      'INSERT INTO payment (order_id, total_payment, method, status) VALUES (?, ?, ?, "PAID")',
      [orderId, totalPayment, normalizeMethod(method)]
    );

    await conn.commit();
    res.json({ status: 'success', order_id: orderId, total_payment: totalPayment });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/customer/orders', async (req, res) => {
  const tableId = Number(req.query.table_id || 1);
  const customerName = String(req.query.customer_name || '').trim();

  try {
    await ensureOrdersCustomerColumn();
    if (!customerName) return res.status(400).json({ error: 'customer_name is required' });
    const [orders] = await pool.query(
      `SELECT o.order_id, o.status, o.order_time, o.total_price,
              p.method, p.payment_time
       FROM orders o
       LEFT JOIN payment p ON p.order_id = o.order_id
       WHERE o.table_id = ?
         ${ordersHasCustomerNameColumn ? 'AND o.customer_name = ?' : ''}
       ORDER BY o.order_id DESC`,
      ordersHasCustomerNameColumn ? [tableId, customerName] : [tableId]
    );

    if (!orders.length) return res.json([]);

    const orderIds = orders.map((o) => o.order_id);
    const [items] = await pool.query(
      `SELECT oi.order_item_id, oi.order_id, oi.menu_id, oi.menu_name, oi.quantity, oi.price, oi.subtotal, oi.item_status, oi.note
       FROM order_item oi
       WHERE oi.order_id IN (?)
       ORDER BY oi.order_item_id ASC`,
      [orderIds]
    );

    const itemIds = items.map((i) => i.order_item_id);
    let options = [];
    if (itemIds.length) {
      const [optionRows] = await pool.query(
        `SELECT oio.order_item_id, oio.option_name, oio.option_value_name, oio.price_add, oio.option_value_id
         FROM order_item_option oio
         WHERE oio.order_item_id IN (?)
         ORDER BY oio.id ASC`,
        [itemIds]
      );
      options = optionRows;
    }

    const optionsByItem = new Map();
    for (const opt of options) {
      if (!optionsByItem.has(opt.order_item_id)) optionsByItem.set(opt.order_item_id, []);
      optionsByItem.get(opt.order_item_id).push({
        group: opt.option_name,
        label: opt.option_value_name,
        price: Number(opt.price_add || 0),
        option_value_id: opt.option_value_id
      });
    }

    const itemsByOrder = new Map();
    for (const item of items) {
      if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
      const selectedOptions = optionsByItem.get(item.order_item_id) || [];
      const basePrice = Number(item.price || 0);
      const optionTotal = selectedOptions.reduce((sum, o) => sum + Number(o.price || 0), 0);
      const unitPrice = basePrice + optionTotal;
      itemsByOrder.get(item.order_id).push({
        order_item_id: item.order_item_id,
        menu_id: item.menu_id,
        name: item.menu_name,
        qty: Number(item.quantity || 1),
        basePrice,
        unitPrice,
        totalPrice: Number(item.subtotal || (unitPrice * Number(item.quantity || 1))),
        selectedOptions,
        note: item.note || '',
        item_status: item.item_status
      });
    }

    res.json(orders.map((o) => ({
      id: o.order_id,
      status: o.status,
      method: o.method || '',
      time: o.order_time,
      paidAt: o.payment_time,
      total: Number(o.total_price || 0),
      items: itemsByOrder.get(o.order_id) || []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LEGACY/STAFF APIs ---

app.post('/api/orders/items', async (req, res) => {
  const { order_id, menu_id, quantity, price } = req.body;
  try {
    await pool.query(
      'INSERT INTO order_item (order_id, menu_id, quantity, price, note) VALUES (?, ?, ?, ?, ?)',
      [order_id, menu_id, quantity, price, null]
    );
    res.json({ status: 'success', message: 'Item added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/orders/options', async (req, res) => {
  const { order_item_id, option_value_id } = req.body;
  try {
    const [valueRows] = await pool.query('SELECT price_add FROM menu_option_value WHERE value_id = ?', [option_value_id]);
    const priceAdd = Number(valueRows[0]?.price_add || 0);
    await pool.query(
      'INSERT INTO order_item_option (order_item_id, option_value_id, price_add) VALUES (?, ?, ?)',
      [order_item_id, option_value_id, priceAdd]
    );
    res.json({ message: 'Option applied and total updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/cook/queue', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM order_item WHERE item_status IN ("PENDING", "COOKING")');
  res.json(rows);
});

app.patch('/api/cook/items/:id', async (req, res) => {
  const { item_status } = req.body || {};
  const nextItemStatus = String(item_status || '').toUpperCase();
  const allowed = new Set(['PENDING', 'COOKING', 'READY', 'SERVED']);
  if (!allowed.has(nextItemStatus)) {
    return res.status(400).json({ error: 'Invalid item_status' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [itemRows] = await conn.query(
      'SELECT order_id FROM order_item WHERE order_item_id = ? LIMIT 1',
      [req.params.id]
    );
    const item = itemRows[0];
    if (!item) {
      await conn.rollback();
      return res.status(404).json({ error: 'Order item not found' });
    }

    await conn.query(
      'UPDATE order_item SET item_status = ? WHERE order_item_id = ?',
      [nextItemStatus, req.params.id]
    );

    await syncOrderStatusFromItems(conn, item.order_id);

    await conn.commit();
    res.json({ message: 'Status updated' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.patch('/api/cook/orders/:id/cancel', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderRows] = await conn.query(
      'SELECT order_id, status FROM orders WHERE order_id = ? LIMIT 1',
      [req.params.id]
    );
    const order = orderRows[0];
    if (!order) {
      await conn.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = String(order.status || '').toUpperCase();
    if (currentStatus === 'DONE' || currentStatus === 'CANCELLED') {
      await conn.rollback();
      return res.status(400).json({ error: 'This order cannot be cancelled' });
    }

    const [itemRows] = await conn.query(
      'SELECT item_status FROM order_item WHERE order_id = ?',
      [req.params.id]
    );
    if (!itemRows.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'Order has no items' });
    }

    const canCancel = itemRows.every((row) => String(row.item_status || '').toUpperCase() === 'PENDING');
    if (!canCancel) {
      await conn.rollback();
      return res.status(400).json({ error: 'Only fully pending orders can be cancelled' });
    }

    await conn.query(
      'UPDATE orders SET status = "CANCELLED" WHERE order_id = ?',
      [req.params.id]
    );

    await conn.commit();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.post('/api/admin/pay', async (req, res) => {
  const { order_id, total_payment, method } = req.body;
  try {
    await pool.query(
      `INSERT INTO payment (order_id, total_payment, method, status)
       VALUES (?, ?, ?, "PAID")
       ON DUPLICATE KEY UPDATE
         total_payment = VALUES(total_payment),
         method = VALUES(method),
         status = "PAID",
         payment_time = CURRENT_TIMESTAMP`,
      [order_id, total_payment, normalizeMethod(method)]
    );
    await pool.query('UPDATE orders SET status = "DONE" WHERE order_id = ?', [order_id]);
    res.json({ message: 'Order completed and table released' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.order_id, o.table_id, o.status, o.order_time, o.total_price,
              p.method, p.status AS payment_status, p.payment_time
       FROM orders o
       LEFT JOIN payment p ON p.order_id = o.order_id
       ORDER BY o.order_id DESC`
    );

    if (!orders.length) return res.json([]);

    const orderIds = orders.map((o) => o.order_id);
    const [items] = await pool.query(
      `SELECT oi.order_item_id, oi.order_id, oi.menu_id, oi.menu_name, oi.quantity, oi.price, oi.subtotal, oi.item_status, oi.note
       FROM order_item oi
       WHERE oi.order_id IN (?)
       ORDER BY oi.order_item_id ASC`,
      [orderIds]
    );

    const itemIds = items.map((i) => i.order_item_id);
    let options = [];
    if (itemIds.length) {
      const [optionRows] = await pool.query(
        `SELECT oio.order_item_id, oio.option_name, oio.option_value_name, oio.price_add, oio.option_value_id
         FROM order_item_option oio
         WHERE oio.order_item_id IN (?)
         ORDER BY oio.id ASC`,
        [itemIds]
      );
      options = optionRows;
    }

    const optionsByItem = new Map();
    for (const opt of options) {
      if (!optionsByItem.has(opt.order_item_id)) optionsByItem.set(opt.order_item_id, []);
      optionsByItem.get(opt.order_item_id).push({
        group: opt.option_name,
        label: opt.option_value_name,
        price: Number(opt.price_add || 0),
        option_value_id: opt.option_value_id
      });
    }

    const itemsByOrder = new Map();
    for (const item of items) {
      if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
      const selectedOptions = optionsByItem.get(item.order_item_id) || [];
      const basePrice = Number(item.price || 0);
      const optionTotal = selectedOptions.reduce((sum, o) => sum + Number(o.price || 0), 0);
      itemsByOrder.get(item.order_id).push({
        order_item_id: item.order_item_id,
        menu_id: item.menu_id,
        name: item.menu_name,
        qty: Number(item.quantity || 1),
        basePrice,
        unitPrice: basePrice + optionTotal,
        totalPrice: Number(item.subtotal || 0),
        selectedOptions,
        note: item.note || '',
        item_status: item.item_status
      });
    }

    res.json(orders.map((o) => ({
      id: o.order_id,
      table_id: o.table_id,
      status: o.status,
      method: o.method || '',
      payment_status: o.payment_status || 'PENDING',
      time: o.order_time,
      paidAt: o.payment_time,
      total: Number(o.total_price || 0),
      items: itemsByOrder.get(o.order_id) || []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/payments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.payment_id, p.order_id, p.payment_time, p.total_payment, p.status, p.method, o.table_id
       FROM payment p
       LEFT JOIN orders o ON o.order_id = p.order_id
       ORDER BY p.payment_id DESC`
    );
    res.json(rows.map((r) => ({
      payment_id: r.payment_id,
      order_id: r.order_id,
      table_id: r.table_id,
      payment_time: r.payment_time,
      total_payment: Number(r.total_payment || 0),
      status: r.status,
      method: r.method
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.review_id, r.order_id, r.menu_id, r.rating, r.comment, r.created_at, m.name_menu
       FROM review r
       JOIN menu m ON m.menu_id = r.menu_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows.map((r) => ({
      review_id: r.review_id,
      order_id: r.order_id,
      menu_id: r.menu_id,
      menu: r.name_menu,
      rating: Number(r.rating || 0),
      comment: r.comment || '',
      time: r.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/menus', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.menu_id, m.name_menu, m.price, m.image_url, m.status, c.name AS category_name
       FROM menu m
       LEFT JOIN category c ON c.category_id = m.category_id
       WHERE m.deleted_at IS NULL
       ORDER BY m.menu_id DESC`
    );
    res.json(rows.map((m) => ({
      id: m.menu_id,
      name: m.name_menu,
      category: m.category_name || 'Uncategorized',
      price: Number(m.price || 0),
      image: m.image_url || '',
      status: m.status === 'AVAILABLE' ? 'Active' : 'Inactive'
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getCategoryIdByName(categoryName) {
  const name = String(categoryName || '').trim();
  if (!name) return null;
  const [rows] = await pool.query('SELECT category_id FROM category WHERE name = ? LIMIT 1', [name]);
  if (rows.length) return rows[0].category_id;
  const [result] = await pool.query('INSERT INTO category (name) VALUES (?)', [name]);
  return result.insertId;
}

app.post('/api/admin/menus', async (req, res) => {
  try {
    const { name, category, price, image = '', status = 'Active' } = req.body || {};
    if (!name || Number(price) <= 0) return res.status(400).json({ error: 'Invalid menu payload' });
    const categoryId = await getCategoryIdByName(category);
    const dbStatus = String(status).toLowerCase() === 'active' ? 'AVAILABLE' : 'UNAVAILABLE';
    const [result] = await pool.query(
      'INSERT INTO menu (name_menu, price, image_url, status, category_id) VALUES (?, ?, ?, ?, ?)',
      [name, Number(price), image || null, dbStatus, categoryId]
    );
    res.json({ status: 'success', menu_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/menus/:id', async (req, res) => {
  try {
    const menuId = Number(req.params.id);
    if (!menuId) return res.status(400).json({ error: 'Invalid menu id' });
    const { name, category, price, image = '', status = 'Active' } = req.body || {};
    const categoryId = await getCategoryIdByName(category);
    const dbStatus = String(status).toLowerCase() === 'active' ? 'AVAILABLE' : 'UNAVAILABLE';
    await pool.query(
      `UPDATE menu
       SET name_menu = ?, price = ?, image_url = ?, status = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE menu_id = ?`,
      [name, Number(price), image || null, dbStatus, categoryId, menuId]
    );
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ดึงรายชื่อ Cook ทั้งหมด
app.get('/api/admin/cooks', async (req, res) => {
  try {
    // ดึง column name มาด้วย (ถ้าตอนแรกไม่ได้เพิ่ม ให้ไปรัน ALTER TABLE cooks ADD COLUMN name VARCHAR(100) ก่อนนะครับ)
    const [rows] = await pool.query('SELECT cook_id, username, name, status FROM cooks ORDER BY cook_id ASC');
    res.json(rows.map((c) => ({
      id: `CK-${String(c.cook_id).padStart(2, '0')}`,
      name: c.name || c.username, // ถ้าไม่มีชื่อให้ใช้ username แทน
      username: c.username,
      shift: 'Morning',
      status: c.status === 'ACTIVE' ? 'Active' : 'Inactive'
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// เพิ่ม Cook ใหม่ (โดย Admin)
app.post('/api/admin/cooks', async (req, res) => {
  try {
    const { name, username, password, status = 'Active' } = req.body || {};
    if (!username) return res.status(400).json({ error: 'Username is required' });
    
    const dbStatus = String(status).toLowerCase() === 'active' ? 'ACTIVE' : 'DISABLED';
    const pass = password || '1234'; 

    // 🔥 เข้ารหัสผ่านเริ่มต้นทันทีที่แอดมินสร้าง
    const hashedPass = await bcrypt.hash(pass, 10);

    const [result] = await pool.query(
      'INSERT INTO cooks (username, name, password, status) VALUES (?, ?, ?, ?)',
      [username, name || username, hashedPass, dbStatus]
    );
    res.json({ status: 'success', cook_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// แก้ไข / เปิด-ปิด สถานะ Cook
app.patch('/api/admin/cooks/:id', async (req, res) => {
  try {
    // ตัดคำว่า CK- ออกเพื่อให้เหลือแต่ตัวเลข ID
    const cookId = Number(String(req.params.id).replace('CK-', ''));
    if (!cookId) return res.status(400).json({ error: 'Invalid cook id' });

    const { name, username, password, status } = req.body || {};
    
    let query = 'UPDATE cooks SET ';
    let params = [];
    let updates = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (username !== undefined) { updates.push('username = ?'); params.push(username); }
    if (password && password.trim() !== '') { updates.push('password = ?'); params.push(password); }
    if (status !== undefined) { 
        const dbStatus = String(status).toLowerCase() === 'active' ? 'ACTIVE' : 'DISABLED';
        updates.push('status = ?'); params.push(dbStatus); 
    }

    if (updates.length === 0) return res.json({ status: 'success', message: 'No changes' });

    query += updates.join(', ') + ' WHERE cook_id = ?';
    params.push(cookId);

    await pool.query(query, params);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/attendance', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT cook_id, username, status FROM cooks ORDER BY cook_id ASC');
    res.json(rows.map((c) => ({
      id: `CK-${String(c.cook_id).padStart(2, '0')}`,
      name: c.username,
      check_in: '-',
      check_out: '-',
      status: c.status === 'ACTIVE' ? 'Present' : 'Absent'
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cashier/tables', async (req, res) => {
  try {
    const [tables] = await pool.query('SELECT table_id, table_number, status FROM tables ORDER BY table_number ASC');
    const [openOrders] = await pool.query(
      `SELECT o.order_id, o.table_id, o.total_price, o.status
       FROM orders o
       WHERE o.status IN ('PENDING','COOKING','SERVING')`
    );

    const ordersByTable = new Map();
    for (const order of openOrders) {
      if (!ordersByTable.has(order.table_id)) ordersByTable.set(order.table_id, []);
      ordersByTable.get(order.table_id).push({
        order_id: order.order_id,
        status: order.status,
        total: Number(order.total_price || 0)
      });
    }

    res.json(tables.map((t) => ({
      table_id: t.table_id,
      table_number: t.table_number,
      status: t.status,
      orders: ordersByTable.get(t.table_id) || []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/reports/actual', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_orders_actual');
  res.json(rows);
});

// เพิ่มให้top menu link กับ cook_id
app.get('/api/cook/top-menu/:cook_id', async (req, res) => {
  try {
    // Clean 'CK-01' prefix to get numeric ID for database query
    const cookId = Number(String(req.params.cook_id).replace('CK-', ''));

    if (!cookId) return res.status(400).json({ error: 'Invalid cook id' });

    const [rows] = await pool.query(
          `SELECT menu_name, SUM(quantity) as total_qty
       FROM order_item
       WHERE cook_id = ? AND item_status IN ('READY', 'SERVED')
       GROUP BY menu_id, menu_name
       ORDER BY total_qty DESC
       LIMIT 1`,
      [cookId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Hell DB API is fully operational on port 3000');
  console.log(`Serving UI from: ${path.join(webRootDir, 'frontend')}`);
});

// หน้า Register ให้ Cook มากดยืนยันไอดีและตั้งรหัสผ่านเอง
app.post('/api/register', async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    
    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    // 1. เช็คว่าแอดมินได้สร้าง ID (Username) นี้ไว้ให้ในระบบหรือยัง?
    const [existingUser] = await pool.query('SELECT * FROM cooks WHERE username = ?', [username]);
    if (existingUser.length === 0) {
      return res.status(400).json({ error: 'ไม่พบ ID นี้ในระบบ กรุณาติดต่อ Admin ให้สร้าง ID ให้ก่อนครับ' });
    }

    // 2. 🔥 เข้ารหัสผ่านที่ Cook ตั้งเอง
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. ทำการอัปเดต (UPDATE) ข้อมูลลงไปในไอดีที่แอดมินสร้างไว้
    await pool.query(
      'UPDATE cooks SET password = ?, firstname = ?, lastname = ?, join_date = CURDATE() WHERE username = ?',
      [hashedPassword, firstname, lastname, username]
    );

    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


