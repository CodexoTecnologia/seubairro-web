'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageSkeleton from './page-skeleton';

interface GlobalLoaderProps {
    children: React.ReactNode;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ children }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Trigger loading state on route change
        setLoading(true);

        // Artificial delay of 1.5 seconds
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [pathname]);

    if (loading) {
        return <PageSkeleton />;
    }

    return <>{children}</>;
};

export default GlobalLoader;
