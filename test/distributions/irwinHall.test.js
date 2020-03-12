import test from 'ava'
import seedrandom from 'seedrandom'

import random from '../../dist/index'

test('random.irwinHall() produces numbers', (t) => {
    const r = new random.Random('ZDJjM2IyNmFlNmVjNWQwMGZkMmY1Y2Nk')
    const d = r.irwinHall()
    for (let i = 0; i < 10000; ++i) {
        const v = d()
        t.is(typeof v, 'number')
    }
})
