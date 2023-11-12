import React from 'react';

const ErrorOnPage = ({children}) => {
    return (
        <div className="page-server-error">
            server error: {children}
        </div>
    );
};

export default ErrorOnPage;