import test from 'ava'

import Random from '../../dist/index'

test('random.bates() produces numbers', (t) => {
    const r = new Random('ZDJjM2IyNmFlNmVjNWQwMGZkMmY1Y2Nk')
    const d = r.bates()
    for (let i = 0; i < 10000; ++i) {
        const v = d()
        t.is(typeof v, 'number')
    }
})
