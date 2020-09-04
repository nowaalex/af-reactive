import globalState from "../globalState";

class Atom extends Set {

    observedTs = 0;
    isPendingUnobservation = false;

    reportChanged(){
        if( process.env.NODE_ENV !== "production" ){
            if( globalState.inBatch === 0 ){
                throw new Error( "All observable changes must be done inside runInAction" );
            }
        }
        for( let reaction of this ){
            if( reaction.pending === false ){
                reaction.pending = true;
                globalState.pendingReactions[ globalState.reactionIndex++ ] = reaction;
            }
        }
    }

    reportObserved(){
        if( globalState.reaction ){
            this.observedTs = performance.now();
            const prevSize = this.size;
            globalState.reaction.add( this );
            this.add( globalState.reaction );
            this.isPendingUnobservation = false;
            if( prevSize === 0 && this.onBecomeObserved ){
                this.onBecomeObserved();
            }
        }
    }

    _rm( reaction ){
        if( this.delete( reaction ) && this.size === 0 && this.isPendingUnobservation === false && this.onBecomeUnobserved ){
            this.isPendingUnobservation = true;
            globalState.pendingUnobservations.push( this );
        }
    }
}

export default Atom;