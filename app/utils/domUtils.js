/**
 * 获取元素的实时位置
 * @param {*} event 
 */
function getPosition(event){
    if(!_.isNil(_.get(event,'touches'))){
        const {pageX , pageY} = _.head(event.touches);
        return {
            x: pageX,
            y: pageY
        }
    }

    return{
        x: _.get(event,'clientX'),
        y: _.get(event,'clientY')
    }
}

/**
 * 以下所有的方法借鉴于lodash/underscore，部分有所精简
 */

/**
 * 获取object中指定key的值
 */

function get(object,key){
    return object === undefined ? undefined : object[key]
}
/**
 * 统计数组的长度,忽略类数组的情况
 * @param {} collection 
 */
function size(collection){
    if(collection == null){
        return 0
    }
    if(!Array.isArray(collection)){
        return 0
    }
    return collection.length
}
/**
 * 返回没有指定keys的值的对象副本
 * @param {*} object 
 * @param {*} keys 
 */
function omit(object,keys){
    var temp = [];
    for(var o in object){
        keys.toString().indexOf(o) === -1 ? temp.push(object[o]) : null
    }
    return temp
}
/**
 * 返回数组的第一个元素
 * @param {*数组} array 
 */
function head(array){
    if(array == null) return void 0;
    return [].slice.call(array,0,1)
}

function last(array){
    if(array == null) return void 0;
    return [].slice.call(array,-1)
}

function isEmpty(){

}

export {
    getPosition,
    get,
    size,
    head,
    last,
    isEmpty,
    omit
}