import Primitive from "../models/Primitive";

const makeObservable = ( tgt, obj ) => {
    for( let k in obj ){
        const primitive = new Primitive( obj[ k ], k );
        Object.defineProperty( tgt, k, {
            get(){
                return primitive.get();
            },
            set( v ){
                return primitive.set( v );
            },
            writable: true,
            configurable: false
        });
    }
}

export default makeObservable;