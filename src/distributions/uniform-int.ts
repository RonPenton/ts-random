import ow from 'ow'
import { Random } from '../random'

export default (random: Random, min: number, max: number) => {
    if (max === undefined) {
        max = (min === undefined ? 1 : min)
        min = 0
    }

    ow(min, ow.number.integer)
    ow(max, ow.number.integer)

    return () => {
        return (random.next() * (max - min + 1) + min) | 0
    }
}
