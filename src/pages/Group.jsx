import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import GroupHeader from "../components/groups/GroupHeader";
import {useApi} from "../hooks/useApi";
import {message, Modal} from "antd";
import PageIsLoading from "../components/PageIsLoading";
import EmptyPage from "../components/EmptyPage";
import GroupForm from "../components/groups/GroupForm";
import ConfirmationForm from "../components/ConfirmationForm";
import {routeNames} from "../router/routeNames";
import ErrorOnPage from "../components/ErrorOnPage";
import Main from "./Main";
import Graph from "../components/Graph";
import {getDaysArr} from "../utils/tools";

const Group = () => {
    const [groups, setGroups] = useState([])
    const [serverList, setServerList] = useState([])
    const [currentGroup, setCurrentGroup] = useState(null)
    const [deliveryStatistics, setDeliveryStatistics] = useState()
    const [receiptStatistics, setReceiptStatistics] = useState()
    const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState(false)
    const [serverError, setServerError] = useState('')
    const [groupServers, setGroupServers] = useState([])
    const [graphModal, setGraphModal] = useState(false)

    const [groupStat10, setGroupStat10] = useState([])
    const [groupStat30, setGroupStat30] = useState([])
    const [modalStat10, setModalStat10] = useState(false)
    const [modalStat30, setModalStat30] = useState(false)

    const params = useParams()
    const navigate = useNavigate()

    const [getGroups, groupsIsLoading] = useApi({
        url: '/profile-monitoring-system/monitoring/getListAllGroups',
        data: {
            count: 10000,
            numberPage: 0
        }
    })



    const [getServerList, serverListIsLoading] = useApi({
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0
        }
    })

    const [getGroupStatistics, statisticsIsLoading] = useApi({
        url: '/profile-monitoring-system/statistics/groups/' + params.id
    })

    const [getGroupStatistics10, statisticsIsLoading10] = useApi({
        url: '/profile-monitoring-system/statistics/groups/' + params.id,
        data: getDaysArr(10)
    })

    const [getGroupStatistics30, statisticsIsLoading30] = useApi({
        url: '/profile-monitoring-system/statistics/groups/' + params.id,
        data: getDaysArr(30)
    })

    const [deleteGroup, deleteGroupIsLoading] = useApi({
        url: "/profile-monitoring-system/monitoring/deleteGroupById?groupId=" + params.id
    })

    const tryDeleteGroup = () => {
        deleteGroup().then(() => {
            setConfirmationModal(false)
            message.success('Группа ' + currentGroup.name + ' удалена')
            navigate(routeNames.groups)
        }).catch(err => message.error(err.message))
    }

    const getDaylyStats = () => {
        getGroupStatistics10().then(resp => {
            setGroupStat10(resp.deliveryStatistics.result)
        }).catch(err => {
            message.error(err.message)
        })
        getGroupStatistics30().then(resp => {
            setGroupStat30(resp.deliveryStatistics.result)
        }).catch(err => {
            message.error(err.message)
        })
    }

    useEffect(() => {
        getGroups().then(resp => {
            let cg = resp.result.filter(el => el.id === parseInt(params.id))[0]
            setGroups(resp.result)
            setCurrentGroup(cg)
            getServerList({serverIds: cg.servers.map(el => el.id)}).then(resp => {
                setGroupServers(resp.result)
            }).catch(err => message.error(err.message))
        }).catch(err => message.error(err.message))
        getServerList().then(resp => {
            setServerList(resp.result)
        }).catch(err => message.error(err.message))
        getGroupStatistics().then(resp => {
            setDeliveryStatistics(resp.deliveryStatistics.result)
            setReceiptStatistics(resp.receiptStatistics.result)
        }).catch(err => {
            message.error(err.message)
            setServerError(err.message)
        })
        getDaylyStats()
    },[])

    return (
        <section className="main">
            {groupsIsLoading ?
                <PageIsLoading/>
            :
                currentGroup ?
                    <>
                        <GroupHeader
                            title={currentGroup.name}
                            count={currentGroup.servers ? currentGroup.servers.length : 0}
                            deleteGroup={() => setConfirmationModal(true)}
                            editGroup={() => setModalFormIsOpen(true)}
                        />
                        <div id="group" className="main__content home group">
                            <div className="group__content">
                                {statisticsIsLoading ?
                                    <PageIsLoading/>
                                :
                                    serverError ?
                                        <ErrorOnPage>
                                            {serverError}
                                        </ErrorOnPage>
                                    : deliveryStatistics.map((item, index) =>
                                        <div id={"group-statistic" + (index + 1)} className="group__item" key={index}>
                                            <div className="group__header">
                                                <div><p className="group__title">{item.periodName}</p><p className="group__text">Суммарные
                                                    показатели</p></div>
                                                <div/>
                                                <div>
                                                    <button type="button" className="group__btn popup-stat" onClick={() => {
                                                        if (index === 1) {
                                                            setModalStat10(true)
                                                        }
                                                        if (index === 2) {
                                                            setModalStat30(true)
                                                        }
                                                    }}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M20.0422 6.82007L14.2822 2.79007C12.7122 1.69007 10.3022 1.75007 8.79219 2.92007L3.78219 6.83007C2.78219 7.61007 1.99219 9.21007 1.99219 10.4701V17.3701C1.99219 19.9201 4.06219 22.0001 6.61219 22.0001H17.3922C19.9422 22.0001 22.0122 19.9301 22.0122 17.3801V10.6001C22.0122 9.25007 21.1422 7.59007 20.0422 6.82007ZM16.8822 13.4001C16.8822 13.7901 16.5722 14.1001 16.1822 14.1001C15.7922 14.1001 15.4822 13.7901 15.4822 13.4001V13.2201L12.7622 15.9401C12.6122 16.0901 12.4122 16.1601 12.2022 16.1401C12.0022 16.1201 11.8122 16.0001 11.7022 15.8301L10.6822 14.3101L8.30219 16.6901C8.16219 16.8301 7.99219 16.8901 7.81219 16.8901C7.63219 16.8901 7.45219 16.8201 7.32219 16.6901C7.05219 16.4201 7.05219 15.9801 7.32219 15.7001L10.3022 12.7201C10.4522 12.5701 10.6522 12.5001 10.8622 12.5201C11.0722 12.5401 11.2622 12.6501 11.3722 12.8301L12.3922 14.3501L14.5022 12.2401H14.3222C13.9322 12.2401 13.6222 11.9301 13.6222 11.5401C13.6222 11.1501 13.9322 10.8401 14.3222 10.8401H16.1822C16.2722 10.8401 16.3622 10.8601 16.4522 10.8901C16.6222 10.9601 16.7622 11.1001 16.8322 11.2701C16.8722 11.3601 16.8822 11.4501 16.8822 11.5401V13.4001Z"
                                                                fill="white"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="group__info-box">
                                                <div className="group__info-icon purple">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17.4414 14.62L20.0014 12.06L17.4414 9.5" stroke="white"
                                                              strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                        <path d="M9.76172 12.06H19.9317" stroke="white" strokeWidth="1.5"
                                                              strokeMiterlimit="10" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                        <path
                                                            d="M11.7617 20C7.34172 20 3.76172 17 3.76172 12C3.76172 7 7.34172 4 11.7617 4"
                                                            stroke="white" strokeWidth="1.5" strokeMiterlimit="10"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <ul className="group__data-list">
                                                    <li>
                                                        <div className="group__data-list-item">
                                                            <img src={item.settings[0].settingsTypeIconLink} alt=""/>
                                                            <div>
                                                                <p>{item.settings[0].numberOfSuccess}</p>
                                                                <p>μ{item.settings[0].averageNumberOfSuccess}</p>
                                                            </div>
                                                        </div>
                                                        <div className="group__data-list-item">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M7.5 13.7501C10.9518 13.7501 13.75 10.9519 13.75 7.50012C13.75 4.04834 10.9518 1.25012 7.5 1.25012C4.04822 1.25012 1.25 4.04834 1.25 7.50012C1.25 10.9519 4.04822 13.7501 7.5 13.7501Z"
                                                                    stroke="#EB376D" strokeWidth="1.5" strokeLinecap="round"
                                                                    strokeLinejoin="round"/>
                                                                <path d="M9.375 5.62512L5.625 9.37512" stroke="#EB376D"
                                                                      strokeWidth="1.5" strokeLinecap="round"
                                                                      strokeLinejoin="round"/>
                                                                <path d="M5.625 5.62512L9.375 9.37512" stroke="#EB376D"
                                                                      strokeWidth="1.5" strokeLinecap="round"
                                                                      strokeLinejoin="round"/>
                                                            </svg>
                                                            <div>
                                                                <p>{item.settings[0].numberOfFail}</p>
                                                                <p>μ{item.settings[0].averageNumberOfFail}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="group__info-box">
                                                <div className="group__info-icon green">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.6797 14.62L14.2397 12.06L11.6797 9.5" stroke="white"
                                                              strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                        <path d="M4 12.06H14.17" stroke="white" strokeWidth="1.5"
                                                              strokeMiterlimit="10" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                        <path d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20" stroke="white"
                                                              strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <ul className="group__data-list">
                                                    <li>
                                                        <div className="group__data-list-item">
                                                            <img src={receiptStatistics[index].settings[0].settingsTypeIconLink} alt=""/>
                                                            <div>
                                                                <p>{receiptStatistics[index].settings[0].numberOfSuccess}</p>
                                                                <p>μ{receiptStatistics[index].settings[0].averageNumberOfSuccess}</p>
                                                            </div>
                                                        </div>
                                                        <div className="group__data-list-item">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M7.5 13.7501C10.9518 13.7501 13.75 10.9519 13.75 7.50012C13.75 4.04834 10.9518 1.25012 7.5 1.25012C4.04822 1.25012 1.25 4.04834 1.25 7.50012C1.25 10.9519 4.04822 13.7501 7.5 13.7501Z"
                                                                    stroke="#EB376D" strokeWidth="1.5" strokeLinecap="round"
                                                                    strokeLinejoin="round"/>
                                                                <path d="M9.375 5.62512L5.625 9.37512" stroke="#EB376D"
                                                                      strokeWidth="1.5" strokeLinecap="round"
                                                                      strokeLinejoin="round"/>
                                                                <path d="M5.625 5.62512L9.375 9.37512" stroke="#EB376D"
                                                                      strokeWidth="1.5" strokeLinecap="round"
                                                                      strokeLinejoin="round"/>
                                                            </svg>
                                                            <div>
                                                                <p>{receiptStatistics[index].settings[0].numberOfFail}</p>
                                                                <p>μ{receiptStatistics[index].settings[0].averageNumberOfFail}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            {currentGroup && serverListIsLoading ?
                                <PageIsLoading/>
                                : groupServers.length > 0 ?
                                    <Main listOnly={true} parentData={groupServers}/> :
                                    <EmptyPage/>
                            }
                        </div>
                        <Modal
                            open={modalFormIsOpen}
                            onCancel={() => {
                                setModalFormIsOpen(false)
                            }}
                            destroyOnClose={true}
                            footer={false}
                        >
                            <GroupForm
                                serverList={serverList}
                                closeModal={() => setModalFormIsOpen(false)}
                                editGroup={group => {
                                    setCurrentGroup(group)
                                    setModalFormIsOpen(false)
                                }}
                                editableGroup={currentGroup}
                            />
                        </Modal>
                        <Modal
                            open={graphModal}
                            onCancel={() => {
                                setGraphModal(false)
                            }}
                            destroyOnClose={true}
                            footer={false}
                        >
                            <Graph/>
                        </Modal>
                        <ConfirmationForm
                            visible={confirmationModal}
                            onOK={tryDeleteGroup}
                            isLoading={deleteGroupIsLoading}
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
                            <p className="modal-confirm__title">Удалить Группу <b>{currentGroup.name}</b></p>
                        </ConfirmationForm>
                        <Modal
                            open={modalStat10}
                            onCancel={() => {
                                setModalStat10(false)
                            }}
                            destroyOnClose={true}
                            footer={false}
                            className="stats-modal"
                        >
                            {currentGroup ?
                                <Graph group={true} name={currentGroup.name} data={groupStat10} isLoading={statisticsIsLoading10}/> :
                                <EmptyPage/>
                            }
                        </Modal>
                        <Modal
                            open={modalStat30}
                            onCancel={() => {
                                setModalStat30(false)
                            }}
                            destroyOnClose={true}
                            footer={false}
                            className="stats-modal"
                        >
                            {currentGroup ?
                                <Graph group={true} name={currentGroup.name} data={groupStat30} isLoading={statisticsIsLoading30}/> :
                                <EmptyPage/>
                            }
                        </Modal>
                    </>
                :
                    <EmptyPage/>
            }
        </section>
    );
};

export default Group;