import Primitive from "../src/models/Primitive";
import Computed from "../src/models/Computed";
import Reaction from "../src/models/Reaction";
import runInAction from "../src/utils/runInAction";
import globalState from "../src/globalState";

test( "Computed shallow works", () => {

    const p = new Primitive( 1 );
    const p2 = new Primitive( 10 );
    
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
    expect( A.size ).toBe( 1 );
    expect( c.size ).toBe( 1 );
    expect( c._r.size ).toBe( 2 );
    expect( p.size ).toBe( 1 );

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
    const p1 = new Primitive( 2 );
    const p2 = new Primitive( 10 );

    let c1Runs = 0;
    let c2Runs = 0;
    
    const c1 = new Computed(() => {
        c1Runs++;
        return p1.get() * 5;
    }, "c1" );

    const c2 = new Computed(() => {
        c2Runs++;
        return c1.get() * p2.get();
    }, "c2" );

    const res = [];

    const A = new Reaction(() => {
        res.push(c2.get());
    });

    expect( c1Runs ).toBe( 0 );
    expect( c2Runs ).toBe( 0 );

    A.run();

    expect( c1Runs ).toBe( 1 );
    expect( c2Runs ).toBe( 1 );

    runInAction(() => {
        p1.set( 3 );
    });

    expect( c1Runs ).toBe( 2 );
    expect( c2Runs ).toBe( 2 );

    runInAction(() => {
        p2.set( 5 );
    })

    expect( res ).toEqual([ 100, 150, 75 ]);

    expect( c1Runs ).toBe( 2 );
    expect( c2Runs ).toBe( 3 );
});