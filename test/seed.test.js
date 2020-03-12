import test from 'ava';

import random from '../dist/index';

test('random.clone with a seed is consistent', (t) => {
    const r1 = new random.Random('ZjExZDczNWQxY2NlZjUzYmRiZWU0ZGIz');
    const r2 = new random.Random('ZjExZDczNWQxY2NlZjUzYmRiZWU0ZGIz');

    for (let i = 0; i < 1000; ++i) {
        const n1 = r1.next();
        const n2 = r2.next();
        t.true(n1 == n2);
    }
})
