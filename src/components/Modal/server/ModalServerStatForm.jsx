import React from 'react';

const ModalServerStatForm = () => {
    return (
        <div className="modal-server__form">
            <div className="modal-server__form-item flex-33">
                <div className="modal-server__item-title-box">
                    <p>папка проверки</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box">
                    <label className="modal-server__label">
                        <input type="text"/>
                    </label>
                </div>
            </div>
            <div className="modal-server__form-item flex-33">
                <div className="modal-server__item-title-box">
                    <p>папка Десктоп</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box">
                    <label className="modal-server__label">
                        <input type="text"/>
                    </label>
                </div>
            </div>
            <div className="modal-server__form-item flex-33">
                <div className="modal-server__item-title-box">
                    <p>папка мобильные</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box">
                    <label className="modal-server__label">
                        <input type="text"/>
                    </label>
                </div>
            </div>
            <button className="modal-server__stat-profile-add modal-server__form-item flex-100">
                <span className="icon"/>
                <span>Добавить еще папку</span>
            </button>
            <div className="modal-server__form-item flex-15">
                <div className="modal-server__item-title-box">
                    <p>Количество сайтов</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box">
                    <label className="modal-server__label-radio">
                        <input type="checkbox"/>
                    </label>
                    <label className="modal-server__label">
                        <input type="number"/>
                    </label>
                </div>
            </div>
            <div className="modal-server__form-item flex-15">
                <div className="modal-server__item-title-box">
                    <p>профилей в warmup</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box">
                    <label className="modal-server__label-radio">
                        <input type="checkbox"/>
                    </label>
                    <label className="modal-server__label">
                        <input type="number"/>
                    </label>
                </div>
            </div>
            <div className="modal-server__form-item flex-15">
                <div className="modal-server__item-title-box">
                    <p>сколько дней</p>
                    <div className="modal-server__item-tooltip">
                        <p/>
                    </div>
                </div>
                <div className="modal-server__label-box modal-server__label-box--justify-normal">
                    <label className="modal-server__input-switch-btn active">
                        <input type="checkbox"/>
                    </label>
                    <p>Без ограничений</p>
                </div>
            </div>
        </div>
    );
};

export default ModalServerStatForm;