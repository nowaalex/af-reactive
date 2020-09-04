import globalState from "../globalState";

class Reaction extends Set {
    constructor( fn, name = "reaction" ){
        super();
        this.fn = fn;

        /* used to prevent duplicates in general pending queue while using simple array instead of new Set. */
        this.pending = false;
        this.name = name;
    }

    run(){
        const prevObserver = globalState.reaction;
        globalState.reaction = this;
        const runTs = performance.now();        
        this.fn();
        globalState.reaction = prevObserver;
        for( let atom of this ){
            if( runTs > atom.observedTs ){
                atom._rm( this );
                this.delete( atom );
            }
        }
    }

    dispose(){
        for( let atom of this ){
            atom._rm( this );
        }
        this.clear();
    }
}

export default Reaction;