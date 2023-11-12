import React, {useEffect, useState} from 'react';
import ModalServerRecipient from "./ModalServerRecipient";
import {Dropdown, Form, Select} from "antd";
import {useApi} from "../../../hooks/useApi";

const ModalServerThreadTab = ({modalServerControl, serversControl, iconSelectItems, setLastCompleteTab, alertControl, tabKey, thread}) => {
    const initialForm = {
        isActive: true,
        numberOfDaysFileStored: 30,
        numberOfProfiles: 30,
        serverId: modalServerControl.get.server?.id,
        folderForReading: null,
        isSendingCopies: null,
        maxSuccessTransferredProfilesPerDay: null,
        name: null,
        sendingPeriod: null,
        settingsTypeId: null
    };
    const [formValues, setFormValues] = useState(thread ?? initialForm);

    useEffect(() => {
        if (thread) {
            setSendingValue(thread.isSendingCopies);
            setIsThreadComplete(true);
        }
    }, [thread]);

    const [isThreadComplete, setIsThreadComplete] = useState(false);
    const [sendingValue, setSendingValue] = useState(null);
    const [iconSelected, setIconSelected] = useState(null);

    const onChangeSending = ({target: {value}}) => {
        setSendingValue(value);
    };

    const [form] = Form.useForm();

    const [addThread, addThreadIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/settings/add',
        data: {},
    });

    const [editThread, editThreadIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/${thread?.id}/change`,
        data: {},
    });

    const [serverUpdate, serverUpIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 1,
            numberPage: 0,
            serverIds: [modalServerControl.get.server.id],
        },
    });

    const onValuesChange = (value) => {
        if (value.isSendingCopies) {
            value.isSendingCopies = value.isSendingCopies === 'true';
        }

        setFormValues({...formValues, ...value});
    };

    const onFinish = () => {
        if (thread) {
            editThread(formValues).then((resp) => {
                modalServerControl.set({
                    ...modalServerControl.get,
                    threads: modalServerControl.get.threads.map((el) => {
                        if (el.id === thread.id) return resp.result[0];
                        return el;
                    }),
                });

                serverUpdate().then((resp) => {
                    serversControl.set(serversControl.get.map((item) => {
                        if (item.id === resp.result[0].id) {
                            return resp.result[0];
                        }

                        return item;
                    }));
                });
            });
        } else {
            addThread(formValues).then((resp) => {
                if (resp.status === 'SUCCESS') {
                    modalServerControl.set({
                            ...modalServerControl.get,
                            threads: modalServerControl.get.threads ? [...modalServerControl.get?.threads, resp.result[0]] : [resp.result[0]]
                        });
                    setLastCompleteTab(tabKey);
                    setIsThreadComplete(true);

                    serverUpdate().then((resp) => {
                        serversControl.set(serversControl.get.map((item) => {
                            if (item.id === resp.result[0].id) {
                                return resp.result[0];
                            }

                            return item;
                        }));
                    });
                }
            });
        }
    };

    const onFinishFailed = () => {};

    useEffect(() => setFormValues({...formValues, settingsTypeId: iconSelected.id}), [iconSelected]);

    const items = iconSelectItems.map((item, i) => {
        if (thread && !iconSelected && thread.settingsTypeId === item.id) setIconSelected(item);
        if (!thread && i === 0 && !iconSelected) setIconSelected(item);
        return {
            label: <button type='button' className='modal-server__icon-select-item' onClick={() => setIconSelected(item)}><img src={item.src} alt=''/></button>,
            key: item.id,
        }
    });

    return (
        <div className="modal-server__tab-content">
            <div className="modal-server__form-title">
                <p>Настройки потока {tabKey - 1}</p>
                <button type="button" className="modal-server__del-btn">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.0697 5.23171C19.4597 5.07171 17.8497 4.95171 16.2297 4.86171V4.85171L16.0097 3.55171C15.8597 2.63171 15.6397 1.25171 13.2997 1.25171H10.6797C8.34967 1.25171 8.12967 2.57171 7.96967 3.54171L7.75967 4.82171C6.82967 4.88171 5.89967 4.94171 4.96967 5.03171L2.92967 5.23171C2.50967 5.27171 2.20967 5.64171 2.24967 6.05171C2.28967 6.46171 2.64967 6.76171 3.06967 6.72171L5.10967 6.52171C10.3497 6.00171 15.6297 6.20171 20.9297 6.73171C20.9597 6.73171 20.9797 6.73171 21.0097 6.73171C21.3897 6.73171 21.7197 6.44171 21.7597 6.05171C21.7897 5.64171 21.4897 5.27171 21.0697 5.23171Z" fill="white"/>
                        <path d="M19.2297 8.14171C18.9897 7.89171 18.6597 7.75171 18.3197 7.75171H5.67975C5.33975 7.75171 4.99975 7.89171 4.76975 8.14171C4.53975 8.39171 4.40975 8.73171 4.42975 9.08171L5.04975 19.3417C5.15975 20.8617 5.29975 22.7617 8.78975 22.7617H15.2097C18.6997 22.7617 18.8398 20.8717 18.9497 19.3417L19.5697 9.09171C19.5897 8.73171 19.4597 8.39171 19.2297 8.14171ZM13.6597 17.7517H10.3297C9.91975 17.7517 9.57975 17.4117 9.57975 17.0017C9.57975 16.5917 9.91975 16.2517 10.3297 16.2517H13.6597C14.0697 16.2517 14.4097 16.5917 14.4097 17.0017C14.4097 17.4117 14.0697 17.7517 13.6597 17.7517ZM14.4997 13.7517H9.49975C9.08975 13.7517 8.74975 13.4117 8.74975 13.0017C8.74975 12.5917 9.08975 12.2517 9.49975 12.2517H14.4997C14.9097 12.2517 15.2497 12.5917 15.2497 13.0017C15.2497 13.4117 14.9097 13.7517 14.4997 13.7517Z" fill="white"/>
                    </svg>
                    <span>Удалить поток</span>
                </button>
                <div className="modal-server__sure-box del">
                    <p className="modal-server__sure-btn-text">Удалить поток?</p>
                    <button type="button" className="modal-server__sure-btn">
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.0697 5.23171C19.4597 5.07171 17.8497 4.95171 16.2297 4.86171V4.85171L16.0097 3.55171C15.8597 2.63171 15.6397 1.25171 13.2997 1.25171H10.6797C8.34967 1.25171 8.12967 2.57171 7.96967 3.54171L7.75967 4.82171C6.82967 4.88171 5.89967 4.94171 4.96967 5.03171L2.92967 5.23171C2.50967 5.27171 2.20967 5.64171 2.24967 6.05171C2.28967 6.46171 2.64967 6.76171 3.06967 6.72171L5.10967 6.52171C10.3497 6.00171 15.6297 6.20171 20.9297 6.73171C20.9597 6.73171 20.9797 6.73171 21.0097 6.73171C21.3897 6.73171 21.7197 6.44171 21.7597 6.05171C21.7897 5.64171 21.4897 5.27171 21.0697 5.23171Z" fill="white"/>
                            <path d="M19.2317 8.14171C18.9917 7.89171 18.6617 7.75171 18.3217 7.75171H5.6817C5.3417 7.75171 5.0017 7.89171 4.7717 8.14171C4.5417 8.39171 4.4117 8.73171 4.4317 9.08171L5.0517 19.3417C5.1617 20.8617 5.3017 22.7617 8.7917 22.7617H15.2117C18.7017 22.7617 18.8417 20.8717 18.9517 19.3417L19.5717 9.09171C19.5917 8.73171 19.4617 8.39171 19.2317 8.14171ZM13.6617 17.7517H10.3317C9.9217 17.7517 9.5817 17.4117 9.5817 17.0017C9.5817 16.5917 9.9217 16.2517 10.3317 16.2517H13.6617C14.0717 16.2517 14.4117 16.5917 14.4117 17.0017C14.4117 17.4117 14.0717 17.7517 13.6617 17.7517ZM14.5017 13.7517H9.5017C9.0917 13.7517 8.7517 13.4117 8.7517 13.0017C8.7517 12.5917 9.0917 12.2517 9.5017 12.2517H14.5017C14.9117 12.2517 15.2517 12.5917 15.2517 13.0017C15.2517 13.4117 14.9117 13.7517 14.5017 13.7517Z" fill="white"/>
                        </svg>
                        <span>Удалить</span>
                    </button>
                    <button type="button" className="modal-server__sure-cancel">
                        <span>Отмена</span>
                    </button>
                </div>
            </div>
            <Form className="modal-server__form thread-form"
                  initialValues={thread ?? initialForm}
                  form={form}
                  onValuesChange={onValuesChange}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
            >
                <Form.Item noStyle name='settingsTypeId'>
                    <div className="modal-server__form-item flex-5">
                        <div className="modal-server__item-title-box">
                            <p>Иконка</p>
                        </div>
                        <div className="modal-server__icon-select-box">
                            <Dropdown
                                menu={{items}}
                                trigger={['click']}
                                overlayClassName="modal-server__icon-select-list"
                            >
                                <div className="modal-server__icon-select-btn">
                                    <div className="modal-server__icon-select">
                                        <img src={iconSelected?.src} alt=""/>
                                    </div>
                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 0.999573L7 6.99957L13 0.999573" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item noStyle name='name'>
                    <div className="modal-server__form-item flex-20">
                        <div className="modal-server__item-title-box">
                            <p>Название</p>
                            <div className="modal-server__item-tooltip">
                                <p>Наименование потока</p>
                            </div>
                        </div>
                        <div className="modal-server__label-box">
                            <label className="modal-server__label">
                                <input defaultValue={thread?.name ?? ''} type="text"/>
                            </label>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item noStyle name='isSendingCopies'>
                    <div className="modal-server__form-item flex-50">
                        <div className="modal-server__item-title-box">
                            <p>режим отправки</p>
                            <div className="modal-server__item-tooltip">
                                <p>Режим отправки профилей с потока. Копирование - копирует во все указанные папки. Распределение - распределяет по указанным папкам.</p>
                            </div>
                        </div>
                        <div className="modal-server__label-box radio">
                            <Form.Item noStyle>
                                <label className={"modal-server__label" + (sendingValue === 'true' || sendingValue === true ? ' active-radio' : '')}>
                                    <input name='sendingCopies' value={true} type="radio" onChange={onChangeSending} checked={sendingValue === true}/>
                                    <span className="modal-server__radio-icon"/>
                                    <span className="text">Копирование</span>
                                    <svg className="modal-server__status-icon" width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.5597 5.18655L12.9439 2.6853C12.1197 2.32113 10.8739 2.32113 10.0497 2.6853L4.43385 5.18655C3.01552 5.81905 2.80469 6.68155 2.80469 7.14155C2.80469 7.60155 3.01552 8.46405 4.43385 9.09655L10.0497 11.5978C10.4618 11.7799 10.9793 11.8757 11.4968 11.8757C12.0143 11.8757 12.5318 11.7799 12.9439 11.5978L18.5597 9.09655C19.978 8.46405 20.1889 7.60155 20.1889 7.14155C20.1889 6.68155 19.9876 5.81905 18.5597 5.18655Z" fill="#A1B1C5"/>
                                        <path d="M10.4191 16.6554L10.4198 16.6557C10.7613 16.802 11.1321 16.8801 11.5032 16.8801C11.8743 16.8801 12.2453 16.8021 12.5776 16.6555L12.5777 16.6554L19.0369 13.7804L19.037 13.7804C19.5409 13.5553 19.9863 13.1407 20.3056 12.6478C20.6248 12.155 20.8203 11.5803 20.8203 11.0322C20.8203 10.6117 20.4817 10.2731 20.0611 10.2731C19.6406 10.2731 19.302 10.6117 19.302 11.0322C19.302 11.2833 19.1987 11.571 19.0346 11.8231C18.8704 12.0752 18.6496 12.2852 18.4214 12.3856L18.4212 12.3857L11.9624 15.2606C11.9623 15.2606 11.9622 15.2606 11.9621 15.2607C11.6684 15.3891 11.3285 15.3891 11.0347 15.2607C11.0347 15.2606 11.0346 15.2606 11.0345 15.2606L4.57564 12.3857L4.57545 12.3856C4.34749 12.2853 4.12664 12.0731 3.96237 11.8196C3.79811 11.5662 3.6949 11.2785 3.6949 11.0322C3.6949 10.6117 3.35626 10.2731 2.93573 10.2731C2.5152 10.2731 2.17656 10.6117 2.17656 11.0322C2.17656 11.585 2.37202 12.1598 2.69135 12.6515C3.01067 13.1432 3.45606 13.5554 3.95992 13.7804L3.95998 13.7804L10.4191 16.6554Z" fill="#A1B1C5" stroke="#A1B1C5" strokeWidth="0.1"/>
                                        <path d="M10.4191 21.4086L10.4198 21.4089C10.7613 21.5552 11.1321 21.6333 11.5032 21.6333C11.8743 21.6333 12.2453 21.5552 12.5776 21.4086L12.5777 21.4086L19.0369 18.5336L19.0371 18.5335C20.1186 18.0463 20.8203 16.9745 20.8203 15.7854C20.8203 15.3649 20.4817 15.0262 20.0611 15.0262C19.6406 15.0262 19.302 15.3649 19.302 15.7854C19.302 16.3694 18.9495 16.9072 18.4215 17.1388L18.4212 17.1389L11.9624 20.0138C11.9623 20.0138 11.9622 20.0138 11.9621 20.0138C11.6684 20.1423 11.3285 20.1423 11.0347 20.0138C11.0347 20.0138 11.0346 20.0138 11.0345 20.0138L4.57577 17.1389C4.57575 17.1389 4.57573 17.1389 4.57571 17.1389C4.03775 16.8977 3.6949 16.3693 3.6949 15.7854C3.6949 15.3649 3.35626 15.0262 2.93573 15.0262C2.5152 15.0262 2.17656 15.3649 2.17656 15.7854C2.17656 16.9742 2.87811 18.056 3.96012 18.5336L10.4191 21.4086Z" fill="#A1B1C5" stroke="#A1B1C5" strokeWidth="0.1"/>
                                    </svg>
                                </label>
                            </Form.Item>
                            <Form.Item noStyle>
                                <label className={"modal-server__label" + (sendingValue === 'false' || sendingValue === false ? ' active-radio' : '')}>
                                    <input name='sendingCopies' value={false} type="radio" onChange={onChangeSending} checked={sendingValue === false}/>
                                    <span className="modal-server__radio-icon"/>
                                    <span className="text">Распределение</span>
                                    <svg className="modal-server__status-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.22314 7.70011H4.04707C2.88251 7.70011 1.92969 6.83388 1.92969 5.77517V3.85023C1.92969 2.79151 2.88251 1.92529 4.04707 1.92529H7.22314C8.3877 1.92529 9.34052 2.79151 9.34052 3.85023V5.77517C9.34052 6.83388 8.3877 7.70011 7.22314 7.70011Z" fill="#A1B1C5"/>
                                        <path d="M21.8356 6.73781H18.0243C17.3256 6.73781 16.7539 6.21808 16.7539 5.58285V4.0429C16.7539 3.40767 17.3256 2.88794 18.0243 2.88794H21.8356C22.5344 2.88794 23.1061 3.40767 23.1061 4.0429V5.58285C23.1061 6.21808 22.5344 6.73781 21.8356 6.73781Z" fill="#A1B1C5"/>
                                        <path d="M21.8356 13.9561H18.0243C17.3256 13.9561 16.7539 13.4363 16.7539 12.8011V11.2612C16.7539 10.6259 17.3256 10.1062 18.0243 10.1062H21.8356C22.5344 10.1062 23.1061 10.6259 23.1061 11.2612V12.8011C23.1061 13.4363 22.5344 13.9561 21.8356 13.9561Z" fill="#A1B1C5"/>
                                        <path opacity="0.96" d="M16.7478 12.7528C17.1819 12.7528 17.5418 12.4256 17.5418 12.0309C17.5418 11.6363 17.1819 11.3091 16.7478 11.3091H13.8364V5.53428H16.7478C17.1819 5.53428 17.5418 5.20704 17.5418 4.81243C17.5418 4.41782 17.1819 4.09058 16.7478 4.09058H9.33699C8.90292 4.09058 8.54297 4.41782 8.54297 4.81243C8.54297 5.20704 8.90292 5.53428 9.33699 5.53428H12.2484V17.3245C12.2484 18.7875 13.5506 19.9713 15.1598 19.9713H16.7478C17.1819 19.9713 17.5418 19.6441 17.5418 19.2495C17.5418 18.8548 17.1819 18.5276 16.7478 18.5276H15.1598C14.4293 18.5276 13.8364 17.9886 13.8364 17.3245V12.7528H16.7478Z" fill="#A1B1C5"/>
                                        <path d="M21.8356 21.1746H18.0243C17.3256 21.1746 16.7539 20.6548 16.7539 20.0196V18.4797C16.7539 17.8444 17.3256 17.3247 18.0243 17.3247H21.8356C22.5344 17.3247 23.1061 17.8444 23.1061 18.4797V20.0196C23.1061 20.6548 22.5344 21.1746 21.8356 21.1746Z" fill="#A1B1C5"/>
                                    </svg>
                                </label>
                            </Form.Item>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item noStyle name='sendingPeriod'>
                    <div className="modal-server__form-item flex-25">
                        <div className="modal-server__item-title-box">
                            <p>Период отправки (мин)</p>
                            <div className="modal-server__item-tooltip">
                                <p>Периодичность с которой будет производится отправка профилей.</p>
                            </div>
                        </div>
                        <div className="modal-server__label-box">
                            <label className="modal-server__label">
                                <input defaultValue={thread?.sendingPeriod ?? ''} className="thread-period" placeholder="Например, 25" type="text"/>
                            </label>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item noStyle name='maxSuccessTransferredProfilesPerDay'>
                    <div className="modal-server__form-item flex-25">
                        <div className="modal-server__item-title-box">
                            <p>лимит отправки в сутки</p>
                            <div className="modal-server__item-tooltip">
                                <p>Количество профилей которое можно отправить за сутки.</p>
                            </div>
                        </div>
                        <div className="modal-server__label-box">
                            <label className="modal-server__label">
                                <input defaultValue={thread?.maxSuccessTransferredProfilesPerDay ?? ''} className="max-send" placeholder="Например, 3000" type="text"/>
                            </label>
                        </div>
                    </div>
                </Form.Item>
                <Form.Item noStyle name='folderForReading'>
                    <div className="modal-server__form-item flex-75">
                        <div className="modal-server__item-title-box">
                            <p>директория откуда</p>
                            <div className="modal-server__item-tooltip">
                                <p>Директория из которой будут отправляться профили.</p>
                            </div>
                        </div>
                        <div className="modal-server__label-box">
                            <label className="modal-server__label">
                                <span className="modal-server__label-icon server-icon">
                                    <img src={iconSelected?.src} alt=""/>
                                </span>
                                <svg className="modal-server__label-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.3724 12.5587L22.2024 12.325C21.9049 11.9637 21.5543 11.6768 21.1506 11.4643C20.6087 11.1562 19.9924 10.9968 19.3549 10.9968H6.12681C5.48931 10.9968 4.88368 11.1562 4.33118 11.4643C3.91681 11.6875 3.54493 11.9956 3.23681 12.3781C2.63118 13.1537 2.34431 14.11 2.43993 15.0662L2.83306 20.0281C2.97118 21.5262 3.15181 23.3749 6.51993 23.3749H18.9724C22.3406 23.3749 22.5106 21.5262 22.6593 20.0175L23.0524 15.0768C23.1481 14.1843 22.9143 13.2918 22.3724 12.5587Z" fill="#FFC225"/>
                                    <path d="M9.39772 17.0474C9.17681 17.0456 8.9963 17.2233 8.99454 17.4442C8.99278 17.6651 9.17044 17.8456 9.39134 17.8473L9.39772 17.0474ZM16.2806 17.7851C16.438 17.6301 16.44 17.3769 16.2851 17.2194L13.7599 14.6536C13.6049 14.4962 13.3517 14.4942 13.1942 14.6491C13.0368 14.8041 13.0347 15.0573 13.1897 15.2148L15.4343 17.4955L13.1536 19.7401C12.9962 19.8951 12.9942 20.1483 13.1491 20.3058C13.3041 20.4632 13.5573 20.4653 13.7148 20.3103L16.2806 17.7851ZM9.39134 17.8473L15.9968 17.9L16.0032 17.1L9.39772 17.0474L9.39134 17.8473Z" fill="white"/>
                                    <path d="M21.8498 9.18666C21.8853 9.56971 21.4705 9.8265 21.107 9.70051C20.5555 9.50934 19.9737 9.41375 19.368 9.41375H6.12922C5.51939 9.41375 4.91926 9.51548 4.36152 9.70914C4.00237 9.83384 3.58984 9.58632 3.58984 9.20614V7.07625C3.58984 3.28312 4.74797 2.125 8.54109 2.125H9.79484C11.3142 2.125 11.7923 2.61375 12.4086 3.41062L13.6836 5.11063C13.9492 5.47187 13.9598 5.49312 14.4273 5.49312H16.9561C20.2983 5.49312 21.5913 6.3941 21.8498 9.18666Z" fill="#FFC225"/>
                                </svg>
                                <input defaultValue={thread?.folderForReading ?? ''} className="thread-path" placeholder="Путь к директории" type="text"/>
                            </label>
                        </div>
                    </div>
                </Form.Item>
                <button className="modal-server__submit flex-100">
                    <span className="icon">
                        <svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg className="no" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="submit-text">СОхранить</span>
                </button>
            </Form>
            {isThreadComplete && <ModalServerRecipient thread={thread} serversControl={serversControl} alertControl={alertControl}/>}
        </div>
    );
};

export default ModalServerThreadTab;