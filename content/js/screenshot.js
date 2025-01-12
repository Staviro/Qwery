    
    //adding & fetching a JSON object with Qwery.js
    const qwery = new Qwery({ name: "app_data" }).create();
    const appInfo = {
        id: 1,
        OS: "Windows",
        key: "V1-3442-AFD3-5221"
    }
    //adding entry to the 'app-info' dataset
    qwery.add({ dataset: "app-info", data: appInfo});
    //fetching entry by id, from the 'app-info' dataset
    const item = qwery.get({ dataset: "app-info", field: "id", value: 1 });
    //item will be a JSON object if it is found
    /*
    {
        "id": 1,
        "OS": "Windows",
        "key": "V1-3442-AFD3-5221"
    }
    */    