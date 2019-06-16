
var BOUND_OFFSET = 0.02;

class Radical {
    constructor(bound, upperLevelArea){
        this.reset(bound.map(v => v.copy()), upperLevelArea);
    }

    reset(bound, upperLevelArea){

        this.bound = bound ? bound : this.bound;

        this.centroid = toPolyCentroid(bound);
        this.torque = new Torque({});
        this.specs = [];
        this.strokes = [];
        this.children = [];
        this.areaRatio = upperLevelArea === undefined ? 1 : this.boundArea()/upperLevelArea;
    }

    boundArea(){
        return toPolyArea(toSegs(this.bound.concat(this.bound[0].copy())));
    }

    density(){
        return torqueSum(this.strokes.map(s => s.torque())).mass / this.boundArea();
    }

    updateTorque(){

        for (let child of this.children){
            child.updateTorque();
        }

        let childTorques = this.children.map(c => c.torque),
            strokeTorques = this.strokes.map(s => s.torque()),
            totalTorques = childTorques.concat(strokeTorques);

        this.torque = torqueSum(totalTorques);
        this.transStrokes(this.centroid.sub(this.torque.center));
    }

    allDescendants() {
        let res = [];
    
        for (let radical of this.children){
            res.push(...radical.allDescendants());
            res.push(radical);
        }
    
        return res;    
    }
    

    transStrokes(trans){
        this.allDescendants().map(e => e.strokes)
            .concat(this.strokes).flat()
            .forEach(e => e.trans(trans));
    }

    transBoundings(trans){
        this.allDescendants().map(e => e.bound)
            .concat(this.bound).flat()
            .forEach(e => e.iadd(trans));
    }

    correctPosition(){
        this.updateTorque();
        this.transBoundings(this.centroid.sub(this.torque.center));
    }

    addStrokeSpec(strokeSpec){
        this.specs.push(strokeSpec);
    }

    addStroke(strokeSpec, path=[]){

        let refs = this.getChildListByPath(path),
            ref = refs.last();

        strokeSpec.scale(Math.pow(ref.areaRatio, 0.25));

        ref.strokes.push(strokeSpec.toStroke());

        if(path.length === 0){
            this.bound = dilateBBox(toBBox(this.strokes.map(e => e.vecs).flat()), 0.1);
        }
    }

    hinge({prevIndex, prevPos, nextIndex, nextPos}){

        let prev = this.strokes[prevIndex],
            next = this.strokes[nextIndex],
            prevPoint = prev.pointAt(prevPos),
            nextPoint = next.pointAt(nextPos)

        next.trans(prevPoint.sub(nextPoint));

        // if(path.length === 0){
            this.bound = dilateBBox(toBBox(this.strokes.map(e => e.vecs).flat()), 0.1);
        // }

    }

    splitByStroke(){

        let thisArea = this.boundArea();

        for (let stroke of this.strokes)
            if(this.children.length === 0){
                let {left, right} = stroke.splitBound(this.bound);
                
                if(left.length > 0) this.children.push(new Radical(left, thisArea));
                if(right.length > 0) this.children.push(new Radical(right, thisArea));
            } else {
                let newChildren = [];
                while(this.children.length > 0 ) {
                    let {left, right} = stroke.splitBound(this.children.shift().bound);

                    if(left.length > 0) newChildren.push(new Radical(left, thisArea));
                    if(right.length > 0) newChildren.push(new Radical(right, thisArea));
                }
                this.children = newChildren;
            }

        this.children.forEach(child => child.shrink(BOUND_OFFSET));
    }

    getChildByPath(pathArray){
        let ref = this;
        while(pathArray.length > 0){
            ref = ref.children[pathArray.shift()];
        }
        return ref;
    }

    getChildListByPath(pathArray){
        let refs = [this];
        while(pathArray.length > 0){
            refs.push(refs.last().children[pathArray.shift()]);
        }
        return refs;
    }

    shrink(len){
        let centroid = toPolyCentroid(this.bound);
        
        let shrinked = [];
        for (let vec of this.bound) {
            let mag = vec.sub(centroid).mag();
            shrinked.push(vec.sub(centroid).mult((mag - len) / mag).add(centroid));
        }
    
        this.bound = shrinked;
    }
    
    do(operation, args){
        if(operation === 'addStroke'){
            let {name, path, ...rest} = args;
            // console.log("do, addStroke", name, path, rest,);
            this.addStroke(getStroke(name, rest), path);
        } else {
            this[operation](args);
        }
    }

    exec(program){
        for (let instruction of program){
            let {opname, ...rest} = instruction;
            this.do(opname, rest);
        }
    }

    draw(ctx, par){
        let den = this.density();
        if (den > 0) console.log(par, this.density());
        let color = {r: this.density(), g:0, b: 0};

        ctx.drawBound(this.bound, par, color);
        for (let stroke of this.strokes){
            stroke.draw(ctx);
        }
        for (let [index, child] of this.children.entries()){
            let label = par ? `${par}-${index}` : `${index}`;
            child.draw(ctx, label);
        }
    }
}