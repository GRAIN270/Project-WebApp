const store = {
  read: (k, fallback = []) => {
    try {
      return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
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

function money(n) {
  return `${Number(n || 0).toFixed(2)} THB`;
}

function starText(stars) {
  const s = Math.max(0, Math.min(5, Number(stars || 0)));
  return `${'?'.repeat(s)}${'?'.repeat(5 - s)}`;
}

function statusBadge(status = '') {
  const key = String(status).toUpperCase();
  if (key === 'DONE' || key === 'SERVED' || key === 'READY' || key === 'PAID') return 'bg-green-100 text-green-700';
  if (key === 'COOKING' || key === 'SERVING') return 'bg-blue-100 text-blue-700';
  if (key === 'PENDING') return 'bg-amber-100 text-amber-700';
  if (key === 'CANCELLED' || key === 'FAILED') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
}

function setupAdminSidebar() {
  const container = document.getElementById('admin-sidebar');
  if (container && !container.innerHTML.trim()) {
    container.innerHTML = adminSidebar();
  }
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
      order_item_id: i.order_item_id,
      menu_id: i.menu_id,
      name: i.name,
      qty: Number(i.qty || 1),
      basePrice: Number(i.basePrice || 0),
      unitPrice: Number(i.unitPrice || 0),
      totalPrice: Number(i.totalPrice || 0),
      selectedOptions: i.selectedOptions || [],
      note: i.note || '',
      item_status: i.item_status
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

function normalizeMenuBundle(rows = []) {
  const isAddOnGroup = (name = '') => {
    const n = String(name || '').toLowerCase().trim();
    return (
      n.includes('add-on') ||
      n.includes('add on') ||
      n.includes('addon') ||
      n.includes('extra') ||
      n.includes('topping') ||
      n.includes('เพิ่ม') ||
      n.includes('ท็อปปิ้ง')
    );
  };

  const isMultiOptionGroup = (name = '') => {
    const n = String(name || '').toLowerCase().trim();
    return (
      n.includes('add-on') ||
      n.includes('add on') ||
      n.includes('addon') ||
      n.includes('extra') ||
      n.includes('topping') ||
      n.includes('เพิ่ม') ||
      n.includes('ท็อปปิ้ง')
    );
  };

  return (rows || []).map((cat) => ({
    key: String(cat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: cat.name,
    items: (cat.menus || []).map((m) => ({
      menu_id: m.menu_id,
      name: m.name,
      price: Number(m.price || 0),
      desc: m.name,
      image: m.image || 'https://placehold.co/600x400?text=Food',
      tag: cat.name,
      optionGroups: (m.option_groups || [])
        .filter((g) => !isAddOnGroup(g.name))
        .map((g) => ({
        type: g.type || (isMultiOptionGroup(g.name) ? 'multi' : 'choice'),
        name: g.name,
        options: (g.values || []).map((v, idx) => ({
          label: v.value,
          price: Number(v.price_add || 0),
          value_id: v.value_id,
          option_value_id: v.value_id,
          default: (g.type === 'multi' || isMultiOptionGroup(g.name))
            ? false
            : (Number(v.is_default || 0) === 1 || idx === 0)
        }))
      }))
    }))
  }));
}

async function syncAdminFromDB() {
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
}

async function syncCustomerMenuFromDB() {
  const menuBundle = await apiGet('/api/customer/menu');
  store.write('customer_menu_bundle', normalizeMenuBundle(menuBundle));
  return store.read('customer_menu_bundle', []);
}

function getCustomerSession() {
  return store.read('customer_session', null);
}

function requireCustomerSession() {
  const session = getCustomerSession();
  if (!session) {
    window.location.href = '/frontend/login/customer-login.html';
    return null;
  }
  return session;
}

async function syncCustomerOrdersFromDB() {
  const session = getCustomerSession();
  const tableId = Number(session?.table_id || 1);
  const rows = await apiGet(`/api/customer/orders?table_id=${tableId}`);
  const orders = (rows || []).map((o) => ({
    id: `ORD-${String(o.id).padStart(5, '0')}`,
    dbId: o.id,
    status: o.status,
    method: o.method || '-',
    paymentDetail: '',
    time: o.time ? new Date(o.time).toLocaleString() : '-',
    paidAt: o.paidAt || null,
    total: Number(o.total || 0),
    items: (o.items || []).map((i) => ({
      order_item_id: i.order_item_id,
      menu_id: i.menu_id,
      name: i.name,
      qty: Number(i.qty || 1),
      basePrice: Number(i.basePrice || 0),
      unitPrice: Number(i.unitPrice || 0),
      totalPrice: Number(i.totalPrice || 0),
      selectedOptions: i.selectedOptions || [],
      note: i.note || '',
      item_status: i.item_status
    }))
  }));
  store.write('customer_orders', orders);
  return orders;
}

async function syncAllFromDB() {
  try {
    await syncAdminFromDB();
  } catch (err) {
    console.warn('Admin DB sync failed:', err.message);
  }

  try {
    if (localStorage.getItem('customer_session')) {
      await Promise.all([syncCustomerMenuFromDB(), syncCustomerOrdersFromDB()]);
    }
  } catch (err) {
    console.warn('Customer DB sync failed:', err.message);
  }

  const rerenderFns = [
    'renderOrders', 'renderMenus', 'renderPayments', 'renderReviews',
    'renderCooks', 'renderAttendance', 'updateDashboard', 'loadProfile',
    'render'
  ];
  for (const fn of rerenderFns) {
    if (typeof window[fn] === 'function') {
      try { window[fn](); } catch (_) {}
    }
  }
}

function getOrders() { return store.read('orders'); }
function getPayments() { return store.read('payments'); }
function getMenus() { return store.read('menus'); }
function getCooks() { return store.read('cooks'); }
function getReviews() { return store.read('reviews_admin'); }
function getAttendance() { return store.read('attendance'); }
function getCustomerMenuBundle() { return store.read('customer_menu_bundle', []); }
function getCustomerOrders() { return store.read('customer_orders', []); }

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
  setTimeout(syncAllFromDB, 450);
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
  setTimeout(syncAllFromDB, 450);
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
    const fallback = { role, name: role === 'cook' ? 'Cook' : 'Admin', loginAt: new Date().toISOString() };
    store.write('staff_session', fallback);
    return fallback;
  }
  return session;
}

function logoutStaff() {
  localStorage.removeItem('staff_session');
  window.location.href = '/frontend/login/staff-login.html';
}

function getCart() {
  return store.read('cart', []);
}

function saveCart(next) {
  store.write('cart', next || []);
}

function norm(raw) {
  const selectedOptions = Array.isArray(raw?.selectedOptions) ? raw.selectedOptions : [];
  const qty = Math.max(1, Number(raw?.qty || 1));
  const menuIdFromLabel = String(raw?.id || '').startsWith('M-')
    ? Number(String(raw.id).replace('M-', ''))
    : 0;
  const basePrice = Number(raw?.basePrice ?? raw?.price ?? 0);
  const optionTotal = selectedOptions.reduce((sum, opt) => sum + Number(opt.price || 0), 0);
  const unitPrice = basePrice + optionTotal;
  return {
    menu_id: Number(raw?.menu_id || raw?.menuId || raw?._dbId || menuIdFromLabel || 0),
    name: raw?.name || raw?.itemName || 'Menu Item',
    image: raw?.image || '',
    qty,
    basePrice,
    unitPrice,
    totalPrice: unitPrice * qty,
    selectedOptions,
    note: String(raw?.note || '').trim()
  };
}

function normCart() {
  return getCart().map(norm);
}

function setQty(index, nextQty) {
  const cart = normCart();
  const qty = Math.max(1, Number(nextQty || 1));
  if (!cart[index]) return;
  cart[index].qty = qty;
  cart[index] = norm(cart[index]);
  saveCart(cart);
  updateBadges();
}

function itemNotes(item) {
  const lines = [];
  if (String(item?.note || '').trim()) lines.push(`Note: ${String(item.note).trim()}`);
  const optionLines = (item?.selectedOptions || []).map((opt) => {
    const pricePart = Number(opt.price || 0) > 0 ? ` (+${Number(opt.price).toFixed(2)})` : '';
    return `${opt.group || 'Option'}: ${opt.label}${pricePart}`;
  });
  return [...lines, ...optionLines];
}

function itemLabel(item) {
  return item?.name || item?.itemName || 'Menu Item';
}

function addBasicItem(item) {
  const cart = normCart();
  cart.push(norm({
    menu_id: item.menu_id,
    name: item.name,
    image: item.image,
    qty: 1,
    basePrice: Number(item.price || 0),
    selectedOptions: []
  }));
  saveCart(cart);
  updateBadges();
}

function updateBadges() {
  const count = normCart().reduce((sum, item) => sum + Number(item.qty || 0), 0);
  document.querySelectorAll('.js-cart-count').forEach((el) => {
    el.textContent = String(count);
  });
}

function getReview(reviewKey) {
  const map = store.read('review_map', {});
  return map[reviewKey] || null;
}

async function addReview(payload = {}) {
  const reviewKey = payload.reviewKey || `${payload.orderId || payload.order_id}-${payload.menuId || payload.menu_id}`;
  const orderId = Number(payload.orderId || payload.order_id || 0);
  const menuId = Number(payload.menuId || payload.menu_id || 0);
  const stars = Math.max(1, Math.min(5, Number(payload.stars || payload.rating || 0)));
  const text = String(payload.text || payload.comment || '').trim();
  if (!orderId || !menuId || !stars) throw new Error('orderId, menuId and stars are required');

  await apiSend('/api/customer/reviews', 'POST', {
    order_id: orderId,
    menu_id: menuId,
    rating: stars,
    comment: text
  });

  const map = store.read('review_map', {});
  map[reviewKey] = { stars, text, time: new Date().toLocaleString() };
  store.write('review_map', map);
  await syncCustomerOrdersFromDB();
  return map[reviewKey];
}

function menuReviews(menuName) {
  const orders = getCustomerOrders();
  const map = store.read('review_map', {});
  const rows = [];
  for (const order of orders) {
    for (const [idx, item] of (order.items || []).entries()) {
      if (String(item.name || '') !== String(menuName || '')) continue;
      const key = `${order.dbId}-${item.menu_id || idx}`;
      const review = map[key];
      if (review) rows.push({ ...review, itemName: item.name, itemLabel: item.name });
    }
  }
  return rows;
}

function avgReview(menuName) {
  const rows = menuReviews(menuName);
  if (!rows.length) return '0.0';
  const avg = rows.reduce((sum, r) => sum + Number(r.stars || 0), 0) / rows.length;
  return avg.toFixed(1);
}

async function pushOrder(method, info = {}) {
  const cart = normCart();
  if (!cart.length) return null;
  const session = requireCustomerSession();
  if (!session) return null;

  const invalidItems = cart.filter((item) => Number(item.menu_id || 0) <= 0);
  if (invalidItems.length) {
    const names = invalidItems.map((x) => x.name || 'Unknown').join(', ');
    throw new Error(`Some cart items are invalid. Please re-add: ${names}`);
  }

  const payload = {
    table_id: Number(session.table_id || 1),
    method,
    payment_detail: info.summary || '',
    items: cart.map((item) => ({
      menu_id: item.menu_id,
      qty: item.qty,
      note: item.note || '',
      selectedOptions: (item.selectedOptions || []).map((opt) => ({
        option_value_id: Number(opt.option_value_id || opt.value_id || 0)
      }))
    }))
  };

  const result = await apiSend('/api/customer/checkout', 'POST', payload);
  saveCart([]);
  updateBadges();
  await syncCustomerOrdersFromDB();
  return {
    id: `ORD-${String(result.order_id).padStart(5, '0')}`,
    dbId: result.order_id,
    total: Number(result.total_payment || 0)
  };
}

window.apiGet = apiGet;
window.apiSend = apiSend;
window.getOrders = getOrders;
window.getPayments = getPayments;
window.getMenus = getMenus;
window.saveMenus = saveMenus;
window.getCooks = getCooks;
window.saveCooks = saveCooks;
window.getReviews = getReviews;
window.getAttendance = getAttendance;
window.getCustomerMenuBundle = getCustomerMenuBundle;
window.getCustomerOrders = getCustomerOrders;
window.syncCustomerMenuFromDB = syncCustomerMenuFromDB;
window.syncCustomerOrdersFromDB = syncCustomerOrdersFromDB;
window.adminSidebar = adminSidebar;
window.setupAdminSidebar = setupAdminSidebar;
window.requireStaff = requireStaff;
window.logoutStaff = logoutStaff;
window.getCustomerSession = getCustomerSession;
window.requireCustomerSession = requireCustomerSession;
window.getCart = getCart;
window.saveCart = saveCart;
window.norm = norm;
window.normCart = normCart;
window.setQty = setQty;
window.itemNotes = itemNotes;
window.itemLabel = itemLabel;
window.addBasicItem = addBasicItem;
window.updateBadges = updateBadges;
window.getReview = getReview;
window.addReview = addReview;
window.menuReviews = menuReviews;
window.avgReview = avgReview;
window.pushOrder = pushOrder;
window.statusBadge = statusBadge;
window.money = money;
window.starText = starText;
window.API_BASE = API_BASE;
window.syncAllFromDB = syncAllFromDB;

syncAllFromDB();
setInterval(syncAllFromDB, 15000);
