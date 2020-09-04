import Atom from "./Atom";
import Reaction from "./Reaction";
import runInAction from "../utils/runInAction";

const FLAG_OBSERVED = 1;
const FLAG_NOT_FIRST_RUN = 2;

class Computed extends Atom {

    constructor( getValue, name = "computed" ){
        super();

        this._m = 0;
        this._v = undefined;
        this._g = getValue;
        this.name = name;
        
        this._r = new Reaction(() => {
            const v = getValue();
            if( this._m & FLAG_NOT_FIRST_RUN ){
                if( this._v !== v ){
                    this._v = v;
                    runInAction(() => {
                        this.reportChanged();
                    });
                }
            }
            else {
                this._v = v;
                this._m |= FLAG_NOT_FIRST_RUN;
            }
        }, `reaction_${name}` );
    }

    onBecomeObserved(){
        this._m |= FLAG_OBSERVED;
        this._r.run();
    }

    onBecomeUnobserved(){
        this._m = 0;
        this._r.dispose();
    }

    get(){
        this.reportObserved();
        return this._m & FLAG_OBSERVED ? this._v : this._g();
    }
}

export default Computed;