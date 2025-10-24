import React from 'react';

// Componente de Botão reutilizável
const Button = ({ type = 'submit', children, onClick, loading = false, variant = 'primary', className = '' }) => {
    const baseStyle = "w-full flex justify-center items-center rounded-lg py-3 px-4 text-sm font-semibold shadow-sm transition duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
    
    const styles = {
        primary: "bg-lore-purple text-white hover:bg-lore-purple-md focus-visible:outline-lore-purple-md",
        secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus-visible:outline-gray-600"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`${baseStyle} ${styles[variant]} ${className}`}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : children}
        </button>
    );
};

export default Button;
