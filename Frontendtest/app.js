const CUSTOMER_KEY = "customerSession";
const STAFF_KEY = "staffSession";
const ADMIN_SIDEBAR_KEY = "adminSidebarOpen";

// ===== ระบบ Session และ Login =====
function saveCustomerSession(data) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data));
}
function getCustomerSession() {
  try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)); } catch (e) { return null; }
}
function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_KEY);
}

function saveStaffSession(data) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
}
function getStaffSession() {
  try { return JSON.parse(localStorage.getItem(STAFF_KEY)); } catch (e) { return null; }
}
function clearStaffSession() {
  localStorage.removeItem(STAFF_KEY);
}

function requireCustomer() {
  const session = getCustomerSession();
  if (!session) {
    window.location.href = "../Login/customer-login.html";
    return null;
  }
  return session;
}

// ตรวจสอบอย่างรัดกุม ถ้าไม่มี Session ให้เด้งไปหน้า Login ทันที
function requireStaff(role) {
  const session = getStaffSession();
  if (!session) {
    window.location.href = "../Login/staff-login.html";
    return null;
  }
  if (role && session.role !== role) {
    window.location.href = "../Login/staff-login.html";
    return null;
  }
  return session;
}

function customerLogin() {
  const tableId = document.getElementById("tableId")?.value.trim();
  const username = document.getElementById("customerName")?.value.trim();
  if (!tableId || !username) {
    alert("Please enter table ID and username");
    return;
  }
  saveCustomerSession({ tableId, username, loginAt: new Date().toISOString() });
  window.location.href = "../User/customer-dashboard.html";
}

function staffLogin(role) {
  const id = document.getElementById("staffId")?.value.trim();
  const password = document.getElementById("staffPassword")?.value.trim();
  if (!id || !password) {
    alert("Please enter staff ID and password");
    return;
  }
  if (role === "admin") {
    if (id === "admin01" && password === "1234") {
      saveStaffSession({ role: "admin", id, loginAt: new Date().toISOString() });
      window.location.href = "../Admin/dashboard_Admin.html";
      return;
    }
    alert("Invalid admin ID or password");
    return;
  }
  if (role === "cook") {
    if (id === "cook01" && password === "1234") {
      saveStaffSession({ role: "cook", id, loginAt: new Date().toISOString() });
      window.location.href = "../Cook/dashboard_Cook.html";
      return;
    }
    alert("Invalid cook ID or password");
  }
}

function logoutCustomer() {
  clearCustomerSession();
  window.location.href = "../Login/customer-login.html";
}

function logoutStaff() {
  clearStaffSession();
  window.location.href = "../Login/staff-login.html";
}

// ===== Header & Sidebar =====
function setCustomerHeader() {
  const customer = getCustomerSession();
  if (!customer) return;
  const welcome = document.getElementById("welcomeName");
  const table = document.getElementById("tableBadge");
  if (welcome) welcome.textContent = `Hi, ${customer.username}`;
  if (table) table.textContent = `Table ${customer.tableId}`;
}

function setCookHeader() {
  const staff = getStaffSession();
  const badge = document.getElementById("cookBadge");
  if (staff && badge) badge.textContent = `Cook: ${staff.id}`;
}

function setupAdminSidebar() {
  const drawer = document.getElementById("admin-drawer");
  if (!drawer) return;
  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  let stored = null;
  try { stored = localStorage.getItem(ADMIN_SIDEBAR_KEY); } catch (e) {}
  if (stored === "1" || stored === "0") {
    drawer.checked = stored === "1";
  } else {
    drawer.checked = mediaQuery.matches;
  }
  drawer.addEventListener("change", () => {
    try { localStorage.setItem(ADMIN_SIDEBAR_KEY, drawer.checked ? "1" : "0"); } catch (e) {}
  });
}

function adminSidebar(currentPage) {
  const pages = [
    ["dashboard_Admin.html", "Dashboard"],
    ["menu-items.html", "Menu Management"],
    ["orders.html", "Orders"],
    ["payments.html", "Payments"],
    ["reviews.html", "Reviews"],
    ["profile.html", "Profile"],
    ["attendance.html", "Attendance"],
    ["cooks.html", "Cooks"]
  ];
  return `
    <ul class="menu gap-2">
      ${pages.map(([href, label]) => `
        <li>
          <a href="${href}" class="rounded-2xl ${currentPage === href ? "bg-white shadow-sm font-bold text-orange-600" : ""}">
            ${label}
          </a>
        </li>
      `).join("")}
    </ul>
  `;
}

// ===== LocalStorage =====
function getOrders(){return JSON.parse(localStorage.getItem("orders")||"[]")}
function saveOrders(o){localStorage.setItem("orders",JSON.stringify(o))}
function statusBadge(status){
  if(status==="PENDING") return "bg-amber-100 text-amber-700 border-0";
  if(status==="COOKING") return "bg-orange-100 text-orange-700 border-0";
  if(status==="DONE" || status==="SERVED") return "bg-green-100 text-green-700 border-0";
  return "badge-ghost";
}

function getCooks() {
  const defaultCooks = [
    { id: "CK-01", name: "Kan", shift: "Morning", status: "Active" },
    { id: "CK-02", name: "May", shift: "Afternoon", status: "Active" }
  ];
  return JSON.parse(localStorage.getItem("admin_cooks")) || defaultCooks;
}
function saveCooks(data) { localStorage.setItem("admin_cooks", JSON.stringify(data)); }

function getMenus() {
  const defaultMenus = [
    { id: "M-01", name: "Whopper Style Burger", category: "Burgers", price: 149, status: "Active" },
    { id: "M-02", name: "Chicken Rice Bowl", category: "Rice Dishes", price: 79, status: "Active" }
  ];
  return JSON.parse(localStorage.getItem("admin_menus")) || defaultMenus;
}
function saveMenus(data) { localStorage.setItem("admin_menus", JSON.stringify(data)); }

function getReviews() {
  return JSON.parse(localStorage.getItem("admin_reviews")) || [];
}
function saveReviews(data) { localStorage.setItem("admin_reviews", JSON.stringify(data)); }