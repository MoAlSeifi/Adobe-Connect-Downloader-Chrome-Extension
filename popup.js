document.getElementById("downloadBtn").addEventListener("click", async () => {
    // Get user settings
    chrome.storage.sync.get(["baseUrl", "payloadParams"], async (data) => {
        if (!data.baseUrl || !data.payloadParams) {
            alert("Please set the base URL and payload parameters in options.");
            return;
        }

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url) {
            alert("No active tab found!");
            return;
        }

        const url = new URL(tab.url);

        // Check if the URL matches the base URL
        if (!url.href.startsWith(data.baseUrl)) {
            alert("Current URL does not match the configured base URL.");
            return;
        }

        const pathSegments = url.pathname.split("/");
        if (pathSegments.length < 2) {
            alert("Invalid WHC URL format.");
            return;
        }

        // Extract session ID
        const sessionID = pathSegments[1];

        // Extract and keep only specified payload parameters
        const params = new URLSearchParams(url.search);
        let newParams = new URLSearchParams();
        data.payloadParams.forEach(param => {
            if (params.has(param)) {
                newParams.append(param, params.get(param));
            }
        });

        // Construct new download URL
        const downloadUrl = `https://ac.whc.ir/${sessionID}/output/filename.zip?download=zip&proto=true&${newParams.toString()}`;
        console.log(`Downloading: ${downloadUrl}`);

        // Trigger download
        chrome.downloads.download({ url: downloadUrl, filename: "recording.zip" });
    });
});
