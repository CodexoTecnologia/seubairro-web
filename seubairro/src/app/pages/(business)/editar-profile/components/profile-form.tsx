'use client'
import React, { useState } from 'react'
import { BusinessService, type BusinessResponse } from '@/API/services/BusinessService'

interface ProfileFormProps {
    initialData: BusinessResponse;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [formData, setFormData] = useState<BusinessResponse>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {

            await BusinessService.update(initialData.id, formData);
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof BusinessResponse, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <section className="form-section">
                <div className="section-title">
                    <i className="ri-store-2-line"></i> Identidade do Negócio
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nome do Negócio</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={formData.businessName || ''}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                        />
                    </div>
                    
                    <div className="form-grid two-col">
                        <div className="form-group">
                            <label>WhatsApp / Telefone Público</label>
                            <input 
                                type="tel" 
                                className="form-input" 
                                value={formData.publicPhone || ''}
                                onChange={(e) => handleInputChange('publicPhone', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Instagram URL</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={formData.instagramUrl || ''}
                                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sobre o Negócio</label>
                        <textarea 
                            className="form-textarea" 
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <div className="section-title">
                    <i className="ri-image-line"></i> Aparência
                </div>
                <div className="images-row">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Logo / Foto de Perfil</label>
                        <div 
                            className="image-upload-box upload-logo" 
                            style={{ 
                                backgroundImage: formData.logoUrl ? `url(${formData.logoUrl})` : 'none', 
                                backgroundSize: 'cover' 
                            }}
                        >
                            {!formData.logoUrl && <i className="ri-camera-line upload-icon"></i>}
                        </div>
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                        <label>Imagem de Capa</label>
                        <div 
                            className="image-upload-box upload-cover"
                            style={{ 
                                backgroundImage: formData.coverImageUrl ? `url(${formData.coverImageUrl})` : 'none', 
                                backgroundSize: 'cover' 
                            }}
                        >
                            {!formData.coverImageUrl && <i className="ri-image-add-line upload-icon"></i>}
                        </div>
                    </div>
                </div>
            </section>

            <div className="action-bar">
                <button type="button" className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    );
}