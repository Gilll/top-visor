import React, {useEffect, useState} from 'react';
import {useApi} from "../hooks/useApi";
import PageIsLoading from "../components/PageIsLoading";
import ErrorOnPage from "../components/ErrorOnPage";
import EmptyPage from "../components/EmptyPage";
import {message} from "antd";
import ConfirmationForm from "../components/ConfirmationForm";
import {routeNames} from "../router/routeNames";

const Settings = () => {
    const [settings, setSettings] = useState([])
    const [serverErrors, setServerErrors] = useState('')
    const [formIsOpen, setFormIsOpen] = useState(false)
    const [selectedSettings, setSelectedSettings] = useState(0)
    const [confirmationModal, setConfirmationModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        iconLink: ''
    })

    const [getSettings, settingsIsLoading] = useApi({
        url: '/profile-monitoring-system/settings-type/all',
        method: 'GET'
    })

    const [addSetting, addSettingsIsLoading] = useApi({
        url: '/profile-monitoring-system/settings-type/add',
        data: formData
    })

    const tryAddSettings = () => {
        addSetting().then(resp => {
            setSettings([...settings, resp.result[0]])
            message.success("Настройки " + resp.result[0].name + " успешно созданы")
            setFormIsOpen(false)
        }).catch(err => message.error(err.message))
    }

    const [editSetting, editSettingsIsLoading] = useApi({
        url: '/profile-monitoring-system/settings-type/' + selectedSettings + '/change',
        data: formData
    })

    const tryEditSettings = () => {
        editSetting().then(resp => {
            setSettings(settings.map(el => el.id === selectedSettings ? resp.result[0] : el))
            setFormIsOpen(false)
            setSelectedSettings(0)
            message.success("Настройки " + resp.result[0].name + " успешно отредактированы")
        }).catch(err => message.error(err.message))
    }

    const [deleteSettings, deleteSettingsIsLoading] = useApi({
        url: "/profile-monitoring-system/settings-type/" + selectedSettings + "/delete"
    })

    const tryDeleteSettings = () => {
        deleteSettings().then(() => {
            setConfirmationModal(false)
            message.success('Настройки ' + settings.filter(el => el.id === selectedSettings)[0].name + ' удалены')
            setSettings(settings.filter(el => el.id !== selectedSettings))
            setSelectedSettings(0)
        }).catch(err => message.error(err.message))
    }

    useEffect(() => {
        getSettings().then(resp => {
            setSettings(resp.result)
        }).catch(err => setServerErrors(err.message))
    },[])

    return (
        <section className="main">
            <div className="main__header main__header--settings">
                <div><p className="main__title"><span>Настройки серверов</span></p></div>
                <div/>
            </div>
            <div className="main__content settings">
                <p className="settings__title">Типы настроек профилей</p>
                {settingsIsLoading ?
                    <PageIsLoading/> :
                    serverErrors ?
                        <ErrorOnPage>{serverErrors}</ErrorOnPage> :
                        <>
                            <div className="settings__content">
                                {settings.length > 0 ?
                                    settings.map(item =>
                                        <div className="settings__item" data-id="1000" key={item.id}>
                                            <div className="settings__icon-box">
                                                <p className="settings__item-name">иконка</p>
                                                <div className="settings__icon">
                                                    <img src={item.iconLink} alt=""/>
                                                </div>
                                            </div>
                                            <div className="settings__name-box">
                                                <p className="settings__item-name">Название</p>
                                                <p className="settings__name">{item.name}</p>
                                            </div>
                                            <button type="button" className="settings__edit-btn" onClick={() => {
                                                setSelectedSettings(item.id)
                                                setFormIsOpen(true)
                                                setFormData({
                                                    name: item.name,
                                                    iconLink: item.iconLink
                                                })
                                            }}>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M7.08876 1.00474L0.866469 7.22594C0.626689 7.46568 0.398907 7.93317 0.350951 8.2688L0.015261 10.6422C-0.104629 11.5053 0.494815 12.1046 1.35802 11.9847L3.73182 11.6491C4.06751 11.6012 4.53511 11.3734 4.77489 11.1337L10.9972 4.91247C12.0642 3.84563 12.5797 2.599 10.9972 1.01673C9.41463 -0.577532 8.16777 -0.07408 7.08876 1.00474Z"
                                                        fill="#8B98EE"/>
                                                    <path d="M6 2.25C6.50769 4.06154 7.92692 5.49231 9.75 6" stroke="#DFE1EB"
                                                          strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                                          strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button type="button" className="settings__del-btn" onClick={() => {
                                                setSelectedSettings(item.id)
                                                setConfirmationModal(true)
                                            }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M21.0736 5.23C19.4636 5.07 17.8536 4.95 16.2336 4.86V4.85L16.0136 3.55C15.8636 2.63 15.6436 1.25 13.3036 1.25H10.6836C8.35358 1.25 8.13357 2.57 7.97358 3.54L7.76358 4.82C6.83358 4.88 5.90358 4.94 4.97358 5.03L2.93358 5.23C2.51358 5.27 2.21358 5.64 2.25358 6.05C2.29358 6.46 2.65358 6.76 3.07358 6.72L5.11358 6.52C10.3536 6 15.6336 6.2 20.9336 6.73C20.9636 6.73 20.9836 6.73 21.0136 6.73C21.3936 6.73 21.7236 6.44 21.7636 6.05C21.7936 5.64 21.4936 5.27 21.0736 5.23Z"
                                                        fill="#EB376D"/>
                                                    <path
                                                        d="M19.2317 8.14C18.9917 7.89 18.6617 7.75 18.3217 7.75H5.6817C5.3417 7.75 5.0017 7.89 4.7717 8.14C4.5417 8.39 4.4117 8.73 4.4317 9.08L5.0517 19.34C5.1617 20.86 5.3017 22.76 8.7917 22.76H15.2117C18.7017 22.76 18.8417 20.87 18.9517 19.34L19.5717 9.09C19.5917 8.73 19.4617 8.39 19.2317 8.14ZM13.6617 17.75H10.3317C9.9217 17.75 9.5817 17.41 9.5817 17C9.5817 16.59 9.9217 16.25 10.3317 16.25H13.6617C14.0717 16.25 14.4117 16.59 14.4117 17C14.4117 17.41 14.0717 17.75 13.6617 17.75ZM14.5017 13.75H9.5017C9.0917 13.75 8.7517 13.41 8.7517 13C8.7517 12.59 9.0917 12.25 9.5017 12.25H14.5017C14.9117 12.25 15.2517 12.59 15.2517 13C15.2517 13.41 14.9117 13.75 14.5017 13.75Z"
                                                        fill="#EB376D"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ) : <EmptyPage/>
                                }
                            </div>
                            <div className={ formIsOpen ? "settings__add-box show" : "settings__add-box" }>
                                <button onClick={() => {
                                    setFormData({ name: '', iconLink: '' })
                                    setFormIsOpen(true)
                                    setSelectedSettings(0)
                                }} type="button" className="settings__add-btn"><span className="settings__add-btn-icon"><svg
                                    width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path
                                    d="M13 5.41663V20.5833" stroke="white" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"/><path d="M5.41797 13H20.5846" stroke="white" strokeWidth="2"
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"/></svg> </span><span
                                    className="settings__add-btn-text">Добавить ещё тип</span></button>
                                <div className="settings__add">
                                    <p className="settings__add-title">
                                        {selectedSettings ?
                                            <span className="new">Редактирование</span> :
                                            <span className="new">Добавить ещё тип</span>
                                        }
                                    </p>
                                    <div className="settings__add-form">
                                        <div className="settings__add-form-item"><p className="settings__form-item-name">ссылка на
                                            иконку</p><label className="settings__form-label settings__form-label--link"><input
                                            id="settings-icon-file" value={formData.iconLink} onChange={e => setFormData({...formData, iconLink: e.target.value})}/></label></div>
                                        <div className="settings__add-form-item"><p
                                            className="settings__form-item-name">Название</p><label
                                            className="settings__form-label settings__form-label--name">
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
                                        </label></div>
                                    </div>
                                    <div className="settings__buttons">
                                        <button onClick={selectedSettings ? tryEditSettings : tryAddSettings} type="button" className={ (formData.name.trim() && formData.iconLink.trim()) ? "settings__submit" : "settings__submit disable" }>
                                            <span className="icon"><svg
                                            className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                            xmlns="http://www.w3.org/2000/svg"><path d="M17.9167 4.99994L8.75 14.1758L6 11.4258"
                                                                                     stroke="white" strokeWidth="2"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"/></svg> <svg
                                            className="no" width="28" height="28" viewBox="0 0 28 28" fill="none"
                                            xmlns="http://www.w3.org/2000/svg"><path d="M9.74805 9.98572L17.7761 18.0138"
                                                                                     stroke="white" strokeWidth="2"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"/><path
                                            d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round"/></svg> </span>
                                            <span className="submit-text">{(addSettingsIsLoading || editSettingsIsLoading) ? "Сохранение" : "Сохранить"}</span>
                                        </button>
                                        <button type="button" className="settings__cancel-btn" onClick={() => {
                                            setFormIsOpen(false)
                                            setSelectedSettings(0)
                                            setFormData({
                                                name: '',
                                                iconLink: ''
                                            })
                                        }}><span>Отменить создание</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ConfirmationForm
                                visible={confirmationModal}
                                onOK={tryDeleteSettings}
                                isLoading={deleteSettingsIsLoading}
                                onCancel={() => setConfirmationModal(false)}
                            >
                                <div className="modal-confirm__icon">
                                    <svg className="server" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0.4688 0.455778C-4.76837e-08 0.911556 0 1.64422 0 3.11111C0 4.578 -4.76837e-08 5.31067 0.4688 5.76644C0.9376 6.22222 1.6912 6.22222 3.2 6.22222H12.8C14.3088 6.22222 15.0624 6.22222 15.5312 5.76644C16 5.31067 16 4.578 16 3.11111C16 1.64422 16 0.911556 15.5312 0.455778C15.0624 -4.63592e-08 14.3088 0 12.8 0H3.2C1.6912 0 0.9376 -4.63592e-08 0.4688 0.455778ZM5.6 4.47222C5.44087 4.47222 5.28826 4.41076 5.17574 4.30137C5.06321 4.19197 5 4.0436 5 3.88889V2.33333C5 2.17862 5.06321 2.03025 5.17574 1.92085C5.28826 1.81146 5.44087 1.75 5.6 1.75C5.75913 1.75 5.91174 1.81146 6.02426 1.92085C6.13679 2.03025 6.2 2.17862 6.2 2.33333V3.88889C6.2 4.0436 6.13679 4.19197 6.02426 4.30137C5.91174 4.41076 5.75913 4.47222 5.6 4.47222ZM9.2 2.52778C9.04087 2.52778 8.88826 2.58924 8.77574 2.69863C8.66321 2.80803 8.6 2.9564 8.6 3.11111C8.6 3.26582 8.66321 3.41419 8.77574 3.52359C8.88826 3.63299 9.04087 3.69444 9.2 3.69444H12.8C12.9591 3.69444 13.1117 3.63299 13.2243 3.52359C13.3368 3.41419 13.4 3.26582 13.4 3.11111C13.4 2.9564 13.3368 2.80803 13.2243 2.69863C13.1117 2.58924 12.9591 2.52778 12.8 2.52778H9.2ZM3.2 4.47222C3.04087 4.47222 2.88826 4.41076 2.77574 4.30137C2.66321 4.19197 2.6 4.0436 2.6 3.88889V2.33333C2.6 2.17862 2.66321 2.03025 2.77574 1.92085C2.88826 1.81146 3.04087 1.75 3.2 1.75C3.35913 1.75 3.51174 1.81146 3.62426 1.92085C3.73679 2.03025 3.8 2.17862 3.8 2.33333V3.88889C3.8 4.0436 3.73679 4.19197 3.62426 4.30137C3.51174 4.41076 3.35913 4.47222 3.2 4.47222ZM0.4688 8.23356C-4.76837e-08 8.68933 0 9.422 0 10.8889C0 12.3558 -4.76837e-08 13.0884 0.4688 13.5442C0.9376 14 1.6912 14 3.2 14H12.8C14.3088 14 15.0624 14 15.5312 13.5442C16 13.0884 16 12.3558 16 10.8889C16 9.422 16 8.68933 15.5312 8.23356C15.0624 7.77778 14.3088 7.77778 12.8 7.77778H3.2C1.6912 7.77778 0.9376 7.77778 0.4688 8.23356ZM8.6 10.8889C8.6 10.7342 8.66321 10.5858 8.77574 10.4764C8.88826 10.367 9.04087 10.3056 9.2 10.3056H12.8C12.9591 10.3056 13.1117 10.367 13.2243 10.4764C13.3368 10.5858 13.4 10.7342 13.4 10.8889C13.4 11.0436 13.3368 11.192 13.2243 11.3014C13.1117 11.4108 12.9591 11.4722 12.8 11.4722H9.2C9.04087 11.4722 8.88826 11.4108 8.77574 11.3014C8.66321 11.192 8.6 11.0436 8.6 10.8889ZM2.6 11.6667C2.6 11.8214 2.66321 11.9698 2.77574 12.0791C2.88826 12.1885 3.04087 12.25 3.2 12.25C3.35913 12.25 3.51174 12.1885 3.62426 12.0791C3.73679 11.9698 3.8 11.8214 3.8 11.6667V10.1111C3.8 9.9564 3.73679 9.80803 3.62426 9.69863C3.51174 9.58924 3.35913 9.52778 3.2 9.52778C3.04087 9.52778 2.88826 9.58924 2.77574 9.69863C2.66321 9.80803 2.6 9.9564 2.6 10.1111V11.6667ZM5.6 12.25C5.44087 12.25 5.28826 12.1885 5.17574 12.0791C5.06321 11.9698 5 11.8214 5 11.6667V10.1111C5 9.9564 5.06321 9.80803 5.17574 9.69863C5.28826 9.58924 5.44087 9.52778 5.6 9.52778C5.75913 9.52778 5.91174 9.58924 6.02426 9.69863C6.13679 9.80803 6.2 9.9564 6.2 10.1111V11.6667C6.2 11.8214 6.13679 11.9698 6.02426 12.0791C5.91174 12.1885 5.75913 12.25 5.6 12.25Z"
                                              fill="#5BC2FF"/>
                                    </svg>
                                    <svg className="group" width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{"display": "none"}}>
                                        <path
                                            d="M10.5179 19.3334H14.25C18.05 19.3334 19 18.3667 19 14.5001V8.70006C19 4.83339 18.05 3.86673 14.25 3.86673H11.4C10.45 3.86673 10.2464 3.57673 9.88 3.09339L8.455 1.16006C7.91214 0.428156 7.6 6.10352e-05 6.175 6.10352e-05H4.75C0.95 6.10352e-05 0 0.966727 0 4.83339V14.5001C0 18.3667 0.95 19.3334 4.75 19.3334H8.48214V23.4763C8.48214 23.5453 8.50928 23.6005 8.52286 23.6696C7.81714 23.9458 7.24799 24.4843 6.97656 25.2024C6.90871 25.1886 6.85357 25.2024 6.78571 25.2024H1.35714C0.800714 25.2024 0.339286 25.672 0.339286 26.2382C0.339286 26.8043 0.800714 27.2739 1.35714 27.2739H6.78571C6.85357 27.2739 6.90871 27.2877 6.97656 27.2739C7.37013 28.3096 8.34643 29.0001 9.5 29.0001C10.6536 29.0001 11.6307 28.3096 12.0243 27.2739C12.0921 27.2877 12.1464 27.2739 12.2143 27.2739H17.6429C18.1993 27.2739 18.6607 26.8043 18.6607 26.2382C18.6607 25.672 18.1993 25.2024 17.6429 25.2024H12.2143C12.1464 25.2024 12.0747 25.1886 12.0068 25.2024C11.7354 24.4843 11.1829 23.9458 10.4771 23.6696C10.4907 23.6005 10.5179 23.5453 10.5179 23.4763V19.3334Z"
                                            fill="white"/>
                                        <path
                                            d="M11.25 26.2501C11.25 27.2166 10.4665 28.0001 9.5 28.0001C8.5335 28.0001 7.75 27.2166 7.75 26.2501C7.75 25.2836 8.5335 24.5001 9.5 24.5001C10.4665 24.5001 11.25 25.2836 11.25 26.2501Z"
                                            fill="#EB376D"/>
                                    </svg>
                                </div>
                                {selectedSettings &&
                                    <p className="modal-confirm__title">Удалить настройки <b>{settings.filter(el => el.id === selectedSettings)[0].name}</b></p>
                                }
                            </ConfirmationForm>
                        </>
                }

            </div>
        </section>
    );
};

export default Settings;