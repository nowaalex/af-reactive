import { useEffect, useRef, useReducer } from "react";
import Reaction from "../../models/Reaction";

const up = v => v + 1;

const useObserver = trackedFn => {
    
    const reactionRef = useRef();

    if( !reactionRef.current ){
        reactionRef.current = new Reaction( trackedFn );
    }

    useEffect(() => () => reactionRef.current.dispose());
}