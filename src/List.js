// Extended JavaScript native Array class with handy methods.

class List extends Array {
    constructor(...args){
        super(...args);
    }

    most(){
        return this.slice(0, -1);
    }

    last(){
        return this[this.length - 1];
    }

    rest(){
        return this.slice(1);
    }

    sum() {
        if(!this.same(e => e.constructor)){
            throw Error('Sum: cannot be applied to elements with different type');
        }
        let Cons = this[0].constructor,
            func = (acc, n) => acc.add ? acc.add(n) : (acc + n);

        return this.reduce(func, new Cons());
    }

    same(func=(e) => e){
        return this.every((v, i, a) => func(v) === func(a[0]));
    }

    accum(accumFunc=e=>e){
        return this.reduce((acc, x) => {
            return acc.concat(acc.last() + accumFunc(x))
        }, List.from([0]))
    }

    transpose(func=(e)=>e){
        if((this[0].length) && (this[0].length > 0) && this.same(e => e.length)){
            let newList = this[0].map((_e, i) => {
                return func(this.map(e => e[i]));
            })
            return new List(...newList);
        } else throw Error('transpose: Invalid array dimension for transposing');
    }

    diff(diffFunc=e=>e){
        if (this.length < 2){
            throw Error('diff: at least two element to get a diff result');
        } 
        const list = List.from([this.most(), this.rest()]);
        return list.transpose(diffFunc);
    }

    // copy the list, and try to clone the elements if
    // a copy method exists.
    copy(){
        return this.map(e => e.copy ? e.copy() : e);
    }

}

module.exports = List;