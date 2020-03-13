import ow from "ow";

import uniform from "./distributions/uniform";
import uniformInt from "./distributions/uniform-int";
import uniformBoolean from "./distributions/uniform-boolean";

import normal from "./distributions/normal";
import logNormal from "./distributions/log-normal";

import bernoulli from "./distributions/bernoulli";
import binomial from "./distributions/binomial";
import geometric from "./distributions/geometric";

import poisson from "./distributions/poisson";
import exponential from "./distributions/exponential";

import irwinHall from "./distributions/irwin-hall";
import bates from "./distributions/bates";
import pareto from "./distributions/pareto";

import seedrandom from "seedrandom";

/**
 * Seedable random number generator supporting many common distributions.
 *
 * Defaults to Math.random as its underlying pseudorandom number generator.
 *
 * @name Random
 * @class
 *
 * @param {RNG|function} [rng=Math.random] - Underlying pseudorandom number generator.
 */
export default class Random {

    private _generator: seedrandom.prng;
    private _cache: { [key: string]: { key: string; distribution: Function } };

    constructor(seed: string) {
        ow(seed, ow.string);
        this._cache = {};
        this._generator = seedrandom(seed);
    }

    // --------------------------------------------------------------------------
    // Uniform utility functions
    // --------------------------------------------------------------------------

    /**
     * Convenience wrapper around `this.rng.next()`
     *
     * Returns a floating point number in [0, 1).
     *
     * @return {number}
     */
    next() {
        return this._generator();
    }

    /**
     * Samples a uniform random floating point number, optionally specifying
     * lower and upper bounds.
     *
     * Convence wrapper around `random.uniform()`
     *
     * @param {number} [min=0] - Lower bound (float, inclusive)
     * @param {number} [max=1] - Upper bound (float, exclusive)
     * @return {number}
     */
    float(): number;
    float(max: number): number;
    float(min: number, max: number): number;
    float(min?: number, max?: number): number {
        return this.uniform(min!, max!)();
    }

    /**
     * Samples a uniform random integer, optionally specifying lower and upper
     * bounds.
     *
     * Convence wrapper around `random.uniformInt()`
     *
     * @param {number} [min=0] - Lower bound (integer, inclusive)
     * @param {number} [max=1] - Upper bound (integer, inclusive)
     * @return {number}
     */
    int(): number;
    int(max: number): number;
    int(min: number, max: number): number;
    int(min?: number, max?: number): number {
        return this.uniformInt(min!, max!)();
    }

    /**
     * Samples a uniform random boolean value.
     *
     * Convence wrapper around `random.uniformBoolean()`
     *
     * @alias `random.boolean`
     *
     * @return {boolean}
     */
    boolean() {
        return this.uniformBoolean()();
    }

    // --------------------------------------------------------------------------
    // Uniform distributions
    // --------------------------------------------------------------------------

    /**
     * Generates a [Continuous uniform distribution](https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)).
     *
     * @param {number} [min=0] - Lower bound (float, inclusive)
     * @param {number} [max=1] - Upper bound (float, exclusive)
     * @return {function}
     */
    uniform(): () => number;
    uniform(max: number): () => number;
    uniform(min: number, max: number): () => number;
    uniform(min?: number, max?: number) {
        return this._memoize("uniform", uniform, min, max);
    }

    /**
     * Generates a [Discrete uniform distribution](https://en.wikipedia.org/wiki/Discrete_uniform_distribution).
     *
     * @param {number} [min=0] - Lower bound (integer, inclusive)
     * @param {number} [max=1] - Upper bound (integer, inclusive)
     * @return {function}
     */
    uniformInt(): () => number;
    uniformInt(max: number): () => number;
    uniformInt(min: number, max: number): () => number;
    uniformInt(min?: number, max?: number) {
        return this._memoize("uniformInt", uniformInt, min, max);
    }

    /**
     * Generates a [Discrete uniform distribution](https://en.wikipedia.org/wiki/Discrete_uniform_distribution),
     * with two possible outcomes, `true` or `false.
     *
     * This method is analogous to flipping a coin.
     *
     * @return {function}
     */
    uniformBoolean() {
        return this._memoize("uniformBoolean", uniformBoolean);
    }

    // --------------------------------------------------------------------------
    // Normal distributions
    // --------------------------------------------------------------------------

    /**
     * Generates a [Normal distribution](https://en.wikipedia.org/wiki/Normal_distribution).
     *
     * @param {number} [mu=0] - Mean
     * @param {number} [sigma=1] - Standard deviation
     * @return {function}
     */
    normal(mu?: number, sigma?: number) {
        return normal(this, mu, sigma);
    }

