import React, {useEffect, useState} from 'react';
import {useApi} from "../../hooks/useApi";
import {message} from "antd";
import SaveButton from "../UI/SaveButton";

const CaptchaServerForm = ({closeModal, addNewServer, editableServer, editSelectedServer}) => {
    const initialState = {
        affiliation: '',
        apiKey: '',
        createdDate: '',
        id: '',
        ip: '',
        name: '',
        serverPaymentDate: '',
        softPaymentDate: '',
        status: ''
    }

    const [formData, setFormData] = useState(editableServer || initialState)

    const [createServer, csIsLoading] = useApi({
        url: '/profile-monitoring-system/anticaptcha/create',
        data: formData
    })

    const [editServer, esIsLoading] = useApi({
        url: "/profile-monitoring-system/anticaptcha/" + (editableServer ? editableServer.id : 0) + "/change",
        data: formData
    })

    const tryCreateSever = () => {
        createServer().then((resp) => {
            addNewServer(resp.result[0])
            closeModal()
            message.success("Сервер " + resp.result[0].name + " успешно создан")
        }).catch((err) => message.error(err.message))
    }

    const tryEditServer = () => {
        editServer().then((resp) => {
            editSelectedServer(resp.result[0])
            closeModal()
            message.success("Сервер " + resp.result[0].name + " успешно отредактирован")
        }).catch((err) => message.error(err.message))
    }


    return (
        <div>
            <button type="button" className="modal__close close"/>
            {editableServer ?
                <div className="modal-captcha__title-box edit">
                    <div className="modal-captcha__icon">
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.3262 2.84616H11.0377C8.02021 2.84616 5.57617 5.2902 5.57617 8.3077V18.2067C5.57617 18.9577 6.19059 19.5721 6.94156 19.5721H27.4223C28.1733 19.5721 28.7877 18.9577 28.7877 18.2067V8.3077C28.7877 5.2902 26.3437 2.84616 23.3262 2.84616ZM11.0377 17.524H9.67233C9.11252 17.524 8.64829 17.0598 8.64829 16.5C8.64829 15.9402 9.11252 15.476 9.67233 15.476H11.0377C11.5975 15.476 12.0617 15.9402 12.0617 16.5C12.0617 17.0598 11.5975 17.524 11.0377 17.524ZM11.0377 14.1106H9.67233C9.11252 14.1106 8.64829 13.6464 8.64829 13.0865C8.64829 12.5267 9.11252 12.0625 9.67233 12.0625H11.0377C11.5975 12.0625 12.0617 12.5267 12.0617 13.0865C12.0617 13.6464 11.5975 14.1106 11.0377 14.1106ZM11.0377 10.6971H9.67233C9.11252 10.6971 8.64829 10.2329 8.64829 9.67308C8.64829 9.11328 9.11252 8.64905 9.67233 8.64905H11.0377C11.5975 8.64905 12.0617 9.11328 12.0617 9.67308C12.0617 10.2329 11.5975 10.6971 11.0377 10.6971Z"
                                fill="white"/>
                            <path
                                d="M5.57617 22.9856V24.6923C5.57617 27.7098 8.02021 30.1538 11.0377 30.1538H23.3262C26.3437 30.1538 28.7877 27.7098 28.7877 24.6923V22.9856C28.7877 22.2346 28.1733 21.6202 27.4223 21.6202H6.94156C6.19059 21.6202 5.57617 22.2346 5.57617 22.9856ZM24.2956 26.6858C24.0362 26.9315 23.6812 27.0817 23.3262 27.0817C22.9712 27.0817 22.6162 26.9315 22.3568 26.6858C22.111 26.4263 21.9608 26.0713 21.9608 25.7163C21.9608 25.3613 22.111 25.0063 22.3568 24.7469C22.8619 24.2417 23.7767 24.2417 24.2956 24.7469C24.5414 25.0063 24.6916 25.3613 24.6916 25.7163C24.6916 26.0713 24.5414 26.4263 24.2956 26.6858Z"
                                fill="white"/>
                        </svg>
                    </div>
                    <p className="modal-captcha__title">Редактировать <b>{editableServer.name}</b></p></div>
            :
                <div className="modal-captcha__title-box">
                    <div className="modal-captcha__icon">
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.3262 2.84616H11.0377C8.02021 2.84616 5.57617 5.2902 5.57617 8.3077V18.2067C5.57617 18.9577 6.19059 19.5721 6.94156 19.5721H27.4223C28.1733 19.5721 28.7877 18.9577 28.7877 18.2067V8.3077C28.7877 5.2902 26.3437 2.84616 23.3262 2.84616ZM11.0377 17.524H9.67233C9.11252 17.524 8.64829 17.0598 8.64829 16.5C8.64829 15.9402 9.11252 15.476 9.67233 15.476H11.0377C11.5975 15.476 12.0617 15.9402 12.0617 16.5C12.0617 17.0598 11.5975 17.524 11.0377 17.524ZM11.0377 14.1106H9.67233C9.11252 14.1106 8.64829 13.6464 8.64829 13.0865C8.64829 12.5267 9.11252 12.0625 9.67233 12.0625H11.0377C11.5975 12.0625 12.0617 12.5267 12.0617 13.0865C12.0617 13.6464 11.5975 14.1106 11.0377 14.1106ZM11.0377 10.6971H9.67233C9.11252 10.6971 8.64829 10.2329 8.64829 9.67308C8.64829 9.11328 9.11252 8.64905 9.67233 8.64905H11.0377C11.5975 8.64905 12.0617 9.11328 12.0617 9.67308C12.0617 10.2329 11.5975 10.6971 11.0377 10.6971Z"
                                fill="white"/>
                            <path
                                d="M5.57617 22.9856V24.6923C5.57617 27.7098 8.02021 30.1538 11.0377 30.1538H23.3262C26.3437 30.1538 28.7877 27.7098 28.7877 24.6923V22.9856C28.7877 22.2346 28.1733 21.6202 27.4223 21.6202H6.94156C6.19059 21.6202 5.57617 22.2346 5.57617 22.9856ZM24.2956 26.6858C24.0362 26.9315 23.6812 27.0817 23.3262 27.0817C22.9712 27.0817 22.6162 26.9315 22.3568 26.6858C22.111 26.4263 21.9608 26.0713 21.9608 25.7163C21.9608 25.3613 22.111 25.0063 22.3568 24.7469C22.8619 24.2417 23.7767 24.2417 24.2956 24.7469C24.5414 25.0063 24.6916 25.3613 24.6916 25.7163C24.6916 26.0713 24.5414 26.4263 24.2956 26.6858Z"
                                fill="white"/>
                        </svg>
                    </div>
                    <p className="modal-captcha__title">Новый сервер антикаптчи</p></div>
            }
            <div className="modal-captcha__tab-content">
                <div className="modal-captcha__form-title"><p>Информация</p></div>
                <div id="server-form" className="modal-captcha__form">
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>Название *</p>
                            <div className="modal-captcha__item-tooltip"><p>Наименование сервера.</p></div>
                        </div>
                        <div className="modal-captcha__label-box">
                            <label className="modal-captcha__label">
                                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} id="modalCaptchaNameInput" className="required"/>
                            </label>
                        </div>
                    </div>
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>IP-адрес*</p>
                            <div className="modal-captcha__item-tooltip"><p>IP адрес сервера, указывается в формате
                                255.255.255.255 или c добавление порта 255.255.255.255:8080.</p></div>
                        </div>
                        <div className="modal-captcha__label-box"><label className="modal-captcha__label">
                            <input id="modalCaptchaIpInput" className="required" value={formData.ip} onChange={(e) => setFormData({...formData, ip: e.target.value})}/></label></div>
                    </div>
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>api-ключ*</p>
                            <div className="modal-captcha__item-tooltip"><p>Api-ключ для доступа к серверу.</p></div>
                        </div>
                        <div className="modal-captcha__label-box"><label className="modal-captcha__label"><input
                            value={formData.apiKey} onChange={(e) => setFormData({...formData, apiKey: e.target.value})} id="modalCaptchaKeyInput" className="required"/></label></div>
                    </div>
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>дата оплаты сервера</p></div>
                        <div className="modal-captcha__label-box"><label className="modal-captcha__label"><input
                            value={formData.serverPaymentDate} onChange={(e) => setFormData({...formData, serverPaymentDate: e.target.value})} placeholder="гггг-мм-дд" id="modalCaptchaServPayInput"/></label></div>
                    </div>
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>дата оплаты софта</p></div>
                        <div className="modal-captcha__label-box"><label className="modal-captcha__label"><input
                            value={formData.softPaymentDate} onChange={(e) => setFormData({...formData, softPaymentDate: e.target.value})} placeholder="гггг-мм-дд" id="modalCaptchaSoftPayInput"/></label></div>
                    </div>
                    <div className="modal-captcha__form-item flex-33">
                        <div className="modal-captcha__item-title-box"><p>принадлежность</p>
                            <div className="modal-captcha__item-tooltip"><p>Можно указать кому принадлежит сервер, наш
                                собственный или арендованный.</p></div>
                        </div>
                        <div className="modal-captcha__label-box radio">
                            <label className={formData.affiliation === "OUR" ? "modal-captcha__label active-radio" : "modal-captcha__label"} onClick={() => setFormData({...formData, affiliation: "OUR"})}><input
                            value="OUR" type="radio" name="owner"/> <span className="modal-captcha__radio-icon"/>
                            <span className="text">Наш</span> <span className="modal-captcha__owner-icon"><svg
                                width="11" height="10" viewBox="0 0 11 10" fill="none"
                                xmlns="http://www.w3.org/2000/svg"><path
                                d="M11 4.30274C11 3.68509 10.6975 3.11353 10.1842 2.77244L6.5175 0.31104C5.90333 -0.103802 5.09667 -0.103802 4.4825 0.31104L0.815833 2.77244C0.311667 3.11353 0 3.68509 0 4.30274V9.53897C0 9.7971 0.201667 9.99991 0.458333 9.99991H10.5417C10.7983 9.99991 11 9.7971 11 9.53897V4.30274ZM5.5 7.69523C4.62 7.69523 3.89583 6.96695 3.89583 6.08196C3.89583 5.19696 4.62 4.46868 5.5 4.46868C6.38 4.46868 7.10417 5.19696 7.10417 6.08196C7.10417 6.96695 6.38 7.69523 5.5 7.69523Z"
                                fill="white"/></svg></span></label>
                            <label className={formData.affiliation === "RENT" ? "modal-captcha__label active-radio" : "modal-captcha__label"} onClick={() => setFormData({...formData, affiliation: "RENT"})}><input
                            value="RENT" type="radio" name="owner"/> <span className="modal-captcha__radio-icon"/>
                            <span className="text">Аренда</span> <span className="modal-captcha__owner-icon net"><svg
                                width="15" height="15" viewBox="0 0 15 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg"><path
                                d="M4.77891 13.0687C4.76016 13.0687 4.73516 13.0812 4.71641 13.0812C3.50391 12.4812 2.51641 11.4874 1.91016 10.2749C1.91016 10.2562 1.92266 10.2312 1.92266 10.2124C2.68516 10.4374 3.47266 10.6062 4.25391 10.7374C4.39141 11.5249 4.55391 12.3062 4.77891 13.0687Z"
                                fill="white"/><path
                                d="M13.0859 10.2811C12.4672 11.5249 11.4359 12.5311 10.1797 13.1374C10.4172 12.3436 10.6172 11.5436 10.7484 10.7374C11.5359 10.6061 12.3109 10.4374 13.0734 10.2124C13.0672 10.2374 13.0859 10.2624 13.0859 10.2811Z"
                                fill="white"/><path
                                d="M13.1359 4.81901C12.3484 4.58151 11.5547 4.38776 10.7484 4.25026C10.6172 3.44401 10.4234 2.64401 10.1797 1.86276C11.4734 2.48151 12.5172 3.52526 13.1359 4.81901Z"
                                fill="white"/><path
                                d="M4.78203 1.93052C4.55703 2.69302 4.39453 3.46802 4.26328 4.25552C3.45703 4.38052 2.65703 4.58052 1.86328 4.81802C2.46953 3.56177 3.47578 2.53052 4.71953 1.91177C4.73828 1.91177 4.76328 1.93052 4.78203 1.93052Z"
                                fill="white"/><path
                                d="M9.68281 4.11829C8.23281 3.95579 6.77031 3.95579 5.32031 4.11829C5.47656 3.26204 5.67656 2.40579 5.95781 1.58079C5.97031 1.53079 5.96406 1.49329 5.97031 1.44329C6.46406 1.32454 6.97031 1.24954 7.50156 1.24954C8.02656 1.24954 8.53906 1.32454 9.02656 1.44329C9.03281 1.49329 9.03281 1.53079 9.04531 1.58079C9.32656 2.41204 9.52656 3.26204 9.68281 4.11829Z"
                                fill="white"/><path
                                d="M4.11875 9.68229C3.25625 9.52604 2.40625 9.32604 1.58125 9.04479C1.53125 9.03229 1.49375 9.03854 1.44375 9.03229C1.325 8.53854 1.25 8.03229 1.25 7.50104C1.25 6.97604 1.325 6.46354 1.44375 5.97604C1.49375 5.96979 1.53125 5.96979 1.58125 5.95729C2.4125 5.68229 3.25625 5.47604 4.11875 5.31979C3.9625 6.76979 3.9625 8.23229 4.11875 9.68229Z"
                                fill="white"/><path
                                d="M13.7496 7.50104C13.7496 8.03229 13.6746 8.53854 13.5559 9.03229C13.5059 9.03854 13.4684 9.03229 13.4184 9.04479C12.5871 9.31979 11.7371 9.52604 10.8809 9.68229C11.0434 8.23229 11.0434 6.76979 10.8809 5.31979C11.7371 5.47604 12.5934 5.67604 13.4184 5.95729C13.4684 5.96979 13.5059 5.97604 13.5559 5.97604C13.6746 6.46979 13.7496 6.97604 13.7496 7.50104Z"
                                fill="white"/><path
                                d="M9.68281 10.8812C9.52656 11.7437 9.32656 12.5937 9.04531 13.4187C9.03281 13.4687 9.03281 13.5062 9.02656 13.5562C8.53906 13.6749 8.02656 13.7499 7.50156 13.7499C6.97031 13.7499 6.46406 13.6749 5.97031 13.5562C5.96406 13.5062 5.97031 13.4687 5.95781 13.4187C5.68281 12.5874 5.47656 11.7437 5.32031 10.8812C6.04531 10.9624 6.77031 11.0187 7.50156 11.0187C8.23281 11.0187 8.96406 10.9624 9.68281 10.8812Z"
                                fill="white"/><path
                                d="M9.85208 9.85162C8.2889 10.0488 6.7111 10.0488 5.14792 9.85162C4.95069 8.28844 4.95069 6.71064 5.14792 5.14746C6.7111 4.95024 8.2889 4.95024 9.85208 5.14746C10.0493 6.71064 10.0493 8.28844 9.85208 9.85162Z"
                                fill="white"/></svg></span></label></div>
                    </div>
                    <div className="modal-captcha__buttons">
                        <SaveButton
                            disable={!formData.name || !formData.affiliation || !formData.apiKey || !formData.ip}
                            onClick={editableServer ? tryEditServer : tryCreateSever}
                            isLoading={csIsLoading || esIsLoading}
                        />
                        <button type="button" className="modal-captcha__cancel-btn close" onClick={closeModal}><span>Отменить создание</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptchaServerForm;