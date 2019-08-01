
const LINK_PREFIX = 'https://www.google.com/search?q=';
const STORAGE_ITEM = 'allsearchengines';
const ENGINE_NAME = 'All engine search';


const trimPrefix = (str, prefix) => str.startsWith(prefix) ? str.slice(prefix.length) : str;

const searchRequest = (engine, request) => browser.search.search({ query: request, engine: engine.name });

function isSelectedEngine (engine) {
    try {
        let items = localStorage.getItem(STORAGE_ITEM);
        return items ? items.indexOf(engine.name) > -1 : true;
    } catch {}
    return false;
}

function processingRequest (requestDetails) {
    let request = trimPrefix(requestDetails.url, LINK_PREFIX);
    browser.search.get().then(engines => {
        for (engine of engines) {
            if(isSelectedEngine(engine) && engine.name !== ENGINE_NAME) {
                searchRequest(engine, request);
            }
        }
    });
}

chrome.webRequest.onBeforeRequest.addListener(processingRequest,
    {urls: [ LINK_PREFIX + "*"]},
    ["blocking"]
);