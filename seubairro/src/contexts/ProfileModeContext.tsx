'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ProfileMode = 'client' | 'business' | null

interface ProfileModeContextType {
    profileMode: ProfileMode
    setProfileMode: (mode: ProfileMode) => void
}

const ProfileModeContext = createContext<ProfileModeContextType | undefined>(undefined)

export function ProfileModeProvider({ children }: { children: ReactNode }) {
    const [profileMode, setProfileModeState] = useState<ProfileMode>(null)

    useEffect(() => {
        const saved = localStorage.getItem('profileMode') as ProfileMode
        if (saved === 'client' || saved === 'business') {
            setProfileModeState(saved)
        }
    }, [])

    const setProfileMode = (mode: ProfileMode) => {
        if (mode) {
            localStorage.setItem('profileMode', mode)
        } else {
            localStorage.removeItem('profileMode')
        }
        setProfileModeState(mode)
    }

    return (
        <ProfileModeContext.Provider value={{ profileMode, setProfileMode }}>
            {children}
        </ProfileModeContext.Provider>
    )
}

export function useProfileMode() {
    const context = useContext(ProfileModeContext)
    if (!context) {
        throw new Error('useProfileMode must be used within ProfileModeProvider')
    }
    return context
}
