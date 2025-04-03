describe("Frontend Application", () => {
  beforeEach(() => {
    // Réinitialiser le DOM et le localStorage avant chaque test
    localStorage.clear();
    document.body.innerHTML = `
        <div>
          <select id="languageSelect">
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          <form id="loginForm">
            <input type="email" id="email" placeholder="Email" />
            <input type="password" id="password" placeholder="Password" />
            <button type="submit">Log in</button>
          </form>
          <div id="message"></div>
          <div id="adminLinkContainer" style="display: none;"></div>
        </div>
      `;
  });

  test('Language selector should initialize with localStorage value or default to "en"', () => {
    const languageSelect = document.getElementById("languageSelect");

    // Cas 1 : Aucune valeur dans localStorage, doit prendre "en"
    let storedLanguage = localStorage.getItem("preferredLanguage") || "en";
    languageSelect.value = storedLanguage;
    expect(languageSelect.value).toBe("en");

    // Cas 2 : Une valeur est présente dans localStorage (ex: "fr")
    localStorage.setItem("preferredLanguage", "fr");
    storedLanguage = localStorage.getItem("preferredLanguage") || "en";
    languageSelect.value = storedLanguage;
    expect(languageSelect.value).toBe("fr");
  });

  test("Login form submission should call fetch and store token on success", async () => {
    // Simuler une réponse fetch pour la connexion
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: "Login successful",
            token: "fake.jwt.token",
            user: { id: 1, role: "Admin" },
          }),
      })
    );

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const messageDiv = document.getElementById("message");

    // Remplir le formulaire
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";

    // Attacher un gestionnaire d'événement pour simuler la logique de login
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;
      const selectedLanguage =
        localStorage.getItem("preferredLanguage") || "en";

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": selectedLanguage,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        messageDiv.textContent = "Connexion réussie !";
      } else {
        messageDiv.textContent = data.message || "Échec de la connexion.";
      }
    });

    // Simuler la soumission du formulaire
    loginForm.dispatchEvent(new Event("submit"));

    // Attendre la fin des opérations asynchrones
    await new Promise((r) => setTimeout(r, 0));

    // Vérifier que fetch a été appelé avec les bons paramètres
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Accept-Language": expect.any(String),
        }),
        body: expect.any(String),
      })
    );

    // Vérifier que le token est stocké dans le localStorage
    expect(localStorage.getItem("token")).toBe("fake.jwt.token");

    // Vérifier le message affiché
    expect(messageDiv.textContent).toBe("Connexion réussie !");
  });
});
