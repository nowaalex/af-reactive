import globalState from "../globalState";

const runInAction = fn => {
    const prevObserver = globalState.reaction;
    globalState.reaction = null;
    globalState.inBatch++;
    fn();
    if( --globalState.inBatch === 0 && !globalState.isRunningReactions && globalState.pendingReactions.length ){
        globalState.isRunningReactions = true;
        for( let reaction of globalState.pendingReactions ){
            reaction.run();
            reaction.pending = false;
        }
        globalState.pendingReactions = [];
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