document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("download-btn");

    // Load selected language and apply translations
    chrome.storage.sync.get("language", (data) => {
        const lang = data.language || "en";
        applyPopupTranslations(lang);
    });

    // Add click event to the download button
    downloadBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            const currentUrl = tabs[0].url;

            chrome.storage.sync.get(["baseUrl", "payloads","language"], (data) => {
                if (!data.baseUrl || !currentUrl.startsWith(data.baseUrl)) {
                    alert(getTranslation(data.language || "en", "notMatching"));
                    return;
                }
                // Extract the payloads
                const urlParams = new URLSearchParams(new URL(currentUrl).search);
                let preservedParams = "";
                if (data.payloads) {
                    data.payloads.split(",").forEach(param => {
                        param = param.trim();
                        if (urlParams.has(param)) {
                            preservedParams += `&${param}=${urlParams.get(param)}`;
                        }
                    });
                }

                // Convert URL, using tab title as filename
                const sanitizedTitle = tabs[0].title.replace(/[<>:"/\\|?*]/g, char => {
                    const unicodeMap = {
                        '<': '＜', // FULLWIDTH LESS-THAN SIGN (U+FF1C)
                        '>': '＞', // FULLWIDTH GREATER-THAN SIGN (U+FF1E)
                        ':': '：', // FULLWIDTH COLON (U+FF1A)
                        '"': '＂', // FULLWIDTH QUOTATION MARK (U+FF02)
                        '/': '／', // FULLWIDTH SOLIDUS (U+FF0F)
                        '\\': '＼', // FULLWIDTH REVERSE SOLIDUS (U+FF3C)
                        '|': '｜', // FULLWIDTH VERTICAL LINE (U+FF5C)
                        '?': '？', // FULLWIDTH QUESTION MARK (U+FF1F)
                        '*': '＊'  // FULLWIDTH ASTERISK (U+FF0A)
                    };
                    return unicodeMap[char] || char;
                });
                const newUrl = `${currentUrl.replace(/\?.*/, '')}output/${sanitizedTitle}.zip?download=zip&proto=true${preservedParams}`;

                // Trigger download
                chrome.downloads.download({ url: newUrl });
            });
        });
    });
});

// Function to apply translations to popup elements
function applyPopupTranslations(lang) {
    const elements = {
        "popup-title": "popupTitle",
        "download-btn": "download"
    };

    for (const id in elements) {
        document.getElementById(id).textContent = getTranslation(lang, elements[id]);
    }
}

// Function to get translations
function getTranslation(lang, key) {
    const translations = {
        en: {
            popupTitle: "Adobe Connect Downloader",
            download: "Download",
            notMatching: "The URL does not match the base URL!"
        },
        fa: {
            popupTitle: "Adobe Connect Downloader",
            download: "بارگیری",
            notMatching: "آدرس اینترنتی با آدرس پایه مطابقت ندارد!"
        }
    };
    return translations[lang][key] || key;
}
