
const LINK_PREFIX = 'https://www.google.com/search?client=firefox-all&q=';
const STORAGE_ITEM = 'allsearchengines';
const ENGINE_NAME = 'All engine search';

const trimPrefix = (str, prefix) => decodeURIComponent(str.slice(prefix.length).replace(/\+/g, '%20'));

const searchRequest = (engine, request) => browser.search.search({ query: request, engine: engine.name });

const isSelectedEngine = (engine) => {
    if(engine.name === ENGINE_NAME) {
        return false;
    }
    try {
        let items = localStorage.getItem(STORAGE_ITEM);
        return items ? items.indexOf(engine.name) > -1 : true;
    } catch {}
    return false;
};

const processingRequest = (request) => browser.search.get()
    .then(engines => engines.filter(isSelectedEngine).reverse()
        .forEach(engine => searchRequest(engine, request))
    );

const onError = (error) => console.log(`Error: ${error}`);
const onSuccess = () => console.log(`complete`);

const closeTab = (tabId) => browser.tabs.remove(tabId).then(onSuccess, onError);

const processNavigateTab = (tab) => {
    if(tab.frameId === 0) {
        processingRequest(trimPrefix(tab.url, LINK_PREFIX));
        setTimeout(() => closeTab(tab.tabId), 100);
    }
};

const initNavigateTab = () => {
    if(!browser.webNavigation.onBeforeNavigate.hasListener(processNavigateTab)) {
        browser.webNavigation.onBeforeNavigate.addListener(processNavigateTab,
            {url: [{urlPrefix: LINK_PREFIX}]});
    }
};

const initOmnibox = () => {
    if(!browser.omnibox.onInputEntered.hasListener(processingRequest)) {
        browser.omnibox.onInputEntered.addListener(processingRequest);
    }
};

initNavigateTab();
initOmnibox();
