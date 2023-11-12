import React from 'react';

const NetworkChoiseModal = ({selectedType}) => {
    return (
        <div className="modal-confirm__container modal__container">
            <div className="modal-confirm__icon">
                <svg className="plus" xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30"
                     fill="none">
                    <path d="M15.5 1V29" stroke="white" strokeWidth="3" strokeLinecap="round"
                          strokeLinejoin="round"/>
                    <path d="M0 15H31" stroke="white" strokeWidth="3" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </div>
            <p className="modal-confirm__title">Что создаем?</p>
            <div className="modal-confirm__buttons">
                <button onClick={() => selectedType("ROUTER")} id="confirmBtn" type="button" className="modal-confirm__btn">Роутер</button>
                <button onClick={() => selectedType("ROOT")} type="button" className="modal-confirm__btn close">root-cервер</button>
            </div>
        </div>
    );
};

export default NetworkChoiseModal;