'use client'
import React, { useEffect, useState } from 'react'
import '@/styles/business/update-profile/update-profile.css'
import ProfileForm from './components/profile-form'
import { BusinessService, type BusinessResponse } from '@/API/services/BusinessService'

export default function EditarProfilePage() {
    const [business, setBusiness] = useState<BusinessResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const ownerId = "id-do-usuario"; // Substitua pela lógica de auth
                const data = await BusinessService.getByOwnerId(ownerId);
                
                if (data && data.length > 0) {
                    setBusiness(data[0]);
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
    }, []);

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