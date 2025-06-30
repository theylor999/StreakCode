
"use client";

import { useState, useEffect } from 'react';
import { getChallengeById, getChallengesByType, getCustomChallenges } from '@/lib/challenges';
import { ChallengeClientPage } from './_components/ChallengeClientPage';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import type { Challenge, ChallengeType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type NavData = {
    totalChallenges: number;
    prevChallengeId: string | null;
    nextChallengeId: string | null;
    isCustom?: boolean;
    challengeIndex?: number;
};

export default function ChallengePage() {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const id = params.id;
    const isDaily = searchParams.get('daily') === 'true';
    
    const [challenge, setChallenge] = useState<Challenge | null | undefined>(undefined);
    const [navData, setNavData] = useState<NavData>({ totalChallenges: 0, prevChallengeId: null, nextChallengeId: null });
    
    useEffect(() => {
        if (id) {
            const foundChallenge = getChallengeById(id);
            setChallenge(foundChallenge);

            if (foundChallenge) {
                const isCustom = foundChallenge.id.startsWith('custom-');

                if (isCustom) {
                    const customChallenges = getCustomChallenges();
                    const total = customChallenges.length;
                    const currentIndex = customChallenges.findIndex(c => c.id === foundChallenge.id);

                    const prevChallengeId = currentIndex > 0 ? customChallenges[currentIndex - 1].id : null;
                    const nextChallengeId = currentIndex < total - 1 ? customChallenges[currentIndex + 1].id : null;

                    setNavData({ 
                        totalChallenges: total, 
                        prevChallengeId, 
                        nextChallengeId, 
                        isCustom: true, 
                        challengeIndex: currentIndex + 1 
                    });

                } else {
                    const challengesOfType = getChallengesByType(foundChallenge.type as ChallengeType);
                    const sortedChallenges = challengesOfType.sort((a, b) => a.numericId - b.numericId);

                    const totalChallenges = sortedChallenges.length;
                    const currentIndex = sortedChallenges.findIndex(c => c.id === foundChallenge.id);
                    
                    const prevChallengeId = currentIndex > 0 ? sortedChallenges[currentIndex - 1].id : null;
                    const nextChallengeId = currentIndex < totalChallenges - 1 ? sortedChallenges[currentIndex + 1].id : null;
                    
                    setNavData({ totalChallenges, prevChallengeId, nextChallengeId, isCustom: false });
                }
            }
        }
    }, [id]);

    if (challenge === undefined) {
        // Loading state
        return (
             <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                <Skeleton className="h-16 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }
    
    if (challenge === null) {
        notFound();
    }

    return <ChallengeClientPage 
        challenge={challenge} 
        totalChallenges={navData.totalChallenges}
        prevChallengeId={navData.prevChallengeId}
        nextChallengeId={navData.nextChallengeId}
        isCustom={navData.isCustom}
        challengeIndex={navData.challengeIndex}
        isDaily={isDaily}
      />;
}

    