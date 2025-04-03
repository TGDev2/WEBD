const languageSelect = document.getElementById("languageSelect");

document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("preferredLanguage") || "en";
  languageSelect.value = storedLanguage;
});

languageSelect.addEventListener("change", () => {
  localStorage.setItem("preferredLanguage", languageSelect.value);
});

function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = "";

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    const selectedLanguage = getSelectedLanguage();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Succès : utilisateur créé
        registerMessage.textContent = data.message || "User registered!";
        window.location.href = "index.html";
      } else {
        // Échec : afficher le message d'erreur
        registerMessage.textContent =
          data.message || "Registration failed. Please try again.";
      }
    } catch (error) {
      console.error("Error during registration:", error);
      registerMessage.textContent =
        "An error occurred. Please try again later.";
    }
  });
});
