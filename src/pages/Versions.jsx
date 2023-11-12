import React, {useEffect, useState} from 'react';
import {useApi} from "../hooks/useApi";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import {message, Modal} from "antd";
import PageIsLoading from "../components/PageIsLoading";
import ErrorOnPage from "../components/ErrorOnPage";
import EmptyPage from "../components/EmptyPage";
import SoftModal from "../components/versions/SoftModal";
import ConfirmationGreen from "../components/ConfirmationGreen";
import SelectServersForm from "../components/versions/SelectServersForm";

const Versions = () => {
    const [softVersion, setSoftVersion] = useState(null)
    const [serverErrors, setServerErrors] = useState('')
    const [servers, setServers] = useState([])
    const [softModal, setSoftModal] = useState(false)
    const [confGreen, setConfGreen] = useState(false)
    const [serverSelectModal, setServerSelectModal] = useState(false)

    const [getSoftVersion, softVersionIsLoading] = useApi({
        url: '/profile-monitoring-system/version',
        method: 'GET'
    })

    const [getServers, serversIsLoading] = useApi({
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0
        }
    })

    const [updateAll, updateAllIsLoading] = useApi({
        url: '/profile-monitoring-system/server/update?versionId=' + softVersion?.id,
        data: { serverIds: null }
    })

    const tryUpdateAll = () => {
        setConfGreen(false)
        updateAll().then(resp => {
            console.log(resp)
            message.success('Софт обновлен')
        }).catch(err => message.error(err.message))
    }

    useEffect(() => {
        getSoftVersion().then(resp => {
            setSoftVersion(resp)
        }).catch(err => message.error(err.message))
        getServers().then(resp => {
            setServers(resp.result)
        }).catch(err => setServerErrors(err.message))
    },[])

    return (
        <section className="main">
            <div className="main__header">
                <div>
                    <svg className="main__header-icon" xmlns="http://www.w3.org/2000/svg" width="57" height="57"
                         viewBox="0 0 57 57" fill="none">
                        <rect width="57" height="57" rx="28.5" fill="#87D549"/>
                        <path d="M25.457 27.5763L28.8467 30.9659L32.2363 27.5763" stroke="white" strokeWidth="2"
                              strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M28.8428 17.4074V30.8733" stroke="white" strokeWidth="2" strokeMiterlimit="10"
                              strokeLinecap="round" strokeLinejoin="round"/>
                        <path
                            d="M39.5895 28.2383C39.5895 34.0907 35.6173 38.8309 28.9969 38.8309C22.3765 38.8309 18.4043 34.0907 18.4043 28.2383"
                            stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                    <p className="main__title"><span>Управление версиями софта в сети</span> <sup/></p></div>
                <div>
                    {softVersionIsLoading ? <LoadingOutlined/> : softVersion &&
                        <button type="button" className="version__file-btn popup-upload" onClick={() => setSoftModal(true)}>
                            <svg className="version__file-icon" xmlns="http://www.w3.org/2000/svg" width="57" height="57"
                                 viewBox="0 0 57 57" fill="none">
                                <rect width="57" height="57" rx="17" fill="#EFF1FD"/>
                                <path
                                    d="M33.6667 16.3333H24.3333C20.25 16.3333 18.5 18.6667 18.5 22.1667V33.8333C18.5 37.3333 20.25 39.6667 24.3333 39.6667H33.6667C37.75 39.6667 39.5 37.3333 39.5 33.8333V22.1667C39.5 18.6667 37.75 16.3333 33.6667 16.3333ZM27.285 33.215C27.6233 33.5533 27.6233 34.1133 27.285 34.4517C27.11 34.6267 26.8883 34.7083 26.6667 34.7083C26.445 34.7083 26.2233 34.6267 26.0483 34.4517L23.715 32.1183C23.3767 31.78 23.3767 31.22 23.715 30.8817L26.0483 28.5483C26.3867 28.21 26.9467 28.21 27.285 28.5483C27.6233 28.8867 27.6233 29.4467 27.285 29.785L25.57 31.5L27.285 33.215ZM34.285 32.1183L31.9517 34.4517C31.7767 34.6267 31.555 34.7083 31.3333 34.7083C31.1117 34.7083 30.89 34.6267 30.715 34.4517C30.3767 34.1133 30.3767 33.5533 30.715 33.215L32.43 31.5L30.715 29.785C30.3767 29.4467 30.3767 28.8867 30.715 28.5483C31.0533 28.21 31.6133 28.21 31.9517 28.5483L34.285 30.8817C34.6233 31.22 34.6233 31.78 34.285 32.1183ZM36.5833 24.7917H34.25C32.4767 24.7917 31.0417 23.3567 31.0417 21.5833V19.25C31.0417 18.7717 31.4383 18.375 31.9167 18.375C32.395 18.375 32.7917 18.7717 32.7917 19.25V21.5833C32.7917 22.3883 33.445 23.0417 34.25 23.0417H36.5833C37.0617 23.0417 37.4583 23.4383 37.4583 23.9167C37.4583 24.395 37.0617 24.7917 36.5833 24.7917Z"
                                    fill="#5BC2FF"/>
                            </svg>
                            <span className="version__file-text-box"><span className="version__file-title">Текущий файл версии:</span> <span
                                className="version__file-name">{softVersion.fileName}</span></span>
                        </button>
                    }
                    <button
                        onClick={() => setConfGreen(true)}
                        type="button" className="version__update-btn version__update-btn--green popup-update">
                        <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                            <rect width="47" height="47" rx="23.5" fill="#A5DC79"/>
                            <rect x="6" y="6" width="35" height="35" rx="17.5" fill="#BFE99F"/>
                            <path
                                d="M30.6663 23C30.6663 26.68 27.6797 29.6667 23.9997 29.6667C20.3197 29.6667 18.073 25.96 18.073 25.96M18.073 25.96H21.0863M18.073 25.96V29.2933M17.333 23C17.333 19.32 20.293 16.3333 23.9997 16.3333C28.4463 16.3333 30.6663 20.04 30.6663 20.04M30.6663 20.04V16.7067M30.6663 20.04H27.7063"
                                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>обновить на всех</span></button>
                    <button type="button"
                            onClick={() => setServerSelectModal(true)}
                            className="version__update-btn version__update-btn--purple popup-select-update">
                        <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                            <rect width="47" height="47" rx="23.5" fill="#ADB8FF" fillOpacity="0.4"/>
                            <rect x="6" y="6" width="35" height="35" rx="17.5" fill="#ADB8FF"/>
                            <path
                                d="M30.6663 23C30.6663 26.68 27.6797 29.6667 23.9997 29.6667C20.3197 29.6667 18.073 25.96 18.073 25.96M18.073 25.96H21.0863M18.073 25.96V29.2933M17.333 23C17.333 19.32 20.293 16.3333 23.9997 16.3333C28.4463 16.3333 30.6663 20.04 30.6663 20.04M30.6663 20.04V16.7067M30.6663 20.04H27.7063"
                                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>обновить выборочно</span></button>
                </div>
            </div>
            <Modal
                open={softModal}
                onCancel={() => {
                    setSoftModal(false)
                }}
                destroyOnClose={true}
                footer={false}
                className="soft-modal"
            >
                <SoftModal
                    setNewVersion={(val) => setSoftVersion(val)}
                    closeModal={() => setSoftModal(false)}
                />
            </Modal>
            <Modal
                open={serverSelectModal}
                onCancel={() => {
                    setServerSelectModal(false)
                }}
                destroyOnClose={true}
                footer={false}
            >
                <SelectServersForm
                    serverList={servers}
                    closeModal={() => setServerSelectModal(false)}
                    versionId={softVersion?.id}
                />
            </Modal>
            <ConfirmationGreen
                visible={confGreen}
                onCancel={() => setConfGreen(false)}
                onOK={tryUpdateAll}
            >Обновить все сервера?</ConfirmationGreen>
            <div className="main__content version" id="version" style={{ "--qty": "8" }}><p className="version__title">Серверы
                и версии</p>
                {serversIsLoading ? <PageIsLoading/> : serverErrors ?
                    <ErrorOnPage>{serverErrors}</ErrorOnPage> : servers.length > 0 ?
                        <ul className="version__list">
                            {servers.map(server =>
                                <li className="version__item" key={server.id} style={{ "order": "10" }}>
                                    <p className="version__item-version not-last">?</p>
                                    <div className="version__item-status disable"/>
                                    <p className="version__item-name">{server.name}</p>
                                    <p className="version__item-ip">{server.ip}</p>
                                    <div className="version__item-info-text">
                                        <div className="wait" style={updateAllIsLoading ? { "display": "flex" } : {"display": "none"}}>
                                            <span>Ожидание</span>
                                            <span className="dots">
                                            <span/>
                                        </span>
                                        </div>
                                        <div className="success">
                                            <span>Обновлен</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                                                 fill="none">
                                                <path d="M17.9167 4.99927L8.75 14.1751L6 11.4251" stroke="#87D549" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div className="error">
                                            <span>Ошибка</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13"
                                                 fill="none">
                                                <path d="M11 1.0603L1 11.0603" stroke="#EB376D" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M1 1.0603L11 11.0603" stroke="#EB376D" strokeWidth="2"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul> :
                        <EmptyPage/>
                }

            </div>
        </section>
    );
};

export default Versions;