const USER_ID_KEY = 'streakcode-user-id';

/**
 * Gets the unique user ID from localStorage, or creates and saves a new one.
 * @returns An object containing the userId and a flag indicating if the user is new.
 */
export function getOrCreateUserId(): { userId: string; isNewUser: boolean } {
    if (typeof window === 'undefined') {
        return { userId: '', isNewUser: false };
    }

    let userId = localStorage.getItem(USER_ID_KEY);
    let isNewUser = false;

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
        isNewUser = true;
    }
    
    return { userId, isNewUser };
}
