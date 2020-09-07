import globalState from "../globalState";

class Atom {

    reactions = [];
    observedTs = 0;
    isPendingUnobservation = false;

    reportChanged(){
        if( process.env.NODE_ENV !== "production" ){
            if( globalState.inBatch === 0 ){
                throw new Error( "All observable changes must be done inside runInAction" );
            }
        }
        for( let reaction of this.reactions ){
            if( reaction.pending === false ){
                reaction.pending = true;
                globalState.pendingReactions[ reaction.immediate ? --globalState.firstReactionIndex : globalState.lastReactionIndex++ ] = reaction;
            }
        }
    }

    reportObserved(){
        if( globalState.reaction ){
            this.observedTs = performance.now();
            const prevSize = this.reactions.length;
            globalState.reaction.atoms.add( this );
            this.isPendingUnobservation = false;

            if( !this.reactions.includes( globalState.reaction ) ){
                this.reactions[ globalState.reaction.immediate ? "unshift" : "push" ]( globalState.reaction );
                if( prevSize === 0 && this.onBecomeObserved ){
                    this.onBecomeObserved();
                }
            }
            
        }
    }

    _rm( reaction ){
        const idx = this.reactions.indexOf( reaction );
        if( idx !== -1 ){
            this.reactions.splice( idx, 1 );
            if( this.reactions.length === 0 && this.isPendingUnobservation === false && this.onBecomeUnobserved ){
                this.isPendingUnobservation = true;
                globalState.pendingUnobservations.push( this );
            }
        }
    }
}

export default Atom;