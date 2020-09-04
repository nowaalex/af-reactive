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
        for( let j = 0, reaction; reaction = list[ j ]; j++ ){
            list[ j ] = null;
            reaction.pending = false;
            reaction.run();

            if( process.env.NODE_ENV !== "production" ){
                if( j === 254 ){
                    throw new Error( "Reaction, which produces reaction, which produces reaction, etc. chain length must be < 255" );
                }
            }
        }

        globalState.reactionIndex = 0;
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