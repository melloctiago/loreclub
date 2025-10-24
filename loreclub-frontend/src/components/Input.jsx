import React from 'react';

// Componente de Input reutilizável
const Input = ({ id, type = 'text', label, value, onChange, icon: Icon, children }) => (
    <div className="relative">
        <label htmlFor={id} className="absolute -top-2.5 left-4 inline-block bg-lore-bg-light px-1 text-sm font-medium text-gray-400">
            {label}
        </label>
        {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Icon className="h-5 w-5 text-gray-500" />
            </div>
        )}
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`block w-full rounded-lg border-0 py-4 px-5 bg-lore-bg-light text-gray-100 shadow-sm ring-1 ring-inset ring-lore-border placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-lore-purple-md sm:text-sm sm:leading-6 ${Icon ? 'pl-11' : ''}`}
        />
        {children}
    </div>
);

export default Input;
