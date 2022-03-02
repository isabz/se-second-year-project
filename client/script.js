function datastring(object){
    for (const x in object){
        return x + ": " + object[x]
    }
}

function compare( a, b ) {
    if ( a.x < b.x){
        return -1;
    }
    if ( a.x > b.x ){
        return 1;
    }
    return 0;
}

    
function graphdata(array,str){
    let data = []
    for (let item in array){
        object = array[item];
        data.push({x: new Date(object.Year,0), y:object[str]})
    }

    data.sort(compare)
    console.log(data)
    return(data)
}