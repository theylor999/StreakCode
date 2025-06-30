import { adminDb } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    if (!adminDb) {
        return NextResponse.json({ success: false, message: 'Firebase Admin not initialized. Check server environment variables.' }, { status: 500 });
    }

    try {
        const { isCompletion, isNewUser, isNewChallengeStart } = await request.json();

        const statsRef = adminDb.collection('stats').doc('global');

        const updateData: { [key: string]: any } = {
            totalAttempts: FieldValue.increment(1),
        };

        if (isCompletion) {
            updateData.totalCompleted = FieldValue.increment(1);
        }
        if (isNewUser) {
            updateData.totalUsers = FieldValue.increment(1);
        }
        if (isNewChallengeStart) {
            updateData.startedChallenges = FieldValue.increment(1);
        }

        await statsRef.set(updateData, { merge: true });

        return NextResponse.json({ success: true, message: 'Stats updated.' });

    } catch (error) {
        console.error('Error updating stats:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
