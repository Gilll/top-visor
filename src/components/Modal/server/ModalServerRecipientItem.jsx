import React, {useState} from 'react';
import {Select} from "antd";
import {cutIp} from "../../../utils/tools";
import {useApi} from "../../../hooks/useApi";

const ModalServerRecipientItem = ({recipient, alertControl, settingId, serversControl, deleteItem, addItem, index}) => {
    const [sureDelIsOpen, setSureDelIsOpen] = useState(false);
    const [sureSaveIsOpen, setSureSaveIsOpen] = useState(false);
    const [delIsOpen, setDelIsOpen] = useState(Boolean(recipient.folderForRecording));
    const [saveIsOpen, setSaveIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(Boolean(recipient.folderForRecording));
    const [isActive, setIsActive] = useState(recipient.isActive);
    const [isChange, setIsChange] = useState(false);
    const [submitFunc, setSubmitFunc] = useState(null);

    const [recipientData, setRecipientData] = useState({
        folderForRecording: recipient.folderForRecording,
        isActive: true,
        serverId: recipient.id
    });

    const [addRecipient, addRecipientIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/${settingId}/recipient`,
        data: recipientData,
    });

    const [delRecipient, delRecipientIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/${settingId}/recipient/${recipient.recipientId}/delete`,
    });

    const [editRecipient, editRecipientIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/${settingId}/recipient/${recipient.recipientId}/change`,
        data: recipientData,
    });

    const [changeSentInServer, changeSentIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/${settingId}/recipient/${recipient.recipientId}/change`,
        data: {
            folderForRecording: recipient.folderForRecording,
            serverId: recipient.id,
            isActive: !recipient.isActive
        },
    });

    const onChangeSelect = (value) => {
        setRecipientData({...recipientData, serverId: value});
        if (!isCreate) {
            setDelIsOpen(true);
            setSaveIsOpen(true);
        }
        setIsChange(true);
    };

    const serversSelect = serversControl.get?.map((item, i) => {
        return {value: item.id, label: <div><span className='hide'>{i + 1}. </span><b>{item.name}</b> {cutIp(item.ip)}</div>}
    });

    const addRecipientHandle = () => {
        console.log('123')
        addRecipient().then((resp) => {
            if (resp.status === 'SUCCESS') {
                addItem(recipient.id, resp.result[0]);
                setIsActive(true);
                setIsCreate(true);
                setSaveIsOpen(false);
                setSureSaveIsOpen(false);
            }
        }).catch((err) => {
            alertControl.set({type: 'error', text: err.message, open: true});
            setSureSaveIsOpen(false);
        });
    }

    const delRecipientHandle = () => {
        if (recipient.folderForRecording) {
            delRecipient().then((resp) => {
                if (resp.status === 'SUCCESS') {
                    deleteItem();
                }
            });
        } else {
            deleteItem();
        }
    }

    function editRecipientHandle () {
        editRecipient().then((resp) => {
            if (resp.status === 'SUCCESS') {
                setIsChange(false);
                setSureSaveIsOpen(false);
            }
        });
    }

    return (
        <div className="modal-server__recipient-item">
            <p className="modal-server__recipient-item-number">{index}</p>
            <div className="modal-server__form-item flex-25">
                <div className="modal-server__label-box">
                    <Select
                        defaultValue={recipient.id >= 1000 || recipient.serverId ? (recipient.id || recipient.serverId) : ''}
                        onChange={onChangeSelect}
                        options={serversSelect}
                        placement={'bottomLeft'}
                        className='modal-server__recipient-list-btn'
                        dropdownClassName='modal-server__recipient-list'
                    />
                </div>
            </div>
            <div className="modal-server__form-item flex-75">
                <div className="modal-server__label-box">
                    <label className="modal-server__label">
                        <svg className="modal-server__label-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.3724 12.5587L22.2024 12.325C21.9049 11.9637 21.5543 11.6768 21.1506 11.4643C20.6087 11.1562 19.9924 10.9968 19.3549 10.9968H6.12681C5.48931 10.9968 4.88368 11.1562 4.33118 11.4643C3.91681 11.6875 3.54493 11.9956 3.23681 12.3781C2.63118 13.1537 2.34431 14.11 2.43993 15.0662L2.83306 20.0281C2.97118 21.5262 3.15181 23.3749 6.51993 23.3749H18.9724C22.3406 23.3749 22.5106 21.5262 22.6593 20.0175L23.0524 15.0768C23.1481 14.1843 22.9143 13.2918 22.3724 12.5587Z" fill="#FFC225"/>
                            <path d="M9.39772 17.0474C9.17681 17.0456 8.9963 17.2233 8.99454 17.4442C8.99278 17.6651 9.17044 17.8456 9.39134 17.8473L9.39772 17.0474ZM16.2806 17.7851C16.438 17.6301 16.44 17.3769 16.2851 17.2194L13.7599 14.6536C13.6049 14.4962 13.3517 14.4942 13.1942 14.6491C13.0368 14.8041 13.0347 15.0573 13.1897 15.2148L15.4343 17.4955L13.1536 19.7401C12.9962 19.8951 12.9942 20.1483 13.1491 20.3058C13.3041 20.4632 13.5573 20.4653 13.7148 20.3103L16.2806 17.7851ZM9.39134 17.8473L15.9968 17.9L16.0032 17.1L9.39772 17.0474L9.39134 17.8473Z" fill="white"/>
                            <path d="M21.8498 9.18666C21.8853 9.56971 21.4705 9.8265 21.107 9.70051C20.5555 9.50934 19.9737 9.41375 19.368 9.41375H6.12922C5.51939 9.41375 4.91926 9.51548 4.36152 9.70914C4.00237 9.83384 3.58984 9.58632 3.58984 9.20614V7.07625C3.58984 3.28312 4.74797 2.125 8.54109 2.125H9.79484C11.3142 2.125 11.7923 2.61375 12.4086 3.41062L13.6836 5.11063C13.9492 5.47187 13.9598 5.49312 14.4273 5.49312H16.9561C20.2983 5.49312 21.5913 6.3941 21.8498 9.18666Z" fill="#FFC225"/>
                        </svg>
                        <input placeholder="Путь к директории" type="text" defaultValue={recipient.folderForRecording || ''} onChange={(e) => {
                            setRecipientData({...recipientData, folderForRecording: e.target.value});
                            setIsChange(true);
                        }}/>
                    </label>
                    <div className="modal-server__label-buttons">
                        <button type="button"
                                className={"modal-server__label-switch-btn switch-btn" + (isActive ? ' active' : ' disable')}
                                style={{display: (isCreate ? 'flex' : 'none')}}
                                onClick={() => {
                                    setIsActive(!isActive);
                                    changeSentInServer().then((resp) => {
                                        if (resp.status === 'FAIL') {
                                            setIsActive(!isActive);
                                        }
                                    })}}
                        />
                        <button type="button" className={"modal-server__label-btn submit" + (isCreate ? ' active' : '') + (isChange ? '' : ' ok')} onClick={() => {
                            setSureSaveIsOpen(true);
                            setSubmitFunc(() => editRecipientHandle);
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button type="button" className={"modal-server__label-btn reset" + (saveIsOpen ? ' active' : '')} onClick={() => {
                            setSureSaveIsOpen(true);
                            setSubmitFunc(addRecipientHandle);
                        }}>
                            <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.3109 5.09636C14.3192 4.79886 13.2284 4.60052 11.9987 4.60052C6.5247 4.60052 2.08203 9.04319 2.08203 14.5172C2.08203 19.9912 6.5247 24.4339 11.9987 24.4339C17.4727 24.4339 21.9154 19.9912 21.9154 14.5172C21.9154 13.2891 21.6932 12.1183 21.2875 11.035" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16.722 5.37387L13.4297 1.58569" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16.7188 5.37402L12.8711 8.19035" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button type="button" className={"modal-server__label-btn del" + (delIsOpen ? ' active' : '')} onClick={() => setSureDelIsOpen(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.0697 5.23C19.4597 5.07 17.8497 4.95 16.2297 4.86V4.85L16.0097 3.55C15.8597 2.63 15.6397 1.25 13.2997 1.25H10.6797C8.34967 1.25 8.12967 2.57 7.96967 3.54L7.75967 4.82C6.82967 4.88 5.89967 4.94 4.96967 5.03L2.92967 5.23C2.50967 5.27 2.20967 5.64 2.24967 6.05C2.28967 6.46 2.64967 6.76 3.06967 6.72L5.10967 6.52C10.3497 6 15.6297 6.2 20.9297 6.73C20.9597 6.73 20.9797 6.73 21.0097 6.73C21.3897 6.73 21.7197 6.44 21.7597 6.05C21.7897 5.64 21.4897 5.27 21.0697 5.23Z" fill="#EB376D"/>
                                <path d="M19.2317 8.14C18.9917 7.89 18.6617 7.75 18.3217 7.75H5.6817C5.3417 7.75 5.0017 7.89 4.7717 8.14C4.5417 8.39 4.4117 8.73 4.4317 9.08L5.0517 19.34C5.1617 20.86 5.3017 22.76 8.7917 22.76H15.2117C18.7017 22.76 18.8417 20.87 18.9517 19.34L19.5717 9.09C19.5917 8.73 19.4617 8.39 19.2317 8.14ZM13.6617 17.75H10.3317C9.9217 17.75 9.5817 17.41 9.5817 17C9.5817 16.59 9.9217 16.25 10.3317 16.25H13.6617C14.0717 16.25 14.4117 16.59 14.4117 17C14.4117 17.41 14.0717 17.75 13.6617 17.75ZM14.5017 13.75H9.5017C9.0917 13.75 8.7517 13.41 8.7517 13C8.7517 12.59 9.0917 12.25 9.5017 12.25H14.5017C14.9117 12.25 15.2517 12.59 15.2517 13C15.2517 13.41 14.9117 13.75 14.5017 13.75Z" fill="#EB376D"/>
                            </svg>
                        </button>
                        <div className={"modal-server__sure-box del" + (sureDelIsOpen ? ' active' : '')}>
                            <p className="modal-server__sure-btn-text">Удалить сервер?</p>
                            <button type="button" className="modal-server__sure-btn" onClick={delRecipientHandle}>
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.0697 5.23171C19.4597 5.07171 17.8497 4.95171 16.2297 4.86171V4.85171L16.0097 3.55171C15.8597 2.63171 15.6397 1.25171 13.2997 1.25171H10.6797C8.34967 1.25171 8.12967 2.57171 7.96967 3.54171L7.75967 4.82171C6.82967 4.88171 5.89967 4.94171 4.96967 5.03171L2.92967 5.23171C2.50967 5.27171 2.20967 5.64171 2.24967 6.05171C2.28967 6.46171 2.64967 6.76171 3.06967 6.72171L5.10967 6.52171C10.3497 6.00171 15.6297 6.20171 20.9297 6.73171C20.9597 6.73171 20.9797 6.73171 21.0097 6.73171C21.3897 6.73171 21.7197 6.44171 21.7597 6.05171C21.7897 5.64171 21.4897 5.27171 21.0697 5.23171Z" fill="white"/>
                                    <path d="M19.2317 8.14171C18.9917 7.89171 18.6617 7.75171 18.3217 7.75171H5.6817C5.3417 7.75171 5.0017 7.89171 4.7717 8.14171C4.5417 8.39171 4.4117 8.73171 4.4317 9.08171L5.0517 19.3417C5.1617 20.8617 5.3017 22.7617 8.7917 22.7617H15.2117C18.7017 22.7617 18.8417 20.8717 18.9517 19.3417L19.5717 9.09171C19.5917 8.73171 19.4617 8.39171 19.2317 8.14171ZM13.6617 17.7517H10.3317C9.9217 17.7517 9.5817 17.4117 9.5817 17.0017C9.5817 16.5917 9.9217 16.2517 10.3317 16.2517H13.6617C14.0717 16.2517 14.4117 16.5917 14.4117 17.0017C14.4117 17.4117 14.0717 17.7517 13.6617 17.7517ZM14.5017 13.7517H9.5017C9.0917 13.7517 8.7517 13.4117 8.7517 13.0017C8.7517 12.5917 9.0917 12.2517 9.5017 12.2517H14.5017C14.9117 12.2517 15.2517 12.5917 15.2517 13.0017C15.2517 13.4117 14.9117 13.7517 14.5017 13.7517Z" fill="white"/>
                                </svg>
                                <span>Удалить</span>
                            </button>
                            <button type="button" className="modal-server__sure-cancel" onClick={() => setSureDelIsOpen(false)}>
                                <span>Отмена</span>
                            </button>
                        </div>
                        <div className={"modal-server__sure-box save" + (sureSaveIsOpen ? ' active' : '')}>
                            <p className="modal-server__sure-btn-text">Сохранить изменения?</p>
                            <button type="button" className="modal-server__sure-btn" onClick={submitFunc}>
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6.00366L9 17.0037L4 12.0037" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Да</span>
                            </button>
                            <button type="button" className="modal-server__sure-cancel" onClick={() => setSureSaveIsOpen(false)}>
                                <span>Отмена</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalServerRecipientItem;