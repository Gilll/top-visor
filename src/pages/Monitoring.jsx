import React, {useEffect, useState} from 'react';
import {useApi} from "../hooks/useApi";
import {useParams} from "react-router";
import {message} from "antd";
import PageIsLoading from "../components/PageIsLoading";
import MonitoringItem from "../components/monitoring/MonitoringItem";
import MonitoringHeader from "../components/monitoring/MonitoringHeader";

const Monitoring = () => {
    const [delivery, setDelivery] = useState([])
    const [receipt, setReceipt] = useState([])
    const [server, setServer] = useState(null)

    const params = useParams()

    const getRequestPeriods = (start, end) => {
        return {
            requestPeriods: [{
                endDate: `${end.getFullYear()}-${(end.getMonth() + 2).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`,
                startDate: `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`
            }]
        }
    }

    const [getStatistics, statisticsIsLoading] = useApi({
        url: '/profile-monitoring-system/statistics/' + params.id,
    })

    const [getServer, serverIsLoading] = useApi({
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0,
            serverIds: [params.id]
        }
    })

    useEffect(() => {
        getStatistics().then(resp => {
            setDelivery(resp.deliveryStatistics.result)
            setReceipt(resp.receiptStatistics.result)
        }).catch(err => message.error(err.message))
        getServer().then(resp => {
            if (resp.result.length) {
                setServer(resp.result[0])
            } else {
                message.error('Сервер ' + params.id + ' не найден')
            }
        }).catch(err => message.error(err.message))
    },[])

    return (
        <section className="main">
            <MonitoringHeader id={params.id} server={server} delivery={delivery} isLoading={serverIsLoading}/>
            <div className="main__content monitoring">
                {statisticsIsLoading ? <PageIsLoading/> :
                    <>
                        <div>
                            <div className="monitoring__header">
                                <p className="monitoring__header-btn purple">
                                    <span>Отправки</span>
                                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V5.25ZM23.5303 6.53033C23.8232 6.23744 23.8232 5.76256 23.5303 5.46967L18.7574 0.696699C18.4645 0.403806 17.9896 0.403806 17.6967 0.696699C17.4038 0.989593 17.4038 1.46447 17.6967 1.75736L21.9393 6L17.6967 10.2426C17.4038 10.5355 17.4038 11.0104 17.6967 11.3033C17.9896 11.5962 18.4645 11.5962 18.7574 11.3033L23.5303 6.53033ZM1 6.75H23V5.25H1V6.75Z"
                                            fill="white"/>
                                    </svg>
                                </p>
                            </div>
                            {delivery && delivery.length > 0 && delivery.map((el, index) =>
                                <MonitoringItem item={el} key={index}/>
                            )}
                        </div>
                        <div>
                            <div className="monitoring__header">
                                <p className="monitoring__header-btn green">
                                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V5.25ZM23.5303 6.53033C23.8232 6.23744 23.8232 5.76256 23.5303 5.46967L18.7574 0.696699C18.4645 0.403806 17.9896 0.403806 17.6967 0.696699C17.4038 0.989593 17.4038 1.46447 17.6967 1.75736L21.9393 6L17.6967 10.2426C17.4038 10.5355 17.4038 11.0104 17.6967 11.3033C17.9896 11.5962 18.4645 11.5962 18.7574 11.3033L23.5303 6.53033ZM1 6.75H23V5.25H1V6.75Z"
                                            fill="white"/>
                                    </svg>
                                    <span>Получение</span>
                                </p>
                            </div>
                            {receipt && receipt.length > 0 && receipt.map((el, index) =>
                                <MonitoringItem item={el} key={index}/>
                            )}
                        </div>
                    </>
                }
            </div>
        </section>
    );
};

export default Monitoring;