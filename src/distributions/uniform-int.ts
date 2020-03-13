import ow from "ow";
import Random from "../random";

function uniformInt(random: Random, min: number, max: number): () => number;
function uniformInt(random: Random, max: number): () => number;
function uniformInt(random: Random): () => number;
function uniformInt(random: Random, min?: number, max?: number): () => number {
    if (max === undefined) {
        max = (min ?? 1);
        min = 0;
    }
    if (min === undefined) {
        min = 0;
    }

    ow(min, ow.number.integer);
    ow(max, ow.number.integer);

    return () => {
        return (random.next() * (max! - min! + 1) + min!) | 0;
    };
};

export default uniformInt;
