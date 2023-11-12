import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {routeNames} from "../../router/routeNames";
import {message, Modal} from "antd";
import Graph from "../Graph";
import EmptyPage from "../EmptyPage";
import {useApi} from "../../hooks/useApi";
import {getDaysArr} from "../../utils/tools";

const MonitoringHeader = ({server, isLoading, delivery, id}) => {
    const [statModal, setStatModal] = useState(false)
    const [deliveryStats, setDeliveryStats] = useState([])

    const [getServerStats, serverStatsIsLoading] = useApi({
        url: '/profile-monitoring-system/statistics/' + id,
        data: getDaysArr(30)
    })

    useEffect(() => {
        getServerStats().then(resp => {
            console.log(resp.deliveryStatistics.result)
            setDeliveryStats(resp.deliveryStatistics.result)
        }).catch(err => message.error(err.message))
    },[])

    return (
        <div className="main__header">
            <div>
                <Link to={routeNames.main} className="main__btn main__btn--min">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19 9C19.5523 9 20 8.55228 20 8C20 7.44772 19.5523 7 19 7V9ZM0.292892 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM19 7L1 7V9L19 9V7Z"
                            fill="#92A1B2"/>
                    </svg>
                </Link>
                {(isLoading || !server) ? <p className="main__title"><span>Загрузка... </span></p> :
                    <>
                        <p className="main__title"><span>Мониторинг </span><b>{server.name} </b><span
                            className="gray">({server.ip})</span></p>
                        <p className={server.isAlive ? "main__status-work" : "main__status-work disable"}>
                            <span>on/off:</span>
                        </p>
                        <div className="main__send-btn"><span>отправка:</span>
                            <button type="button" className={server.isSentActive ? "active" : ""}/>
                        </div>
                    </>
                }
            </div>
            <div>
                <button className="main__btn main__btn--purple popup-stat" data-stat="30" onClick={() => setStatModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20.0402 6.82008L14.2802 2.79008C12.7102 1.69007 10.3002 1.75008 8.79023 2.92008L3.78023 6.83007C2.78023 7.61007 1.99023 9.21008 1.99023 10.4701V17.3701C1.99023 19.9201 4.06023 22.0001 6.61023 22.0001H17.3902C19.9402 22.0001 22.0102 19.9301 22.0102 17.3801V10.6001C22.0102 9.25008 21.1402 7.59008 20.0402 6.82008ZM16.8802 13.4001C16.8802 13.7901 16.5702 14.1001 16.1802 14.1001C15.7902 14.1001 15.4802 13.7901 15.4802 13.4001V13.2201L12.7602 15.9401C12.6102 16.0901 12.4102 16.1601 12.2002 16.1401C12.0002 16.1201 11.8102 16.0001 11.7002 15.8301L10.6802 14.3101L8.30023 16.6901C8.16023 16.8301 7.99023 16.8901 7.81023 16.8901C7.63023 16.8901 7.45023 16.8201 7.32023 16.6901C7.05023 16.4201 7.05023 15.9801 7.32023 15.7001L10.3002 12.7201C10.4502 12.5701 10.6502 12.5001 10.8602 12.5201C11.0702 12.5401 11.2602 12.6501 11.3702 12.8301L12.3902 14.3501L14.5002 12.2401H14.3202C13.9302 12.2401 13.6202 11.9301 13.6202 11.5401C13.6202 11.1501 13.9302 10.8401 14.3202 10.8401H16.1802C16.2702 10.8401 16.3602 10.8601 16.4502 10.8901C16.6202 10.9601 16.7602 11.1001 16.8302 11.2701C16.8702 11.3601 16.8802 11.4501 16.8802 11.5401V13.4001Z"
                            fill="white"/>
                    </svg>
                </button>
                <Modal
                    open={statModal}
                    onCancel={() => {
                        setStatModal(false)
                    }}
                    destroyOnClose={true}
                    footer={false}
                    className="stats-modal"
                >
                    {server ?
                        <Graph name={server.name} data={deliveryStats} isLoading={serverStatsIsLoading}/> :
                        <EmptyPage/>
                    }
                </Modal>
            </div>
        </div>
    );
};

export default MonitoringHeader;