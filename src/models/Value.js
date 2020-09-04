import Atom from "./Atom";

class Value extends Atom { 

    constructor( v, name = "Value" ){
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

export default Value;