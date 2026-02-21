import React from 'react';

const StatCard = ({ title, value }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg w-full max-w-xs">
            <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
            <div className="w-full rounded-tr-3xl rounded-bl-3xl bg-gradient-to-br from-blue-200 to-blue-300 text-4xl text-center py-6 font-semibold text-blue-900">
                {value}
            </div>
        </div>
    );
};

export default StatCard;
