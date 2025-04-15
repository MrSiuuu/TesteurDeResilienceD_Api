import React from 'react';

function MiddlewareList({ middlewares }) {
    return (
        <div>
            <h3>Middlewares actifs</h3>
            <ul>
                {middlewares.map((middleware, index) => (
                    <li key={index}>{middleware.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default MiddlewareList;
