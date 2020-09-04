import Reaction from "../models/Reaction";

const autorun = ( fn, options ) => {
    const reaction = new Reaction( fn );
    reaction.run();
    return () => reaction.dispose();
};

export default autorun;