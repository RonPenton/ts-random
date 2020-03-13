import ow from "ow";
import Random from "../random";

function uniform(random: Random, min: number, max: number): () => number;
function uniform(random: Random, max: number): () => number;
function uniform(random: Random): () => number;
function uniform(random: Random, min?: number, max?: number): () => number {
    if (max === undefined) {
        max = (min ?? 1);
        min = 0;
    }
    if (min === undefined) {
        min = 0;
    }

    ow(min, ow.number);
    ow(max, ow.number);

    return () => {
        return random.next() * (max! - min!) + min!;
    };
};

export default uniform;
