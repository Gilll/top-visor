import React from 'react';
import IconIsLoading from "../icons/IconIsLoading";

const SaveButton = ({onClick, isLoading, disable}) => {
    return (
        <button type="submit" onClick={() => { if (!disable) { onClick() }}} className={!disable ? (isLoading ? "modal-group__submit isLoading" : "modal-group__submit") : "modal-group__submit disable" }><i>
            <svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="no" width="28" height="28" viewBox="0 0 28 28" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </i><span className="submit-text">СОхранить</span>
            <IconIsLoading/>
        </button>
    );
};

export default SaveButton;