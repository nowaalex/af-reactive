import globalState from "../globalState";

const runInAction = fn => {
    const prevObserver = globalState.reaction;
    globalState.reaction = null;
    globalState.inBatch++;
    fn();
    if( --globalState.inBatch === 0 && !globalState.isRunningReactions ){
        
        const list = globalState.pendingReactions;

        globalState.isRunningReactions = true;

        /* array is pre-allocated, so it is safe to neglect length */
        for( let reaction; reaction = list[ globalState.firstReactionIndex ]; globalState.firstReactionIndex++ ){
            list[ globalState.firstReactionIndex ] = null;
            reaction.pending = false;
            console.log( "ee", reaction.name );
            reaction.run();
            

            if( process.env.NODE_ENV !== "production" ){
                if( globalState.firstReactionIndex === 254 ){
                    throw new Error( "Reaction, which produces reaction, which produces reaction, etc. chain length must be < 255" );
                }
            }
        }

        globalState.lastReactionIndex = globalState.firstReactionIndex = 128;
        globalState.isRunningReactions = false;

        if( globalState.pendingUnobservations.length ){
            for( let observable of globalState.pendingUnobservations ){
                if( observable.isPendingUnobservation ){
                    observable.isPendingUnobservation = false;
                    observable.onBecomeUnobserved();
                }
            }
            globalState.pendingUnobservations = [];
        }
    }
    globalState.reaction = prevObserver;
}

export default runInAction;