import globalState from "../globalState";

class Reaction {
    constructor( fn, name = "Reaction", immediate ){

        this.fn = fn;
        this.atoms = new Set();
        this.immediate = !!immediate;

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
        for( let atom of this.atoms ){
            if( runTs > atom.observedTs ){
                atom._rm( this );
                this.atoms.delete( atom );
            }
        }
    }

    dispose(){
        for( let atom of this.atoms ){
            atom._rm( this );
        }
        this.atoms.clear();
    }
}

export default Reaction;