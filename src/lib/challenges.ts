import type { Challenge, ChallengeType } from '@/types';
import { pythonChallenges as staticPythonChallenges } from './challenges/python';
import { sqlChallenges as staticSqlChallenges } from './challenges/sql';

const staticChallenges: Challenge[] = [
  ...staticPythonChallenges,
  ...staticSqlChallenges,
];

const CUSTOM_CHALLENGES_KEY = 'streakcode-custom-challenges';

// --- Client-side only functions ---

/**
 * Retrieves custom challenges from localStorage. Client-side only.
 */
export function getCustomChallenges(): Challenge[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const saved = localStorage.getItem(CUSTOM_CHALLENGES_KEY);
  try {
    // Custom challenges are stored newest-first, but we want to display them oldest-first in lists.
    const challenges = saved ? JSON.parse(saved) : [];
    return challenges.reverse();
  } catch (e) {
    console.error("Failed to parse custom challenges from localStorage", e);
    return [];
  }
}

/**
 * Saves an array of custom challenges to localStorage. Client-side only.
 */
export function saveCustomChallenges(challenges: Challenge[]): void {
  if (typeof window === 'undefined') return;
  // To maintain order, reverse back before saving (newest first).
  localStorage.setItem(CUSTOM_CHALLENGES_KEY, JSON.stringify(challenges.reverse()));
}

/**
 * Adds a single new custom challenge to localStorage. Client-side only.
 */
export function addCustomChallenge(newChallenge: Challenge): void {
    const existing = getCustomChallenges();
    // Add new challenge to the end (will be reversed to the start on save)
    const updated = [...existing, newChallenge];
    saveCustomChallenges(updated);
}

/**
 * Removes a custom challenge by ID from localStorage. Client-side only.
 */
export function removeCustomChallenge(id: string): void {
    const existing = getCustomChallenges();
    const updated = existing.filter(c => c.id !== id);
    saveCustomChallenges(updated);
}


/**
 * Gets a merged list of static and custom challenges. Client-side only.
 */
export function getAllChallenges(): Challenge[] {
  const customChallenges = getCustomChallenges();
  // We show custom challenges first, then static ones.
  return [...customChallenges, ...staticChallenges];
}

/**
 * Gets challenges of a specific type from static and custom lists. Client-side only.
 */
export function getChallengesByType(type: ChallengeType): Challenge[] {
  const allChallenges = getAllChallenges();
  return allChallenges.filter(c => c.type === type && !c.id.startsWith('custom-'));
}

/**
 * Gets a challenge by its ID from static or custom lists. Client-side only.
 */
export function getChallengeById(id: string): Challenge | undefined {
  const allChallenges = getAllChallenges();
  return allChallenges.find(c => c.id === id);
}

// --- Server-side / Static-only functions ---

/**
 * Gets all static challenges. Safe for server-side rendering and static generation.
 */
export async function getAllStaticChallenges(): Promise<Challenge[]> {
  return Promise.resolve(staticChallenges);
}

/**
 * Gets a static challenge by ID. Safe for server-side.
 */
export async function getStaticChallengeById(id: string): Promise<Challenge | undefined> {
  return Promise.resolve(staticChallenges.find(c => c.id === id));
}

export async function getTotalChallenges(type: ChallengeType): Promise<number> {
    const challengesOfType = getChallengesByType(type);
    return challengesOfType.length;
}
