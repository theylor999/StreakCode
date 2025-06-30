import { adminDb } from '@/lib/firebase';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!adminDb) {
        return NextResponse.json({ message: 'Firebase Admin not initialized. Check server environment variables.' }, { status: 500 });
    }
    
    try {
        const statsRef = adminDb.collection('stats').doc('global');
        const doc = await statsRef.get();

        if (!doc.exists) {
            // Return default stats if the document doesn't exist yet
            return NextResponse.json({
                totalUsers: 0,
                totalCompleted: 0,
                startedChallenges: 0,
                totalAttempts: 0,
            });
        }
        
        return NextResponse.json(doc.data());

    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
