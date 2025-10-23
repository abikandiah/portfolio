import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs))
}

/**
 * Returns a random integer between 0 and max, inclusive.
 * @param {number} max - The maximum possible number (inclusive).
 */
export function getRandomIntUpTo(max: number) {
	// We use (max + 1) to make 'max' inclusive after Math.floor()
	return Math.floor(Math.random() * (max + 1));
}

