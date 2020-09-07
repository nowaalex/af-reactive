const globalState = {
    reaction: null,
    inBatch: 0,
    isRunningReactions: false,

    /*
        Reactions can produce new reactions, so it is better to preallocate once
        and use reactionIndex as an indicator of a place to write new reaction.
    */
    lastReactionIndex: 128,
    firstReactionIndex: 128,
    pendingReactions: Array( 256 ).fill( null ),

    pendingUnobservations: []
}

export default globalState;