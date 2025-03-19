document.addEventListener("DOMContentLoaded", () => {
    const baseUrlInput = document.getElementById("baseUrl");
    const payloadParamsInput = document.getElementById("payloadParams");
    const saveBtn = document.getElementById("saveBtn");

    // Load saved settings
    chrome.storage.sync.get(["baseUrl", "payloadParams"], (data) => {
        if (data.baseUrl) baseUrlInput.value = data.baseUrl;
        if (data.payloadParams) payloadParamsInput.value = data.payloadParams.join(", ");
    });

    // Save settings
    saveBtn.addEventListener("click", () => {
        const baseUrl = baseUrlInput.value.trim();
        const payloadParams = payloadParamsInput.value.split(",").map(p => p.trim()).filter(p => p);

        chrome.storage.sync.set({ baseUrl, payloadParams }, () => {
            alert("Settings saved!");
        });
    });
});
