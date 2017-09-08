import uuid from 'uuid'
export default (arg = [])=>{
    arg.map((ary,index)=>{
        if(Object.prototype.toString.call(ary) != '[object Object]'){
            return
        }
        ary['key'] = uuid.v4();
    })
    return arg;
};