    /**
     * Generates a [Log-normal distribution](https://en.wikipedia.org/wiki/Log-normal_distribution).
     *
     * @param {number} [mu=0] - Mean of underlying normal distribution
     * @param {number} [sigma=1] - Standard deviation of underlying normal distribution
     * @return {function}
     */
    logNormal(mu?: number, sigma?: number) {
        return logNormal(this, mu, sigma);
    }

    // --------------------------------------------------------------------------
    // Bernoulli distributions
    // --------------------------------------------------------------------------

    /**
     * Generates a [Bernoulli distribution](https://en.wikipedia.org/wiki/Bernoulli_distribution).
     *
     * @param {number} [p=0.5] - Success probability of each trial.
     * @return {function}
     */
    bernoulli(p?: number) {
        return bernoulli(this, p);
    }

    /**
     * Generates a [Binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution).
     *
     * @param {number} [n=1] - Number of trials.
     * @param {number} [p=0.5] - Success probability of each trial.
     * @return {function}
     */
    binomial(n?: number, p?: number) {
        return binomial(this, n, p);
    }

    /**
     * Generates a [Geometric distribution](https://en.wikipedia.org/wiki/Geometric_distribution).
     *
     * @param {number} [p=0.5] - Success probability of each trial.
     * @return {function}
     */
    geometric(p?: number) {
        return geometric(this, p);
    }

    // --------------------------------------------------------------------------
    // Poisson distributions
    // --------------------------------------------------------------------------

    /**
     * Generates a [Poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution).
     *
     * @param {number} [lambda=1] - Mean (lambda > 0)
     * @return {function}
     */
    poisson(lambda?: number) {
        return poisson(this, lambda);
    }

    /**
     * Generates an [Exponential distribution](https://en.wikipedia.org/wiki/Exponential_distribution).
     *
     * @param {number} [lambda=1] - Inverse mean (lambda > 0)
     * @return {function}
     */
    exponential(lambda?: number) {
        return exponential(this, lambda);
    }

    // --------------------------------------------------------------------------
    // Misc distributions
    // --------------------------------------------------------------------------

    /**
     * Generates an [Irwin Hall distribution](https://en.wikipedia.org/wiki/Irwin%E2%80%93Hall_distribution).
     *
     * @param {number} [n=1] - Number of uniform samples to sum (n >= 0)
     * @return {function}
     */
    irwinHall(n?: number) {
        return irwinHall(this, n);
    }

    /**
     * Generates a [Bates distribution](https://en.wikipedia.org/wiki/Bates_distribution).
     *
     * @param {number} [n=1] - Number of uniform samples to average (n >= 1)
     * @return {function}
     */
    bates(n?: number) {
        return bates(this, n);
    }

    /**
     * Generates a [Pareto distribution](https://en.wikipedia.org/wiki/Pareto_distribution).
     *
     * @param {number} [alpha=1] - Alpha
     * @return {function}
     */
    pareto(alpha?: number) {
        return pareto(this, alpha);
    }

    chance(percent: number) {
        return this.float(0, 100) < percent;
    };

    chanceEach<T>(percent: number, items: T[]) {
        const ret: T[] = [];
        items.forEach(x => this.chance(percent) ? ret.push(x) : null);
        return ret;
    }

    pick<T>(items: T[]) {
        return items[this.int(0, items.length - 1)];
    }

    pickWeighted<T>(items: { item: T; probability: number }[]) {
        const sum = items.reduce((acc, val) => acc + val.probability, 0);
        const val = this.int(0, sum);
        let prob = 0;
        for (const item of items) {
            prob += item.probability;
            if (val < prob) {
                return item.item;
            }
        }

        throw new Error("Something went wrong. This should never happen.");
    }

    // --------------------------------------------------------------------------
    // Internal
    // --------------------------------------------------------------------------

    /**
     * Memoizes distributions to ensure they're only created when necessary.
     *
     * Returns a thunk which that returns independent, identically distributed
     * samples from the specified distribution.
     *
     * @private
     *
     * @param {string} label - Name of distribution
     * @param {function} getter - Function which generates a new distribution
     * @param {...*} args - Distribution-specific arguments
     *
     * @return {function}
     */
    private _memoize(label: string, getter: Function, ...args: any[]) {
        const key = `${args.join(";")}`;
        let value = this._cache[label];

        if (value === undefined || value.key !== key) {
            value = {
                key,
                distribution: getter(this, ...args)
            };
            this._cache[label] = value;
        }

        return value.distribution;
    }
}
