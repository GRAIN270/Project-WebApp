const store = {
  read: (k, fallback = []) => {
    try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  },
  write: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

const API_BASE = (localStorage.getItem('api_base') || '').trim() || 'http://localhost:3000';
const apiUrl = (path) => `${API_BASE}${path}`;

async function apiGet(path) {
  const res = await fetch(apiUrl(path));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiSend(path, method, body) {
  const res = await fetch(apiUrl(path), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) {
    let err = 'Request failed';
    try {
      const payload = await res.json();
      err = payload.error || JSON.stringify(payload);
    } catch (_) {
      err = await res.text();
    }
    throw new Error(err);
  }
  return res.json();
}

function normalizeOrdersForUI(rows = []) {
  return rows.map((o) => ({
    id: `ORD-${String(o.id).padStart(5, '0')}`,
    dbId: o.id,
    tableId: o.table_id,
    status: o.status,
    method: o.method || '-',
    paymentStatus: o.payment_status || 'PENDING',
    time: o.time,
    total: Number(o.total || 0),
    items: (o.items || []).map((i) => ({
      ...i,
      itemLabel: i.name
    }))
  }));
}

function normalizePaymentsForUI(rows = []) {
  return rows.map((p) => ({
    id: `PAY-${String(p.payment_id).padStart(5, '0')}`,
    orderId: `ORD-${String(p.order_id).padStart(5, '0')}`,
    tableId: p.table_id,
    method: p.method,
    status: p.status,
    total: Number(p.total_payment || 0),
    time: p.payment_time
  }));
}

function normalizeMenusForUI(rows = []) {
  return rows.map((m) => ({
    id: `M-${String(m.id).padStart(3, '0')}`,
    _dbId: m.id,
    name: m.name,
    category: m.category,
    price: Number(m.price || 0),
    image: m.image || '',
    status: m.status || 'Active'
  }));
}

function normalizeCooksForUI(rows = []) {
  return rows.map((c) => ({
    id: c.id,
    _dbId: Number(String(c.id).replace('CK-', '')),
    name: c.name,
    shift: c.shift || 'Morning',
    status: c.status || 'Active'
  }));
}

function normalizeReviewsForUI(rows = []) {
  return rows.map((r) => ({
    id: r.review_id,
    order: `ORD-${String(r.order_id).padStart(5, '0')}`,
    menu: r.menu,
    rating: Number(r.rating || 0),
    comment: r.comment || '',
    time: r.time
  }));
}

async function syncAllFromDB() {
  try {
    const [orders, payments, menus, cooks, reviews, attendance] = await Promise.all([
      apiGet('/api/admin/orders'),
      apiGet('/api/admin/payments'),
      apiGet('/api/admin/menus'),
      apiGet('/api/admin/cooks'),
      apiGet('/api/admin/reviews'),
      apiGet('/api/admin/attendance')
    ]);

    store.write('orders', normalizeOrdersForUI(orders));
    store.write('payments', normalizePaymentsForUI(payments));
    store.write('menus', normalizeMenusForUI(menus));
    store.write('cooks', normalizeCooksForUI(cooks));
    store.write('reviews_admin', normalizeReviewsForUI(reviews));
    store.write('attendance', attendance || []);

    const rerenderFns = [
      'renderOrders', 'renderMenus', 'renderPayments', 'renderReviews',
      'renderCooks', 'renderAttendance', 'updateDashboard', 'loadProfile'
    ];
    for (const fn of rerenderFns) {
      if (typeof window[fn] === 'function') {
        try { window[fn](); } catch (_) { }
      }
    }
  } catch (err) {
    console.warn('DB sync failed:', err.message);
  }
}

function getOrders() { return store.read('orders'); }
function getPayments() { return store.read('payments'); }
function getMenus() { return store.read('menus'); }
function getCooks() { return store.read('cooks'); }
function getReviews() { return store.read('reviews_admin'); }
function getAttendance() { return store.read('attendance'); }

function saveMenus(nextMenus) {
  store.write('menus', nextMenus || []);
  for (const menu of (nextMenus || [])) {
    const payload = {
      name: menu.name,
      category: menu.category,
      price: Number(menu.price || 0),
      image: menu.image || '',
      status: menu.status || 'Active'
    };
    if (menu._dbId) {
      apiSend(`/api/admin/menus/${menu._dbId}`, 'PATCH', payload).catch(console.warn);
    } else {
      apiSend('/api/admin/menus', 'POST', payload).catch(console.warn);
    }
  }
  setTimeout(syncAllFromDB, 400);
}

function saveCooks(nextCooks) {
  store.write('cooks', nextCooks || []);
  for (const cook of (nextCooks || [])) {
    const payload = {
      name: cook.name,
      status: cook.status || 'Active'
    };
    if (cook._dbId) {
      apiSend(`/api/admin/cooks/${cook._dbId}`, 'PATCH', payload).catch(console.warn);
    } else {
      apiSend('/api/admin/cooks', 'POST', payload).catch(console.warn);
    }
  }
  setTimeout(syncAllFromDB, 400);
}

function adminSidebar(current = '') {
  const item = (href, label) => `<li><a href="${href}" class="rounded-2xl ${current === href ? 'bg-white shadow-sm font-bold text-orange-600' : ''}">${label}</a></li>`;
  return `
    <ul class="menu gap-2">
      ${item('dashboard_Admin.html', 'Dashboard')}
      ${item('menu-items.html', 'Menu Management')}
      ${item('orders.html', 'Orders')}
      ${item('payments.html', 'Payments')}
      ${item('reviews.html', 'Reviews')}
      ${item('profile.html', 'Profile')}
      ${item('attendance.html', 'Attendance')}
      ${item('cooks.html', 'Cooks')}
    </ul>
  `;
}

function requireStaff(role = 'admin') {
  const session = store.read('staff_session', null);
  if (!session) {
    const fallback = { role, name: 'Staff', loginAt: new Date().toISOString() };
    localStorage.setItem('staff_session', JSON.stringify(fallback));
    return fallback;
  }
  return session;
}

function logoutStaff() {
  localStorage.removeItem('staff_session');
  window.location.href = '/frontend/login/staff-login.html';
}

window.getOrders = getOrders;
window.getPayments = getPayments;
window.getMenus = getMenus;
window.saveMenus = saveMenus;
window.getCooks = getCooks;
window.saveCooks = saveCooks;
window.getReviews = getReviews;
window.getAttendance = getAttendance;
window.adminSidebar = adminSidebar;
window.requireStaff = requireStaff;
window.logoutStaff = logoutStaff;
window.API_BASE = API_BASE;
window.syncAllFromDB = syncAllFromDB;

syncAllFromDB();
setInterval(syncAllFromDB, 15000);

