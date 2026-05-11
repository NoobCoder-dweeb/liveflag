/**
 * Generates a deterministic bucket from 0-99.
 * 
 * Same user + same flag always lands in same bucket
 * This ensures rollout consistency.
 */

export function getBucket(input: string): number {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i) | 0);
    }

    return Math.abs(hash) % 100;
}