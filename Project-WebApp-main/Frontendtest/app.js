const CUSTOMER_KEY = "customerSession";
const STAFF_KEY = "staffSession";
const ADMIN_SIDEBAR_KEY = "adminSidebarOpen";

function saveCustomerSession(data) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data));
}

function getCustomerSession() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY));
  } catch {
    return null;
  }
}

function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_KEY);
}

function saveStaffSession(data) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
}

function getStaffSession() {
  try {
    return JSON.parse(localStorage.getItem(STAFF_KEY));
  } catch {
    return null;
  }
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

  saveCustomerSession({
    tableId,
    username,
    loginAt: new Date().toISOString()
  });

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
      saveStaffSession({
        role: "admin",
        id,
        loginAt: new Date().toISOString()
      });
      window.location.href = "../Admin/dashboard_Admin.html";
      return;
    }
    alert("Invalid admin ID or password");
    return;
  }

  if (role === "cook") {
    if (id === "cook01" && password === "1234") {
      saveStaffSession({
        role: "cook",
        id,
        loginAt: new Date().toISOString()
      });
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
  if (!(drawer instanceof HTMLInputElement)) return;

  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  let stored = null;

  try {
    stored = localStorage.getItem(ADMIN_SIDEBAR_KEY);
  } catch {
    stored = null;
  }

  if (stored === "1" || stored === "0") {
    drawer.checked = stored === "1";
  } else {
    drawer.checked = mediaQuery.matches;
  }

  const persist = () => {
    try {
      localStorage.setItem(ADMIN_SIDEBAR_KEY, drawer.checked ? "1" : "0");
    } catch {}
  };

  drawer.addEventListener("change", persist);
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
          <a href="${href}" class="rounded-2xl ${currentPage === href ? "bg-white shadow-sm" : ""}">
            ${label}
          </a>
        </li>
      `).join("")}
    </ul>
  `;
}