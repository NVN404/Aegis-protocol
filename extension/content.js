// Content script: Injects inpage.js into the web page context
try {
  const container = document.head || document.documentElement;
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.src = chrome.runtime.getURL("inpage.js");
  container.insertBefore(script, container.children[0]);
  script.onload = () => script.remove();
} catch (e) {
  console.error("[Aegis Content Script] Injection failed:", e);
}

// Forward messages from Inpage to Background Script
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || event.data.target !== "aegis-content") return;
  const { id, method, params } = event.data;

  chrome.runtime.sendMessage({ method, params, id }, (response) => {
    window.postMessage(
      {
        target: "aegis-inpage",
        id,
        result: response?.result,
        error: response?.error,
      },
      "*"
    );
  });
});
