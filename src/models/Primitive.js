import Atom from "./Atom";

class Primitive extends Atom { 

    constructor( v, name = "primitive" ){
        super();
        this._v = v;
        this.name = name;
    }

    set( v ){
        if( this._v !== v ){
            this._v = v;
            this.reportChanged();
        }
    }

    get(){
        this.reportObserved();
        return this._v;
    }
}

export default Primitive;