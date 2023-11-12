import React, {useEffect, useState} from 'react';
import CSelect from "../UI/CSelect";
import {useApi} from "../../hooks/useApi";
import {message} from "antd";
import DelMenu from "./DelMenu";

const RouterForm = ({serverList, editable, closeModal, addNewItem, editCItem}) => {
    const emptyServer = { id: '', serverPort: '', updatePort: '' }
    const initialValue = {
        ip: '',
        name: '',
        location: '',
        servers: [
            {id: '', serverPort: '', updatePort: ''}
        ]
    }

    const [formData, setFormData] = useState(editable ? {...editable, servers: editable.servers.map(el => {
                return {...el, id: el.server.id}
            }) } : initialValue)
    const [selectedItem, setSelectedItem] = useState(0)

    const [createItem, ciIsLoading] = useApi({
        url: '/profile-monitoring-system/network/router/create',
        data: formData
    })

    const [editItem, editIsLoading] = useApi({
        url: '/profile-monitoring-system/network/' + editable.id + '/change',
        data: formData
    })

    const tryCreateItem = () => {
        createItem().then(resp => {
            addNewItem(resp.result[0])
            closeModal()
            message.success("Cеть " + resp.result[0].name + " создана")
        }).catch(err => message.error(err.message))
    }

    const tryEditItem = () => {
        editItem().then(resp => {
            message.success("Cеть " + formData.name + " отредактирована")
            editCItem(formData)
            closeModal()
        }).catch(err => message.error(err.message))
    }

    useEffect(() => {
        console.log(formData)
    },[formData])

    return (
        <div>
            <div className="modal-network__title-box">
                <div className="modal-network__icon" style={editable ? {"backgroundColor": "#5bc2ff"} : {}}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_3295_264279" style={{"maskType":"luminance"}} maskUnits="userSpaceOnUse" x="1" y="4"
                              width="32" height="28">
                            <path
                                d="M29.75 19.8333H4.25004C3.46764 19.8333 2.83337 20.4675 2.83337 21.2499V28.3333C2.83337 29.1157 3.46764 29.7499 4.25004 29.7499H29.75C30.5324 29.7499 31.1667 29.1157 31.1667 28.3333V21.2499C31.1667 20.4675 30.5324 19.8333 29.75 19.8333Z"
                                fill="white" stroke="white" strokeWidth="2.83333" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path d="M9.91669 24.7916H15.5834" stroke="black" strokeWidth="2.83333"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M24.0834 24.7917C24.0834 24.0093 23.4491 23.375 22.6667 23.375C21.8843 23.375 21.25 24.0093 21.25 24.7917C21.25 25.5741 21.8843 26.2083 22.6667 26.2083C23.4491 26.2083 24.0834 25.5741 24.0834 24.7917Z"
                                fill="black"/>
                            <path d="M8.50003 19.8333V5.66663M25.5 19.8333V5.66663" stroke="white"
                                  strokeWidth="2.83333" strokeLinecap="round" strokeLinejoin="round"/>
                        </mask>
                        <g mask="url(#mask0_3295_264279)">
                            <path d="M3.05176e-05 0H34V34H3.05176e-05V0Z" fill="white"/>
                        </g>
                    </svg>
                    </div>
                {editable ? <p className="modal-network__title">Редактировать роутер <b>{editable.name}</b></p> :
                    <p className="modal-network__title">Создание нового роутера</p>
                }</div>
            <div className="modal-network__form">
                <div className="modal-network__content modal-network-main">
                    <div className="modal-network__form-item flex-33">
                        <div className="modal-network__item-title-box"><p>Название</p></div>
                        <div className="modal-network__label-box"><label className="modal-network__label"><input
                            name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/></label></div>
                    </div>
                    <div className="modal-network__form-item flex-33">
                        <div className="modal-network__item-title-box"><p>ip-адрес</p></div>
                        <div className="modal-network__label-box"><label className="modal-network__label"><input
                            name="ip" value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})}/></label></div>
                    </div>
                    <div className="modal-network__form-item flex-33">
                        <div className="modal-network__item-title-box"><p>локация</p>
                            <div className="modal-network__item-tooltip"><p>Местонахождение сервера.</p></div>
                        </div>
                        <div className="modal-network__label-box"><label className="modal-network__label"><input
                            name="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}/></label></div>
                    </div>
                </div>
                <div className="modal-network__form-title"><p>Подключенные серверы</p></div>
                <div className="modal-network__content">
                    <div className="modal-network__servers">
                        <button type="button" className="modal-network__serv-add" onClick={() => setFormData({...formData, servers: [...formData.servers, emptyServer]})}><span className="icon"/> <span>Еще один сервер</span>
                        </button>
                        <div className="modal-network__servers-header">
                            <div className="modal-network__form-item flex-33">
                                <div className="modal-network__item-title-box"><p>выберите сервер</p></div>
                            </div>
                            <div className="modal-network__form-item flex-33">
                                <div className="modal-network__item-title-box"><p>порт 1. главный</p></div>
                            </div>
                            <div className="modal-network__form-item flex-33">
                                <div className="modal-network__item-title-box"><p>порт 2. перезагрузка</p></div>
                            </div>
                        </div>

                        {formData.servers.map((s, i) =>
                            <div
                                className={selectedItem === i ? "modal-network__servers-item active" : "modal-network__servers-item"}
                                onClick={() => setSelectedItem(i)}
                                key={i}>
                                <div className="modal-network__label-box">
                                    <CSelect val={s.server?.id} onChange={value => setFormData({...formData, servers: formData.servers.map((item, ind) => ind === i ? {...item, id: value } : item)})} list={serverList}/>
                                    <div className="modal-network__label flex-33">
                                        <input value={s.serverPort} onChange={(e) =>
                                            setFormData({...formData, servers: formData.servers.map((item, ind) => ind === i ? {...item, serverPort: e.target.value } : item)})
                                        } type="number" name="serverPort"/>
                                    </div>
                                    <div className="modal-network__label flex-33">
                                        <input value={s.updatePort} onChange={(e) =>
                                            setFormData({...formData, servers: formData.servers.map((item, ind) => ind === i ? {...item, updatePort: e.target.value } : item)})
                                        } type="number" name="updatePort"/>
                                    </div>
                                </div>
                                <DelMenu approved={() => {
                                    if (i !== 0) setFormData({...formData, servers: formData.servers.filter((ser, ind) => i !== ind) })
                                }}/>
                            </div>
                        )}

                    </div>
                </div>
                <div className="modal-network__buttons">
                    <button onClick={editable ? tryEditItem : tryCreateItem} type="submit" className="modal-network__submit"><span className="icon"><svg className="ok"
                                                                                                        width="22"
                                                                                                        height="22"
                                                                                                        viewBox="0 0 22 22"
                                                                                                        fill="none"
                                                                                                        xmlns="http://www.w3.org/2000/svg"><path
                        d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/></svg> <svg className="no" width="28"
                                                                                          height="28"
                                                                                          viewBox="0 0 28 28"
                                                                                          fill="none"
                                                                                          xmlns="http://www.w3.org/2000/svg"><path
                        d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"/><path d="M9.75 18.0131L17.7781 9.98497" stroke="white"
                                                             strokeWidth="2" strokeLinecap="round"
                                                             strokeLinejoin="round"/></svg> </span><span
                        className="submit-text">{(ciIsLoading || editIsLoading) ? "СОхранение" : "СОхранить"}</span></button>
                    <button onClick={closeModal} type="button" className="modal-network__cancel-btn close"><span>Отменить</span></button>
                </div>
            </div>
        </div>
    );
};

export default RouterForm;