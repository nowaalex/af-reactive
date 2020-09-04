import Value from "../src/models/Value";
import runInAction from "../src/utils/runInAction";
import autorun from "../src/utils/autorun";

test( "Value get/set works", () => {
    const p = new Value( 1 );
    expect( p._v ).toBe( 1 );

    const results = [];

    const dispose = autorun(() => {
        results.push(p.get());
    });

    runInAction(() => {
        p.set( 10 );
        p.set( 20 );
    });

    expect( p._v ).toBe( 20 );
    expect( p.size ).toBe( 1 );

    expect( results ).toEqual([ 1, 20 ]);

    runInAction(() => {
        p.set( 10 );
    });

    runInAction(() => {
        p.set( 20 );
    });

    dispose();

    expect( p.size ).toBe( 0 );

    expect( results ).toEqual([ 1, 20, 10, 20 ]);
});