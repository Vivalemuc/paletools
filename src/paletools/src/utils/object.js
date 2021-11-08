export function getObjectPropertyValueByPath(obj, path){
    let value = obj;
    for(let subPath of path.split('.')){
        value = value[subPath];
    }
    return value;
}

export function setObjectPropertyByPath(obj, path, value) {
    var schema = obj;
    var pList = path.split('.');
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
}