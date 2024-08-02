"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    useEffect(() => {
        if (!loading && !session) {
            signIn();
        }
    }, [loading, session]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return <>{children}</>;
}
