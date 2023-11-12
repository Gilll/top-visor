import React, {useState} from 'react';
import {Modal} from "antd";

const ConfirmationForm = ({visible, onCancel, children, isLoading, onOK}) => {
    return (
        <Modal
            open={visible}
            onCancel={() => onCancel()}
            destroyOnClose={true}
            footer={false}
            className="conf-modal"
        >
            <div className="modal-confirm__container modal__container">
                {children}
                <div className="modal-confirm__buttons">
                    <button id="confirmBtn" type="button" className="modal-confirm__btn" onClick={onOK}>{isLoading ? "Удаление" : "Да, удалить"}</button>
                    <button type="button" className="modal-confirm__btn close" onClick={onCancel}>Отменить</button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationForm;