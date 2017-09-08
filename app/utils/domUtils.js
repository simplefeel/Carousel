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
 * 获取object中指定key的值
 */

function get(object,key){
    return object === undefined ? undefined : object[key]
}

export {
    getPosition,
    get
}