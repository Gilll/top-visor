import React from 'react';

const ModalServerConfigForm = () => {
    return (
        <div className="modal-server__form">
            <div className="modal-server__form-item config-select flex-50">
                <p className="config-select__title">Процессор</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">Intel Core i5-12400 LGA1700</p>
                            <p className="config-select__text">16 ядер</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="config-select__box">
                        <div className="config-select__qty-box">
                            <div className="config-select__qty-operator minus">-</div>
                            <div className="config-select__qty">1</div>
                            <div className="config-select__qty-operator plus">+</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-server__form-item config-select flex-50">
                <p className="config-select__title">RAM</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">HyperX Fury 8</p>
                            <p className="config-select__text">512GB</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="config-select__box">
                        <div className="config-select__qty-box">
                            <div className="config-select__qty-operator minus">-</div>
                            <div className="config-select__qty">1</div>
                            <div className="config-select__qty-operator plus">+</div>
                        </div>
                        <div className="config-select__ram">
                            <span>∑</span>
                            <p>2048GB</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-server__form-item config-select config-select--ssd flex-100">
                <p className="config-select__title">SSD</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">Samsung T7, Gen 2 Type-C</p>
                            <p className="config-select__text">512GB</p>
                            <p className="config-select__text">1000 чтение</p>
                            <p className="config-select__text">1500 запись</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="button" className="config-select__ssd-add">
                    <span className="icon"/>
                    <span>Еще SSD</span>
                </button>
            </div>
            <div className="modal-server__form-item config-select flex-33">
                <p className="config-select__title">Видеокарта</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">Gigabyte RTX4060Ti</p>
                            <p className="config-select__text">16GB</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-server__form-item config-select flex-33">
                <p className="config-select__title">Блок питания</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">ADATA XPG Pylon</p>
                            <p className="config-select__text">650W</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-server__form-item config-select flex-33">
                <p className="config-select__title">Термопаста</p>
                <div className="config-select__content">
                    <div className="config-select__box">
                        <div className="config-select__info">
                            <p className="config-select__name">Arctic MX-5, шприц, 4 г</p>
                            <p className="config-select__text">8.5 Вт/(м*K)</p>
                        </div>
                        <button type="button" className="config-select__select-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-server__form-item config-select flex-100">
                <p className="config-select__title">Дополнительно</p>
                <div className="config-select__content config-select__content--label">
                    <label className="config-select__textarea-label">
                        <textarea placeholder="Дополнительная информация..."/>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ModalServerConfigForm;