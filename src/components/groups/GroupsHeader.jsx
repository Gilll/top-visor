import React from 'react';

const GroupsHeader = ({groupsCount, callModal}) => {
    return (
        <div className="main__header">
            <div>
                <button className="main__btn main__btn--add popup-group" onClick={callModal}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5.41663V20.5833" stroke="white" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M5.41797 13H20.5846" stroke="white" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
                <p className="main__title"><span>Все группы</span> <sup>{groupsCount}</sup></p></div>
        </div>
    );
};

export default GroupsHeader;