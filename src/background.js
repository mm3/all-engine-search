
const LINK_PREFIX = 'https://www.google.com/search?q=';
const STORAGE_ITEM = 'allsearchengines';
const ENGINE_NAME = 'All engine search';

const trimPrefix = (str, prefix) => str.startsWith(prefix) ? decodeURIComponent(str.slice(prefix.length).replace(/\+/g, '%20')) : str;

const searchRequest = (engine, request) => browser.search.search({ query: request, engine: engine.name });

const isSelectedEngine = (engine) => {
    try {
        let items = localStorage.getItem(STORAGE_ITEM);
        return items ? items.indexOf(engine.name) > -1 : true;
    } catch {}
    return false;
};

const processing = (requestDetails) => {
    processingRequest(trimPrefix(requestDetails.url, LINK_PREFIX));
    return {cancel: true};
};

function processingRequest(request) {
    browser.search.get().then(engines => {
        for (engine of engines) {
            if(isSelectedEngine(engine) && engine.name !== ENGINE_NAME) {
                searchRequest(engine, request);
            }
        }
    });
}

chrome.webRequest.onBeforeRequest.addListener(processing,
    {urls: [ LINK_PREFIX + "*"]},
    ["blocking"]
);

browser.omnibox.onInputEntered.addListener(processingRequest);
