// check if url matches any key pattern in our defined regexes
// todo: fetch should refresh when a new url is saved
browser.storage.local.get('redirects').then((result) => {
    const extraInfoSpec = ["blocking"];
    browser.webRequest.onBeforeRequest.addListener(
        listener,
        {urls: Object.keys(result.redirects || {})}, 
        extraInfoSpec
    );
    browser.webRequest.onBeforeRequest.hasListener(listener);
});

function listener(details) {
    return browser.tabs.getCurrent().then((tab) => {
        const currentTab = tab.url;
        return browser.storage.local.get('redirects').then((result) => {
            const storedRedirects = result.redirects || {};
            const url = details.url;
            if (storedRedirects.hasOwnProperty(url)) {
                return { redirectUrl: storedRedirects[url] };
            }
            return { redirectUrl: undefined };
        });
    });
}
