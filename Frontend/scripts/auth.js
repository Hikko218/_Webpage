import { showSection } from "./sectionManagment.js";
import { showLoginSection } from "./sectionManagment.js";
import { showPopupReview, showPopupMessage, showPopupError } from "./popup.js";

// Event listeners for Admin login form
document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("adminUser");
    const passwordInput = document.getElementById("adminPass");
    const adminLogin = document.getElementById("adminLoginBtn");

    const username = usernameInput.value;
    const password = passwordInput.value;

    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for session management
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Login successful");
      adminLogin.innerHTML = "Logout";
      adminLogin.className = "logout-btn"; // Change button ID for logout
      adminLogin.onclick = () => {
        logoutAdmin();
      };
      showSection("home");

      usernameInput.value = ""; // Clear input fields
      passwordInput.value = "";
    } else {
      alert("Login failed");
    }
  });

// Logout function for admin
async function logoutAdmin() {
  const res = await fetch("http://localhost:3000/api/admin/logout", {
    method: "POST",
    credentials: "include", // Include cookies for session management
  });

  if (res.ok) {
    alert("Logout successful");
    const adminLogout = document.getElementById("adminLoginBtn");
    adminLogout.innerHTML = "Login";
    adminLogout.className = "topmenu"; // Change button ID back to login
    adminLogout.onclick = () => {
      showLoginSection("Login");
    };
    showSection("Home");
  } else {
    alert("Logout failed");
  }
}
