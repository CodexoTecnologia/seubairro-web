'use client'
import React, { useEffect, useState } from 'react'
import '@/styles/business/update-profile/update-profile.css'
import ProfileForm from './components/profile-form'
import { BusinessService, type BusinessResponse } from '@/API/services/BusinessService'
import { useAuthContext } from '@/contexts/AuthContext';

export default function EditarProfilePage() {
    const [business, setBusiness] = useState<BusinessResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthContext();

    useEffect(() => {
        if (!user?.id) return;

        async function loadInitialData() {
            try {
                const raw = await BusinessService.getByOwnerId(user!.id);
                const rawData = (raw as any)?.data ?? raw;
                const arr = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

                if (arr.length > 0) {
                    setBusiness(arr[0]);
                } else {
                    setError("Nenhum estabelecimento encontrado.");
                }
            } catch (err) {
                setError("Falha ao carregar dados do perfil.");
            } finally {
                setLoading(false);
            }
        }
        loadInitialData();
    }, [user]);

    if (loading) return <div className="edit-profile-container">Carregando...</div>;
    if (error) return <div className="edit-profile-container">{error}</div>;

    return (
        <div className="edit-profile-container">
            <header className="edit-header">
                <h1>Editar Perfil</h1>
                <p>Gerencie as informações que seus clientes veem.</p>
            </header>

            <ProfileForm initialData={business!} />
        </div>
    );
}