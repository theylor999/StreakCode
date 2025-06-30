
import type { Progress } from '@/types';
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

export function calculateStreaks(progress: Progress): { currentStreak: number; longestStreak: number } {
  const completedDates = Object.values(progress)
    .filter(p => p.completed && p.completionDate)
    .map(p => new Date(p.completionDate!))
    .sort((a, b) => a.getTime() - b.getTime());

  if (completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Remove duplicates for the same day to count one completion per day
  const uniqueDates: Date[] = [];
  const seenDays = new Set<string>();
  for (const date of completedDates) {
    const dayKey = date.toISOString().split('T')[0];
    if (!seenDays.has(dayKey)) {
      uniqueDates.push(date);
      seenDays.add(dayKey);
    }
  }

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempLongest = 1;
  longestStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    if (differenceInCalendarDays(uniqueDates[i], uniqueDates[i - 1]) === 1) {
      tempLongest++;
    } else {
      tempLongest = 1;
    }
    if (tempLongest > longestStreak) {
      longestStreak = tempLongest;
    }
  }

  // Calculate current streak
  const lastCompletion = uniqueDates[uniqueDates.length - 1];
  if (isToday(lastCompletion) || isYesterday(lastCompletion)) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      if (differenceInCalendarDays(uniqueDates[i+1], uniqueDates[i]) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    if (!isToday(lastCompletion) && !isYesterday(lastCompletion)) {
        currentStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

    