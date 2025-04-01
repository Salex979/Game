console.log("Background script запущен!");
chrome.runtime.onInstalled.addListener(() => {
    console.log("Расширение установлено");
});

chrome.storage.local.get(["token"], (data) => {
    if (data.token) {
        console.log("Пользователь уже авторизован");
    }
});
