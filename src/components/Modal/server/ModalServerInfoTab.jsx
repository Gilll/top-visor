import React, {useEffect, useState} from 'react';
import {Button, Form, Space, Tabs} from "antd";
import ModalServerInfoForm from "./ModalServerInfoForm";
import ModalServerConfigForm from "./ModalServerConfigForm";
import ModalServerStatForm from "./ModalServerStatForm";
import {useApi} from "../../../hooks/useApi";
import LoadingAnim from "../../UI/LoadingAnim";

const ModalServerInfoTab = ({modalServerControl, setLastCompleteTab, tabKey, serversControl}) => {
    const [isSave, setIsSave] = useState(false);

    const initialForm = {
        accesses: null,
        affiliation: null,
        anticaptchaServerIds: null,
        cases: null,
        configuration: null,
        control: null,
        error: null,
        from: null,
        help: null,
        ip: null,
        location: null,
        maxPower: null,
        name: null,
        numberOfThreads: null,
        projectIds: null,
        purpose: null
    };
    const [formValues, setFormValues] = useState(modalServerControl.get.server ?? initialForm);

    const tabs = [
        {
            label: <button type='button' className="modal-server__info-tab">Информация</button>,
            children: <ModalServerInfoForm formValues={formValues} setFormValues={setFormValues}/>,
            key: 1,
            closable: false,
        },
        {
            label: <button type='button' className="modal-server__info-tab">Конфигурация</button>,
            children: <ModalServerConfigForm/>,
            key: 2,
            closable: false,
            disabled: true,
        },
        {
            label: <button type='button' className="modal-server__info-tab">Статистика профилей</button>,
            children: <ModalServerStatForm/>,
            key: 3,
            closable: false,
            disabled: true,
        },
    ];

    const [activeKey, setActiveKey] = useState(tabs[0].key);

    const onChangeTab = (key) => {
        setActiveKey(key);
    };

    const [create, createIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/server/create',
        data: formValues,
    });

    const [edit, editIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/server/${modalServerControl.get.server?.id}/info`,
        data: formValues,
    });

    const [getServer, serverIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0,
        },
    });

    const SubmitButton = ({form, isSave}) => {
        const [submittable, setSubmittable] = React.useState(false);

        const values = Form.useWatch([], form);

        React.useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(
                    () => {
                        isSave.set(false);
                        setSubmittable(true);
                    },
                    () => {
                        isSave.set(false);
                        setSubmittable(false);
                    },
                );
        }, [values]);

        return (
            <Button className={'modal-server__submit' + (isSave.get ? ' active' : '')} htmlType="submit" disabled={!submittable}>
                {
                    createIsLoading || editIsLoading ?
                        <LoadingAnim/>
                        :
                        <div>
                            <span className="icon">
                                <svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <svg className="no" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="submit-text">{isSave.get ? 'Сохранено' : 'Сохранить'}</span>
                        </div>
                }
            </Button>
        );
    };

    useEffect(() => console.log(isSave), [isSave]);

    const onFinish = () => {
        if (modalServerControl.get.server) {
            edit().then((resp) => {
                if (resp.status === 'SUCCESS') {
                    getServer({serverIds: [resp.result[0].id]}).then((resp) => {
                        serversControl.set(serversControl.get.map((item) => {
                            if (item.id === resp.result[0].id) {
                                return resp.result[0];
                            }
                            return item;
                        }));
                    });
                    modalServerControl.set({...modalServerControl.get, server: resp.result[0]});
                }
            });
        } else {
            create().then((resp) => {
                if (resp.status === 'SUCCESS') {
                    setLastCompleteTab(tabKey);
                    serversControl.set([...serversControl.get, resp.result[0]]);
                    modalServerControl.set({...modalServerControl.get, server: resp.result[0]});
                }
            });
        }
    };

    const onValuesChange = (value) => {
        if (value.ip) {
            if (!value.ip.startsWith('http://') && !value.ip.startsWith('https://')) {
                value.ip = 'http://' + value.ip;
            }

            if (!Number(value.ip.slice(value.ip.lastIndexOf(':') + 1))) {
                value.ip = value.ip + ':8089';
            }
        }

        setFormValues({...formValues, ...value});
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();

    return (
        <div className="modal-server__tab-content">
            <Form
                initialValues={formValues}
                form={form}
                onValuesChange={onValuesChange}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Tabs
                    className='modal-server__info-tabs'
                    hideAdd
                    onChange={onChangeTab}
                    activeKey={activeKey}
                    items={tabs}
                />
                <Space className="modal-server__buttons">
                    <SubmitButton form={form} isSave={{get: isSave, set: setIsSave}}/>
                    <button type="button" className="modal-server__cancel-btn" onClick={() => modalServerControl.set({open: false, server: null})}>
                        <span>Отменить создание</span>
                    </button>
                </Space>
            </Form>
        </div>
    );
};

export default ModalServerInfoTab;