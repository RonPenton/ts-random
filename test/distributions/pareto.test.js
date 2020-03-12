import test from 'ava'
import seedrandom from 'seedrandom'

import Random from '../../dist/index'

test('random.pareto() produces numbers', (t) => {
    const r = new Random('ZDJjM2IyNmFlNmVjNWQwMGZkMmY1Y2Nk')
    const d = r.pareto()
    for (let i = 0; i < 10000; ++i) {
        const v = d()
        t.is(typeof v, 'number')
    }
})
