const languageSelect = document.getElementById("languageSelect");

document.addEventListener("DOMContentLoaded", async () => {
  const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
  languageSelect.value = storedLanguage;
});

languageSelect.addEventListener("change", () => {
  localStorage.setItem("preferredLanguage", languageSelect.value);
  location.reload();
});

function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

document.addEventListener("DOMContentLoaded", async () => {
  const roleWarningDiv = document.getElementById("roleWarning");
  const createUserForm = document.getElementById("createUserForm");
  const usersListDiv = document.getElementById("usersList");

  const token = localStorage.getItem("token");
  if (!token) {
    roleWarningDiv.textContent = "Please log in first.";
    createUserForm.style.display = "none";
    return;
  }

  let userRole;
  try {
    const payload = parseJwt(token);
    userRole = payload.role;
  } catch (error) {
    console.error("Invalid token:", error);
    roleWarningDiv.textContent = "Invalid token. Please log in again.";
    createUserForm.style.display = "none";
    return;
  }

  // Seul un Admin peut accéder à cette page
  if (userRole !== "Admin") {
    roleWarningDiv.textContent =
      "You are not authorized to manage users. Only Admin can access this page.";
    createUserForm.style.display = "none";
    return;
  }

  // Charger la liste des utilisateurs
  await loadUsers();

  // Gestion de la création d'utilisateur
  createUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createUser();
    createUserForm.reset();
    await loadUsers();
  });

  // =====================
  // Fonctions utilitaires
  // =====================
  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  async function loadUsers() {
    usersListDiv.innerHTML = "Loading users...";

    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch("/api/auth/users", {
        method: "GET",
        headers: {
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const users = data.users || [];

      usersListDiv.innerHTML = "";
      if (users.length === 0) {
        usersListDiv.textContent = "No users found.";
        return;
      }

      users.forEach((user) => {
        const userContainer = document.createElement("div");
        userContainer.classList.add("event-item"); // Simple réutilisation du style
        userContainer.style.marginBottom = "10px";

        const userInfo = document.createElement("p");
        userInfo.innerHTML = `<strong>Email:</strong> ${user.email} <br/> <strong>Role:</strong> ${user.role}`;

        // Bouton modifier (changement de rôle)
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit role";
        editBtn.addEventListener("click", () => {
          const newRole = prompt(
            "Enter new role (Admin, EventCreator, User, Basic):",
            user.role
          );
          if (!newRole) return;
          updateUser(user.id, { role: newRole });
        });

        // Bouton supprimer
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => {
          if (confirm(`Are you sure to delete user ${user.email}?`)) {
            deleteUser(user.id);
          }
        });

        userContainer.appendChild(userInfo);
        userContainer.appendChild(editBtn);
        userContainer.appendChild(deleteBtn);

        usersListDiv.appendChild(userContainer);
      });
    } catch (error) {
      console.error(error);
      usersListDiv.textContent = "Error fetching users.";
    }
  }

  async function createUser() {
    const userEmail = document.getElementById("userEmail").value.trim();
    const userPassword = document.getElementById("userPassword").value.trim();
    const userRole = document.getElementById("userRole").value;

    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      console.log("User created successfully.");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user. Check console for details.");
    }
  }

  async function updateUser(userId, updateData) {
    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      await loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Check console for details.");
    }
  }

  async function deleteUser(userId) {
    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Check console for details.");
    }
  }
});
