import Value from "../src/models/Value";
import Computed from "../src/models/Computed";
import Reaction from "../src/models/Reaction";
import runInAction from "../src/utils/runInAction";
import globalState from "../src/globalState";

test( "Computed shallow works", () => {

    const p = new Value( 1 );
    const p2 = new Value( 10 );
    
    let cRuns = 0;

    const c = new Computed(() => {
        cRuns++;
        return p.get() * p2.get();
    }, "c" );

    runInAction(() => p.set( 3 ));

    runInAction(() => {
        p.set( 5 );
        p2.set( 100 );
    });

    expect( cRuns ).toBe( 0 );

    const res = [];

    const A = new Reaction(() => {
        res.push(c.get());
    }, "P" );

    A.run();

    expect( cRuns ).toBe( 1 );
    expect( res ).toEqual([ 500 ]);
    expect( A.atoms.size ).toBe( 1 );
    expect( c.reactions.length ).toBe( 1 );
    expect( c._r.atoms.size ).toBe( 2 );
    expect( p.reactions.length ).toBe( 1 );

    runInAction(() => p.set( 100 ));
    
    expect( cRuns ).toBe( 2 );

    expect( res ).toEqual([ 500, 10000 ]);

    runInAction(() => p.set( 1 ));

    expect( cRuns ).toBe( 3 );


    expect( res ).toEqual([ 500, 10000, 100 ]);

    runInAction(() => {
        p.set( 5 );
        p2.set( 6 );
    });

    expect( cRuns ).toBe( 4 );

    runInAction(() => {
        p.set( 5 );
    });

    expect( cRuns ).toBe( 4 );


    expect( res ).toEqual([ 500, 10000, 100, 30 ]);
    
});

test( "Computed deep works", () => {
    const p1 = new Value( 2 );
    const p2 = new Value( 10 );
    const p3 = new Value( 100 );

    let c1Runs = 0;
    let c2Runs = 0;
    let c3Runs = 0;
    
    const c1 = new Computed(() => {
        c1Runs++;
        return p1.get() * 5;
    }, "c1" );

    const c2 = new Computed(() => {
        c2Runs++;
        return c1.get() * p2.get();
    }, "c2" );

    const c3 = new Computed(() => {
        c3Runs++;
        return c2.get() * p3.get();
    }, "c3" );

    const res = [];

    const A = new Reaction(() => {
        res.push(c3.get());
    });

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 0, 0, 0 ]);

    A.run();

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 1, 1, 1 ]);

    runInAction(() => {
        p1.set( 3 );
    });

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 2, 2, 2 ]);
    
    runInAction(() => {
        p2.set( 5 );
    });

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 2, 3, 3 ]);

    expect( res ).toEqual([ 10000, 15000, 7500 ]);
});

test( "Computed deep with circlar dependencies works", () => {
    const p1 = new Value( 2 );
    const p2 = new Value( 10 );
    const p3 = new Value( 100 );

    let c1Runs = 0;
    let c2Runs = 0;
    let c3Runs = 0;
    
    const c1 = new Computed(() => {
        c1Runs++;
        return c2.get() * p2.get() * p1.get();
    }, "c1" );

    const c2 = new Computed(() => {
        c2Runs++;
        return p1.get() * 5;
    }, "c2" );

    const c3 = new Computed(() => {
        c3Runs++;
        return c2.get() * p1.get() * c1.get();
    }, "c3" );

    /*
        c1: 10 * 10 * 2 = 200;
        c2: 2 * 5 = 10;
        c3: 10 * 2 * 200 = 4000;
    */

    const res = [];

    const A = new Reaction(() => {
        res.push(c3.get());
    });

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 0, 0, 0 ]);
console.log( "DDDDDD")
    A.run();

    expect( res ).toEqual([ 4000 ]);
    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 1, 1, 1 ]);

    runInAction(() => {
        p1.set( 5 );
    });

    /*
        c1: 25 * 10 * 5 = 1250;
        c2: 5 * 5 = 25;
        c3: 25 * 5 * 1250 = 156250;
    */

    expect( res ).toEqual([ 4000, 156250 ]);

    expect([ c1Runs, c2Runs, c3Runs ]).toEqual([ 2, 2, 2 ]);
});