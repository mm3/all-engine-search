
const STORAGE_ITEM = 'allsearchengines';

const processSearchEngine = (engine) => {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute('value', engine.name);
    checkbox.checked = isSelectedEngine(engine);
    let label = document.createElement('label');
    label.appendChild(document.createTextNode(engine.name));
    document.getElementById("engines").appendChild(checkbox);
    document.getElementById("engines").appendChild(label);
    document.getElementById("engines").appendChild(document.createElement("BR"))
};

const isSelectedEngine = (engine) => {
    try {
        let items = localStorage.getItem(STORAGE_ITEM);
        return items ? items.indexOf(engine.name) > -1 : true;
    } catch {}
    return false;
};

const getSelectedEngines = () => {
    let result = [];
    for (engine of document.getElementsByTagName('input')) {
        if (engine.checked) {
            result.push(engine.value);
        }
    }
    return result;
};

const saveEngines = () => {
    try {
        localStorage.removeItem(STORAGE_ITEM);
    } catch {}
    localStorage.setItem(STORAGE_ITEM, getSelectedEngines());
};


document.getElementById("save").addEventListener("click", key => saveEngines());


browser.search.get().then(engines => {
    for (engine of engines) {
        if(engine.name !== 'All engine search') {
            processSearchEngine(engine);
        }
    }
});
