const globalState = {
    reaction: null,
    inBatch: 0,
    isRunningReactions: false,
    pendingReactions: [],
    pendingUnobservations: []
}

export default globalState;