import React, {useEffect, useRef, useState} from 'react';
import loadingImg from '../../../assets/img/loading.svg';
import ModalServerInfoTab from "./ModalServerInfoTab";
import {Modal, Tabs} from "antd";
import ModalServerThreadTab from "./ModalServerThreadTab";

const {TabPane} = Tabs;


const ModalServerAdd = ({modalServerControl, serversControl, iconSelectItems, alertControl}) => {
    const [lastCompleteTab, setLastCompleteTab] = useState(0);
    const [lastCreatedTab, setLastCreatedTab] = useState(1);

    const tabThreadTemplate = (key, isNew, name) => {
        return <div className={'modal-server__tab' + (isNew ? ' add' : '')}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5.41734V20.584" stroke="#92A1B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.41797 13.0007H20.5846" stroke="#92A1B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="disable">Создать поток</span>
            <span className="active">{name ?? 'Поток' + (key - 1)}</span>
        </div>
    }

    const newTabIndex = useRef(1);
    useEffect(() => {newTabIndex.current = 1}, [modalServerControl]);

    const [tabs, setTabs] = useState([{
            title: tabThreadTemplate(newTabIndex.current, true),
            key: 1,
        }]);
    const [activeKey, setActiveKey] = useState(0);

    useEffect(() => {
        if (modalServerControl.get.server) {
            setLastCompleteTab(1);
        }

        if (modalServerControl.get.threads) {
            const threads = modalServerControl.get.threads.map((item) => {
                newTabIndex.current++;
                setLastCompleteTab(newTabIndex.current + 1);
                setLastCreatedTab(newTabIndex.current + 1);
                return {title: tabThreadTemplate(newTabIndex.current, false, item.name), key: newTabIndex.current, thread: item}
            });
            newTabIndex.current++;
            setTabs([...threads,
                {
                    title: tabThreadTemplate(newTabIndex.current, true),
                    key: newTabIndex.current,
                }]);
        }
    }, [modalServerControl]);

    const onChangeTab = (key) => {
        setActiveKey(Number(key));

        if (lastCreatedTab <= key) {
            setLastCreatedTab(Number(key) + 1);
            setTabs(tabs.map((item) => {
                if (Number(key) === item.key) {
                    item.title = tabThreadTemplate(item.key, false);
                }

                return item;
            }));
            addTab();
        }
    };

    const addTab = () => {
        const newKey = ++newTabIndex.current;
        setTabs([
            ...tabs,
            {
                title: tabThreadTemplate(newKey, true),
                key: newKey,
            }
        ]);
    };

    const removeTab = (targetKey) => {
        const targetIndex = tabs.findIndex((pane) => pane.key === targetKey);
        const newPanes = tabs.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setTabs(newPanes);
    };

    const onEditTab = (targetKey, action) => {
        if (action === 'add') {
            addTab();
        } else {
            removeTab(targetKey);
        }
    };

    const onCancel = () => {
        setLastCompleteTab(0);
        setLastCreatedTab(1);
        newTabIndex.current = 1;
        setTabs([{
            title: tabThreadTemplate(newTabIndex.current, true),
            key: 1,
        }]);
        modalServerControl.set({open: false, server: null, threads: null});
    };

    return (
        <Modal className={'modal-server' + (modalServerControl.get.server ? ' edit' : '')} destroyOnClose={true} open={modalServerControl.get.open} footer={null} onCancel={onCancel}>
            <div className="modal-server__title-box">
                <div className="modal-server__icon">
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.3262 2.84616H11.0377C8.02021 2.84616 5.57617 5.2902 5.57617 8.3077V18.2067C5.57617 18.9577 6.19059 19.5721 6.94156 19.5721H27.4223C28.1733 19.5721 28.7877 18.9577 28.7877 18.2067V8.3077C28.7877 5.2902 26.3437 2.84616 23.3262 2.84616ZM11.0377 17.524H9.67233C9.11252 17.524 8.64829 17.0598 8.64829 16.5C8.64829 15.9402 9.11252 15.476 9.67233 15.476H11.0377C11.5975 15.476 12.0617 15.9402 12.0617 16.5C12.0617 17.0598 11.5975 17.524 11.0377 17.524ZM11.0377 14.1106H9.67233C9.11252 14.1106 8.64829 13.6464 8.64829 13.0865C8.64829 12.5267 9.11252 12.0625 9.67233 12.0625H11.0377C11.5975 12.0625 12.0617 12.5267 12.0617 13.0865C12.0617 13.6464 11.5975 14.1106 11.0377 14.1106ZM11.0377 10.6971H9.67233C9.11252 10.6971 8.64829 10.2329 8.64829 9.67308C8.64829 9.11328 9.11252 8.64905 9.67233 8.64905H11.0377C11.5975 8.64905 12.0617 9.11328 12.0617 9.67308C12.0617 10.2329 11.5975 10.6971 11.0377 10.6971Z" fill="white"/>
                        <path d="M5.57617 22.9856V24.6923C5.57617 27.7098 8.02021 30.1538 11.0377 30.1538H23.3262C26.3437 30.1538 28.7877 27.7098 28.7877 24.6923V22.9856C28.7877 22.2346 28.1733 21.6202 27.4223 21.6202H6.94156C6.19059 21.6202 5.57617 22.2346 5.57617 22.9856ZM24.2956 26.6858C24.0362 26.9315 23.6812 27.0817 23.3262 27.0817C22.9712 27.0817 22.6162 26.9315 22.3568 26.6858C22.111 26.4263 21.9608 26.0713 21.9608 25.7163C21.9608 25.3613 22.111 25.0063 22.3568 24.7469C22.8619 24.2417 23.7767 24.2417 24.2956 24.7469C24.5414 25.0063 24.6916 25.3613 24.6916 25.7163C24.6916 26.0713 24.5414 26.4263 24.2956 26.6858Z" fill="white"/>
                    </svg>
                    <img src={loadingImg} alt=""/>
                </div>
                <p className="modal-server__title">
                    {modalServerControl.get.server ?
                        <>
                            {modalServerControl.get.server.name}
                            <span className="token">Токен: {modalServerControl.get.server.token}</span>
                        </>
                        :
                        'Новый сервер'
                    }
                </p>
            </div>
            <Tabs
                className='modal-server__tabs'
                hideAdd
                onChange={onChangeTab}
                defaultActiveKey={activeKey}
                type="editable-card"
                onEdit={onEditTab}
            >
                <TabPane tab={<div className='modal-server__tab'><span>О сервере</span></div>} key={0} closable={false}>
                    <ModalServerInfoTab modalServerControl={modalServerControl} setLastCompleteTab={setLastCompleteTab} tabKey={0} serversControl={serversControl}/>
                </TabPane>
                {tabs.map((pane) => (
                    <TabPane tab={pane.title} key={pane.key} closable={false} disabled={!(lastCompleteTab >= pane.key)}>
                        <ModalServerThreadTab modalServerControl={modalServerControl} serversControl={serversControl} iconSelectItems={iconSelectItems} setLastCompleteTab={setLastCompleteTab} alertControl={alertControl} tabKey={pane.key} thread={pane.thread}/>
                    </TabPane>
                ))}
            </Tabs>
        </Modal>
    );
};

export default ModalServerAdd;