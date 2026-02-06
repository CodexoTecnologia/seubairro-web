import React from 'react';

const PageSkeleton = () => {
    return (
        <div className="w-full min-h-screen p-4 space-y-4 bg-white animate-pulse">
            {/* Header Skeleton */}
            <div className="w-full h-16 bg-gray-200 rounded-lg mb-8" />

            {/* Hero/Banner Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-8" />

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-row gap-4 p-4 border border-gray-100 rounded-xl">
                        {/* Avatar/Icon Placeholder */}
                        <div className="shrink-0 w-12 h-12 bg-gray-300 rounded-full" />

                        {/* Text Lines */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className="w-3/4 h-5 bg-gray-300 rounded-full" />
                            <div className="w-full h-4 bg-gray-200 rounded-full" />
                            <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageSkeleton;
