async function loadTranslations(lang) {
  const response = await fetch(`locales/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Cannot load locale file for ${lang}`);
  }
  return response.json();
}

async function applyTranslations() {
  const lang = getSelectedLanguage();
  try {
    const translations = await loadTranslations(lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) {
        el.setAttribute("placeholder", translations[key]);
      }
    });
  } catch (error) {
    console.error("Error applying translations:", error);
  }
}

function getSelectedLanguage() {
  return localStorage.getItem("preferredLanguage") || "en";
}

// Déclenche la traduction une fois le DOM chargé
document.addEventListener("DOMContentLoaded", applyTranslations);
