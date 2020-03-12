import ow from "ow";
import Random from "../random";

export default (random: Random, n = 1, p = 0.5) => {
    ow(n, ow.number.positive.integer);
    ow(p, ow.number.greaterThanOrEqual(0).lessThanOrEqual(1));

    return () => {
        let i = 0;
        let x = 0;

        while (i++ < n) {
            if (random.next() < p) {
                x += 1;
            }
        }

        return x;
    };
};
