import React from 'react'
import '@/styles/ui/back-button.css'

interface BackButtonProps {
    onClick?: () => void;
    label?: string;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = "Voltar", className = "" }) => {
    return (
        <button className={`back-btn ${className}`} type="button" onClick={onClick}>
            <div className="icon-box">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20px"
                    height="20px"
                >
                    <path d="M7.82843 11L13.1924 5.63604L11.7782 4.22183L3.99999 12L11.7782 19.7782L13.1924 18.364L7.82843 13H20V11H7.82843Z"></path>
                </svg>
            </div>
            <p className="label">{label}</p>
        </button>
    )
}

export default BackButton
