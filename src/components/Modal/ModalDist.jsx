import React from 'react';
import {Modal} from "antd";
import ModalDistItem from "./ModalDistItem";

const ModalDist = ({isOpen, data}) => {
    return (
        <Modal className='modal-dist' destroyOnClose={true} open={isOpen.get} footer={null} onCancel={() => isOpen.set(false)}>
            <div className="modal-dist__title-box">
                <div className="modal-dist__icon">
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.3262 2.84616H11.0377C8.02021 2.84616 5.57617 5.2902 5.57617 8.3077V18.2067C5.57617 18.9577 6.19059 19.5721 6.94156 19.5721H27.4223C28.1733 19.5721 28.7877 18.9577 28.7877 18.2067V8.3077C28.7877 5.2902 26.3437 2.84616 23.3262 2.84616ZM11.0377 17.524H9.67233C9.11252 17.524 8.64829 17.0598 8.64829 16.5C8.64829 15.9402 9.11252 15.476 9.67233 15.476H11.0377C11.5975 15.476 12.0617 15.9402 12.0617 16.5C12.0617 17.0598 11.5975 17.524 11.0377 17.524ZM11.0377 14.1106H9.67233C9.11252 14.1106 8.64829 13.6464 8.64829 13.0865C8.64829 12.5267 9.11252 12.0625 9.67233 12.0625H11.0377C11.5975 12.0625 12.0617 12.5267 12.0617 13.0865C12.0617 13.6464 11.5975 14.1106 11.0377 14.1106ZM11.0377 10.6971H9.67233C9.11252 10.6971 8.64829 10.2329 8.64829 9.67308C8.64829 9.11328 9.11252 8.64905 9.67233 8.64905H11.0377C11.5975 8.64905 12.0617 9.11328 12.0617 9.67308C12.0617 10.2329 11.5975 10.6971 11.0377 10.6971Z" fill="white"/>
                        <path d="M5.57617 22.9856V24.6923C5.57617 27.7098 8.02021 30.1538 11.0377 30.1538H23.3262C26.3437 30.1538 28.7877 27.7098 28.7877 24.6923V22.9856C28.7877 22.2346 28.1733 21.6202 27.4223 21.6202H6.94156C6.19059 21.6202 5.57617 22.2346 5.57617 22.9856ZM24.2956 26.6858C24.0362 26.9315 23.6812 27.0817 23.3262 27.0817C22.9712 27.0817 22.6162 26.9315 22.3568 26.6858C22.111 26.4263 21.9608 26.0713 21.9608 25.7163C21.9608 25.3613 22.111 25.0063 22.3568 24.7469C22.8619 24.2417 23.7767 24.2417 24.2956 24.7469C24.5414 25.0063 24.6916 25.3613 24.6916 25.7163C24.6916 26.0713 24.5414 26.4263 24.2956 26.6858Z" fill="white"/>
                    </svg>
                </div>
                <p className="modal-dist__title">Переместить файлы в указанные папки</p>
            </div>
            <div className="modal-dist__content">
                <div className="modal-dist__form-item flex-100">
                    <div className="modal-dist__item-title-box">
                        <p>директория откуда</p>
                        <div className="modal-dist__item-tooltip">
                            <p>Подсказка</p>
                        </div>
                    </div>
                    <div className="modal-dist__label-box">
                        <label className="modal-dist__label">
                            <svg className="modal-dist__label-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.3724 12.5587L22.2024 12.325C21.9049 11.9637 21.5543 11.6768 21.1506 11.4643C20.6087 11.1562 19.9924 10.9968 19.3549 10.9968H6.12681C5.48931 10.9968 4.88368 11.1562 4.33118 11.4643C3.91681 11.6875 3.54493 11.9956 3.23681 12.3781C2.63118 13.1537 2.34431 14.11 2.43993 15.0662L2.83306 20.0281C2.97118 21.5262 3.15181 23.3749 6.51993 23.3749H18.9724C22.3406 23.3749 22.5106 21.5262 22.6593 20.0175L23.0524 15.0768C23.1481 14.1843 22.9143 13.2918 22.3724 12.5587Z" fill="#FFC225"/>
                                <path d="M9.39772 17.0474C9.17681 17.0456 8.9963 17.2233 8.99454 17.4442C8.99278 17.6651 9.17044 17.8456 9.39134 17.8473L9.39772 17.0474ZM16.2806 17.7851C16.438 17.6301 16.44 17.3769 16.2851 17.2194L13.7599 14.6536C13.6049 14.4962 13.3517 14.4942 13.1942 14.6491C13.0368 14.8041 13.0347 15.0573 13.1897 15.2148L15.4343 17.4955L13.1536 19.7401C12.9962 19.8951 12.9942 20.1483 13.1491 20.3058C13.3041 20.4632 13.5573 20.4653 13.7148 20.3103L16.2806 17.7851ZM9.39134 17.8473L15.9968 17.9L16.0032 17.1L9.39772 17.0474L9.39134 17.8473Z" fill="white"/>
                                <path d="M21.8498 9.18666C21.8853 9.56971 21.4705 9.8265 21.107 9.70051C20.5555 9.50934 19.9737 9.41375 19.368 9.41375H6.12922C5.51939 9.41375 4.91926 9.51548 4.36152 9.70914C4.00237 9.83384 3.58984 9.58632 3.58984 9.20614V7.07625C3.58984 3.28312 4.74797 2.125 8.54109 2.125H9.79484C11.3142 2.125 11.7923 2.61375 12.4086 3.41062L13.6836 5.11063C13.9492 5.47187 13.9598 5.49312 14.4273 5.49312H16.9561C20.2983 5.49312 21.5913 6.3941 21.8498 9.18666Z" fill="#FFC225"/>
                            </svg>
                            <input className="from-path" placeholder="Путь к директории" type="text" value={data ? data.dirFrom : ''}/>
                        </label>
                    </div>
                </div>
            </div>
            <div className="modal-dist__settings">
                <div className="modal-dist__content recipients">
                    <button className="modal-dist__thread-add-btn">
                        <span className="icon"/>
                        <span>Еще одна папка</span>
                    </button>
                    <div className="modal-dist__recipient-header">
                        <div className="modal-dist__form-item flex-75">
                            <div className="modal-dist__item-title-box">
                                <p>директория куда</p>
                                <div className="modal-dist__item-tooltip">
                                    <p>Подсказка</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        data ?
                            data.dirsTo.map((item, i) => <ModalDistItem value={item} key={i} />)
                            :
                            <ModalDistItem/>
                    }
                </div>
            </div>
            <div className="modal-dist__buttons">
                <button type="button" className="modal-dist__send">
                    <span className="icon">
                        <svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg className="no" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="submit-text">Сохранить</span>
                </button>
                <button type="button" className="modal-dist__cancel-btn close">
                    <span>Отменить создание</span>
                </button>
            </div>
        </Modal>
    );
};

export default ModalDist;