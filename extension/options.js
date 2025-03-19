document.addEventListener("DOMContentLoaded", function () {
    const baseUrlInput = document.getElementById("base-url");
    const payloadsInput = document.getElementById("payloads");
    const languageSelect = document.getElementById("language");
    const saveBtn = document.getElementById("save-btn");

    // Load saved settings
    chrome.storage.sync.get(["baseUrl", "payloads", "language"], (data) => {
        if (data.baseUrl) baseUrlInput.value = data.baseUrl;
        if (data.payloads) payloadsInput.value = data.payloads;
        if (data.language) languageSelect.value = data.language;
        applyTranslations(data.language || "en");
    });

    // Save settings when the button is clicked
    saveBtn.addEventListener("click", () => {
        chrome.storage.sync.set({
            baseUrl: baseUrlInput.value,
            payloads: payloadsInput.value,
            language: languageSelect.value
        }, () => {
            alert(getTranslation(languageSelect.value, "settingsSaved"));
        });
    });

    // Change language dynamically when selecting a new language
    languageSelect.addEventListener("change", () => {
        applyTranslations(languageSelect.value);
    });
});

// Function to apply translations based on selected language
function applyTranslations(lang) {
    const elements = {
        "options-title": "optionsTitle",
        "base-url-label": "baseUrl",
        "payloads-label": "payloads",
        // "payloads-title": "payloads_title",
        "language-label": "language",
        "save-btn": "save"
    };

    // Set text direction based on language
    document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';

    for (const id in elements) {
        document.getElementById(id).textContent = getTranslation(lang, elements[id]);
    }
}

// Translation function
function getTranslation(lang, key) {
    const translations = {
        en: {
            optionsTitle: "Extension Options",
            baseUrl: "Base URL:",
            payloads: "Payloads to Keep:",
            payloads_title: "separate payloads with , like: id,username", 
            language: "Language:",
            save: "Save",
            settingsSaved: "Settings saved successfully!"
        },
        fa: {
            optionsTitle: "تنظیمات افزونه",
            baseUrl: "آدرس پایه:",
            payloads: "پارامتر های ضروری:",
            payloads_title: "پارامتر ها با , از هم جدا شوند، مانند : id,username",
            language: "زبان:",
            save: "ذخیره",
            settingsSaved: "تنظیمات با موفقیت ذخیره شد!"

        }

    };
    return translations[lang][key] || key;
}
