import React, {useEffect, useState} from 'react';
import {useApi} from "../hooks/useApi";
import HomeItem from "../components/Home/HomeItem";
import ModalServerAdd from "../components/Modal/server/ModalServerAdd";
import ModalConfirm from "../components/Modal/ModalConfirm";
import {Alert} from "antd";
import PageIsLoading from "../components/PageIsLoading";
import EmptyPage from "../components/EmptyPage";

const Main = ({listOnly, parentData}) => {
    const [servers, setServers] = useState(listOnly ? parentData : []);
    const serversControl = {get: servers, set: setServers};
    const [filterServers, setFilterServers] = useState([]);
    const servStatInitial = {
        onActive: 0,
        onDisable: 0,
        off: 0,
        notThread: 0,
    };
    const [servStat, setServStat] = useState(servStatInitial);
    const [itemIsActive, setItemIsActive] = useState(false);
    const [searchIsActive, setSearchIsActive] = useState(false);
    const [isModalServerOpen, setIsModalServerOpen] = useState({open: false, server: null, threads: null});
    const modalServerControl = {get: isModalServerOpen, set: setIsModalServerOpen};
    const [modalConfirmOptions, setModalConfirmOptions] = useState({style: '', titleText: '', btnText: '', onConfirm: () => {}, icon: '', open: false});
    const modalConfirmControl = {get: modalConfirmOptions, set: setModalConfirmOptions, close: () => setModalConfirmOptions({...modalConfirmOptions, open: false})};
    const [alertOptions, setAlertOptions] = useState({text: '', type: '', open: false});
    const alertControl = {get: alertOptions, set: setAlertOptions};

    const [getServers, serversIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0,
        }
    });

    const [getSettingsType, settingsTypeIsLoading] = useApi({
        method: 'GET',
        url: '/profile-monitoring-system/settings-type/all',
    });
    const [iconSelectItems, setIconSelectItems] = useState([]);

    useEffect(() => {
        if (!listOnly) getServers().then((resp) => {
            setServers(resp.result);
        });

        getSettingsType().then((resp) => {
            setIconSelectItems(resp.result.map((item) => {
                return {src: item.iconLink, id: item.id};
            }));
        });
    }, []);

    useEffect(() => {
        const servStatNew = Object.assign(servStatInitial);

        servers.forEach((el) => {
            if (!el.modes?.length) {
                servStatNew.notThread++;
            } else if (el.isAlive) {
                el.isSentActive ?
                    servStatNew.onActive++
                    :
                    servStatNew.onDisable++;
            } else {
                servStatNew.off++;
            }
        });

        setServStat(servStatNew);
    }, [servers]);

    return (
        <section className={listOnly ? "" : "main"}>
            {!listOnly && <div className="main__header">
                <div>
                    <button className="main__btn main__btn--add" onClick={() => setIsModalServerOpen({open: true, server: null})}>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 5.41663V20.5833" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.41797 13H20.5846" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <div className="main__title-box">
                        <p className="main__title">
                            <span>Все серверы</span>
                            <sup>{servers.length}</sup>
                        </p>
                        <div className="main__title-stat">
                            <div className="serv-on-active">
                                <span>{servStat.onActive}</span>
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="4.5" cy="4.49988" r="4.5" fill="#87D549"/>
                                </svg>
                                <svg width="29" height="17" viewBox="0 0 29 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="-0.00012207" width="29" height="17" rx="8.5" fill="#EFF1FD"/>
                                    <rect x="15.625" y="4.49988" width="8" height="8" rx="4" fill="#87D549" stroke="#78C43B" strokeWidth="3"/>
                                </svg>
                            </div>
                            <div className="serv-on-disable">
                                <span>{servStat.onDisable}</span>
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="4.5" cy="4.49988" r="4.5" fill="#87D549"/>
                                </svg>
                                <svg width="29" height="17" viewBox="0 0 29 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="-0.00012207" width="29" height="17" rx="8.5" fill="#EFF1FD"/>
                                    <rect x="5.625" y="4.49988" width="8" height="8" rx="4" fill="#EB376D" stroke="#C62555" strokeWidth="3"/>
                                </svg>
                            </div>
                            <div className="serv-off">
                                <span>{servStat.off}</span>
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="4.5" cy="4.49988" r="4.5" fill="#EB376D"/>
                                </svg>
                            </div>
                            <div className="serv-no-thread">
                                <span>{servStat.notThread}</span>
                                <svg width="29" height="17" viewBox="0 0 29 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="-0.00012207" width="29" height="17" rx="8.5" fill="#EFF1FD"/>
                                    <rect x="5.625" y="4.49988" width="8" height="8" rx="4" fill="#CACCDA" stroke="#B0B2C0" strokeWidth="3"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="main__search-label">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.2512 19.2501L15.2637 15.2626" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input placeholder="Поиск по IP, названию..." type="text" onInput={(e) => {
                            setFilterServers(servers.filter((item) => item.name.indexOf(e.target.value) !== -1 || item.ip.indexOf(e.target.value) !== -1));
                            setSearchIsActive(String(e.target.value).length > 0);
                        }}/>
                    </label>
                    <div className="main__select-box">
                        <button type="button" className="main__select">
                            <span>Группа: Все сервера</span>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <div className="main__select-list main__select-list--groups">
                            <label className="main__select-item active">
                                <span>Группа: Все сервера</span>
                                <input type="radio" name="select1" value="" />
                            </label>
                        </div>
                    </div>
                    <div className="main__select-box">
                        <button type="button" className="main__select">
                            <span>Все сервера</span>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="#393B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <div className="main__select-list">
                            <label className="main__select-item active">
                                <span>Все сервера</span>
                                <input type="radio" name="select2" />
                            </label>
                            <label className="main__select-item">
                                <span>Серверы в работе</span>
                                <input value="alive" type="radio" name="select2" />
                            </label>
                            <label className="main__select-item">
                                <span>Не работающие сервера</span>
                                <input value="noalive" type="radio" name="select2" />
                            </label>
                        </div>
                    </div>
                    <button type="button" className="main__folder-send-btn">
                        <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5274 0.520889C-5.96046e-08 1.04178 0 1.87911 0 3.55556C0 5.232 -5.96046e-08 6.06933 0.5274 6.59022C1.0548 7.11111 1.9026 7.11111 3.6 7.11111H14.4C16.0974 7.11111 16.9452 7.11111 17.4726 6.59022C18 6.06933 18 5.232 18 3.55556C18 1.87911 18 1.04178 17.4726 0.520889C16.9452 -5.96046e-08 16.0974 0 14.4 0H3.6C1.9026 0 1.0548 -5.96046e-08 0.5274 0.520889ZM6.3 5.11111C6.12098 5.11111 5.94929 5.04087 5.8227 4.91585C5.69612 4.79082 5.625 4.62126 5.625 4.44444V2.66667C5.625 2.48986 5.69612 2.32029 5.8227 2.19526C5.94929 2.07024 6.12098 2 6.3 2C6.47902 2 6.65071 2.07024 6.7773 2.19526C6.90388 2.32029 6.975 2.48986 6.975 2.66667V4.44444C6.975 4.62126 6.90388 4.79082 6.7773 4.91585C6.65071 5.04087 6.47902 5.11111 6.3 5.11111ZM10.35 2.88889C10.171 2.88889 9.99929 2.95913 9.8727 3.08415C9.74612 3.20918 9.675 3.37874 9.675 3.55556C9.675 3.73237 9.74612 3.90194 9.8727 4.02696C9.99929 4.15198 10.171 4.22222 10.35 4.22222H14.4C14.579 4.22222 14.7507 4.15198 14.8773 4.02696C15.0039 3.90194 15.075 3.73237 15.075 3.55556C15.075 3.37874 15.0039 3.20918 14.8773 3.08415C14.7507 2.95913 14.579 2.88889 14.4 2.88889H10.35ZM3.6 5.11111C3.42098 5.11111 3.24929 5.04087 3.1227 4.91585C2.99612 4.79082 2.925 4.62126 2.925 4.44444V2.66667C2.925 2.48986 2.99612 2.32029 3.1227 2.19526C3.24929 2.07024 3.42098 2 3.6 2C3.77902 2 3.95071 2.07024 4.0773 2.19526C4.20388 2.32029 4.275 2.48986 4.275 2.66667V4.44444C4.275 4.62126 4.20388 4.79082 4.0773 4.91585C3.95071 5.04087 3.77902 5.11111 3.6 5.11111ZM0.5274 9.40978C-5.96046e-08 9.93067 0 10.768 0 12.4444C0 14.1209 -5.96046e-08 14.9582 0.5274 15.4791C1.0548 16 1.9026 16 3.6 16H14.4C16.0974 16 16.9452 16 17.4726 15.4791C18 14.9582 18 14.1209 18 12.4444C18 10.768 18 9.93067 17.4726 9.40978C16.9452 8.88889 16.0974 8.88889 14.4 8.88889H3.6C1.9026 8.88889 1.0548 8.88889 0.5274 9.40978ZM2.925 13.3333C2.925 13.5101 2.99612 13.6797 3.1227 13.8047C3.24929 13.9298 3.42098 14 3.6 14C3.77902 14 3.95071 13.9298 4.0773 13.8047C4.20388 13.6797 4.275 13.5101 4.275 13.3333V11.5556C4.275 11.3787 4.20388 11.2092 4.0773 11.0842C3.95071 10.9591 3.77902 10.8889 3.6 10.8889C3.42098 10.8889 3.24929 10.9591 3.1227 11.0842C2.99612 11.2092 2.925 11.3787 2.925 11.5556V13.3333ZM6.3 14C6.12098 14 5.94929 13.9298 5.8227 13.8047C5.69612 13.6797 5.625 13.5101 5.625 13.3333V11.5556C5.625 11.3787 5.69612 11.2092 5.8227 11.0842C5.94929 10.9591 6.12098 10.8889 6.3 10.8889C6.47902 10.8889 6.65071 10.9591 6.7773 11.0842C6.90388 11.2092 6.975 11.3787 6.975 11.5556V13.3333C6.975 13.5101 6.90388 13.6797 6.7773 13.8047C6.65071 13.9298 6.47902 14 6.3 14Z" fill="white"/>
                            <circle cx="16" cy="13" r="8" fill="#87D449"/>
                            <path d="M20.8002 13C20.8002 15.6531 18.6533 17.8 16.0002 17.8C13.3471 17.8 11.7325 15.1295 11.7325 15.1295M11.7325 15.1295H13.8969M11.7325 15.1295V17.5295M11.2002 13C11.2002 10.3469 13.3297 8.2 16.0002 8.2C19.2031 8.2 20.8002 10.8705 20.8002 10.8705M20.8002 10.8705V8.47054M20.8002 10.8705H18.6707" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>общая отправка</span>
                    </button>
                    <button className="main__btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.97 1H3.03C1.76 1 1 1.76 1 3.03V5.97C1 7.24 1.76 8 3.03 8H5.97C7.24 8 8 7.24 8 5.97V3.03C8 1.76 7.24 1 5.97 1ZM6.47 5.56C6.72 5.81 6.72 6.22 6.47 6.47C6.34 6.59 6.17 6.65 6.01 6.65C5.85 6.65 5.69 6.59 5.56 6.47L4.49 5.41L3.45 6.47C3.32 6.59 3.16 6.65 2.98 6.65C2.82 6.65 2.66 6.59 2.53 6.47C2.28 6.22 2.28 5.81 2.53 5.56L3.6 4.5L2.54 3.45C2.29 3.2 2.29 2.79 2.54 2.54C2.79 2.29 3.2 2.29 3.45 2.54L4.49 3.6L5.55 2.54C5.8 2.29 6.21 2.29 6.46 2.54C6.71 2.79 6.71 3.2 6.46 3.45L5.41 4.5L6.47 5.56Z" fill="#EB376D"/>
                            <path d="M21.5004 15.82C21.5004 15.97 21.4504 16.12 21.3204 16.25C19.8704 17.71 17.2904 20.31 15.8104 21.8C15.6804 21.94 15.5104 22 15.3404 22C15.0104 22 14.6904 21.74 14.6904 21.36V17.86C14.6904 16.4 15.9304 15.19 17.4504 15.19C18.4004 15.18 19.7204 15.18 20.8504 15.18C21.2404 15.18 21.5004 15.49 21.5004 15.82Z" fill="#EB376D"/>
                            <path d="M21.5004 15.82C21.5004 15.97 21.4504 16.12 21.3204 16.25C19.8704 17.71 17.2904 20.31 15.8104 21.8C15.6804 21.94 15.5104 22 15.3404 22C15.0104 22 14.6904 21.74 14.6904 21.36V17.86C14.6904 16.4 15.9304 15.19 17.4504 15.19C18.4004 15.18 19.7204 15.18 20.8504 15.18C21.2404 15.18 21.5004 15.49 21.5004 15.82Z" fill="#EB376D"/>
                            <path d="M16.63 2H10.5C9.95 2 9.5 2.45 9.5 3V6.5C9.5 8.16 8.16 9.5 6.5 9.5H3.5C2.95 9.5 2.5 9.95 2.5 10.5V17.13C2.5 19.82 4.68 22 7.37 22H12.19C12.74 22 13.19 21.55 13.19 21V17.86C13.19 15.56 15.1 13.69 17.45 13.69C17.98 13.68 19.27 13.68 20.5 13.68C21.05 13.68 21.5 13.24 21.5 12.68V6.87C21.5 4.18 19.32 2 16.63 2ZM8.72 17.01H6.08C5.67 17.01 5.33 16.67 5.33 16.26C5.33 15.84 5.67 15.5 6.08 15.5H8.72C9.15 15.5 9.47 15.84 9.47 16.26C9.47 16.67 9.15 17.01 8.72 17.01ZM11.51 13.3H6.08C5.67 13.3 5.33 12.96 5.33 12.55C5.33 12.13 5.67 11.79 6.08 11.79H11.51C11.92 11.79 12.27 12.13 12.27 12.55C12.27 12.96 11.92 13.3 11.51 13.3Z" fill="#EB376D"/>
                        </svg>
                    </button>
                    <button className="main__btn">
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.4688 0.0743371C18.3125 0.0314714 18.0977 -0.0036006 17.9883 0.000296285C17.8789 0.000296285 17.6602 0.0392651 17.5 0.0860277C17.3398 0.13279 17.1172 0.222419 17.0117 0.284769C16.9023 0.351016 16.7188 0.499097 16.5977 0.616004C16.4805 0.736807 16.3281 0.931651 16.2617 1.04856C16.1914 1.16546 16.1094 1.3681 16.0781 1.4967C16.043 1.6253 16.0156 1.85132 16.0156 2.00329C16.0156 2.15527 16.043 2.38129 16.0781 2.50989C16.1133 2.63849 16.1758 2.81385 16.2188 2.89958C16.2617 2.98531 16.3594 3.12949 16.4297 3.21912L16.5625 3.38669L12.9102 10.6739C12.5312 10.6739 12.3047 10.7011 12.1562 10.7362C11.9375 10.7908 11.8867 10.7908 11.8516 10.7479C11.8281 10.7167 11.2422 10.0543 10.5469 9.27098C9.85156 8.48771 9.24219 7.80575 9.19141 7.7512L9.09766 7.65378C9.29688 7.11211 9.3125 7.01079 9.3125 6.66007C9.3125 6.36391 9.29297 6.19634 9.24219 6.05605C9.20312 5.94694 9.11328 5.76379 9.04297 5.64688C8.97266 5.52997 8.83594 5.35851 8.74219 5.26499C8.65234 5.17146 8.47656 5.03897 8.35938 4.96493C8.24219 4.89478 8.05469 4.80515 7.94922 4.77008C7.83984 4.73501 7.62109 4.69604 7.46094 4.68435C7.26172 4.67266 7.08203 4.68435 6.89453 4.73111C6.74609 4.76618 6.51563 4.85192 6.39062 4.91816C6.26172 4.98831 6.05469 5.14808 5.92578 5.27668C5.78906 5.41307 5.64062 5.61571 5.56641 5.76379C5.49609 5.90408 5.41797 6.11451 5.39062 6.23141C5.36328 6.35611 5.35156 6.58213 5.35938 6.77698C5.375 6.99131 5.41016 7.19005 5.47266 7.34202C5.51953 7.47062 5.62109 7.66157 5.69531 7.77068L5.82422 7.96553C5.68359 8.21103 4.90625 9.57494 4.00391 11.1532L2.36328 14.0213C2 13.9901 1.78125 13.9979 1.64062 14.0252C1.5 14.0486 1.27344 14.1265 1.13281 14.1927C0.964844 14.2746 0.785156 14.411 0.605469 14.5902C0.421875 14.7695 0.289062 14.9487 0.210938 15.1163C0.140625 15.2566 0.0664062 15.4631 0.0429688 15.5761C0.0195312 15.6853 0 15.8723 0 15.9853C0 16.0944 0.0273438 16.301 0.0625 16.4412C0.09375 16.5815 0.179688 16.7998 0.246094 16.9245C0.316406 17.0531 0.46875 17.2557 0.585938 17.3765C0.703125 17.4934 0.90625 17.6493 1.03516 17.7194C1.16406 17.7896 1.39453 17.8831 1.54297 17.926C1.69141 17.9649 1.89453 18 1.99219 18C2.08984 18 2.30078 17.9649 2.46094 17.9182C2.62109 17.8753 2.83984 17.7896 2.94531 17.735C3.05078 17.6766 3.22656 17.5519 3.33203 17.4544C3.44141 17.357 3.59766 17.1739 3.67969 17.0453C3.76562 16.9167 3.86719 16.6906 3.91406 16.5387C3.98047 16.3165 3.99219 16.1957 3.97656 15.8957C3.96484 15.6541 3.92969 15.4514 3.875 15.3112C3.83203 15.1942 3.73047 15.0033 3.65625 14.8942L3.51562 14.6876L6.97266 8.64358C7.49609 8.64748 7.73438 8.6202 7.87109 8.58123L8.10547 8.51888C8.22656 8.67086 8.85156 9.3762 9.57031 10.1829C10.2891 10.9895 10.8867 11.6715 10.8906 11.6987C10.8984 11.726 10.8672 11.8273 10.8242 11.9326C10.7773 12.0339 10.7227 12.2326 10.6953 12.3768C10.6602 12.5833 10.6602 12.7119 10.6953 12.9535C10.7305 13.164 10.793 13.3588 10.8906 13.5537C10.9766 13.7251 11.1211 13.9278 11.2539 14.0603C11.375 14.1811 11.5781 14.333 11.7031 14.4032C11.832 14.4694 12.0312 14.5513 12.1484 14.5863C12.2656 14.6214 12.4961 14.6487 12.6562 14.6487C12.8164 14.6487 13.0508 14.6214 13.1719 14.5902C13.2969 14.5591 13.4922 14.4811 13.6016 14.4188C13.7148 14.3564 13.8945 14.2278 14 14.1343C14.1055 14.0408 14.2578 13.8615 14.3398 13.7329C14.4258 13.6043 14.5273 13.3861 14.5703 13.2458C14.6224 13.0769 14.6484 12.8821 14.6484 12.6613C14.6484 12.4404 14.625 12.2586 14.5781 12.1157C14.5352 11.9988 14.4648 11.8234 14.4141 11.726C14.3633 11.6286 14.2773 11.4883 14.2148 11.4143L14.1055 11.2779L17.7656 3.9907C18 4.01409 18.1914 3.9985 18.3398 3.97122C18.4883 3.94784 18.7266 3.8699 18.8672 3.80365C19.0352 3.72182 19.2148 3.58543 19.3945 3.40617C19.5781 3.22692 19.7109 3.04766 19.7891 2.88009C19.8594 2.73981 19.9336 2.53327 19.957 2.42026C19.9805 2.31115 20 2.1241 20 2.01109C20 1.90198 19.9727 1.69544 19.9375 1.55515C19.9062 1.41487 19.8203 1.19664 19.7539 1.07194C19.6836 0.943342 19.5312 0.740704 19.4141 0.623798C19.2969 0.502994 19.0977 0.347119 18.9727 0.276975C18.8516 0.210728 18.6211 0.117203 18.4688 0.0743371Z" fill="#505050"/>
                        </svg>
                    </button>
                </div>
            </div> }
            <div className={listOnly ? "" : "main__content home"}>
                <div className="home__header">
                    <div>
                        <span>действия</span>
                    </div>
                    <div>
                        <span>on/off</span>
                    </div>
                    <div>
                        <span>Название</span>
                    </div>
                    <div>
                        <span>IP-адрес</span>
                    </div>
                    <div>
                        <span>назначение</span>
                    </div>
                    <div>
                        <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="#93A1B2"/>
                        </svg>
                        <span>мониторинг получения</span>
                    </div>
                    <div>
                        <span>мониторинг отправок</span>
                        <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="#93A1B2"/>
                        </svg>
                    </div>
                    <div>
                        <span>Запуск</span>
                    </div>
                    <div>
                        <span>изменения</span>
                    </div>
                    <div>
                        <span>Локация</span>
                    </div>
                    <div>
                        <span>отправка</span>
                    </div>
                </div>
                {serversIsLoading ?
                    <PageIsLoading/>
                    :
                    <>
                        {
                            searchIsActive ?
                                filterServers.map((el) => <HomeItem server={el}
                                                                    active={[itemIsActive, setItemIsActive]}
                                                                    serversControl={serversControl}
                                                                    modalConfirm={modalConfirmControl}
                                                                    key={el.id}
                                                                    alertControl={alertControl}
                                                                    modalServerControl={modalServerControl}
                                />)
                                :
                                servers.length ?
                                    servers.map((el) => <HomeItem server={el}
                                                                  active={[itemIsActive, setItemIsActive]}
                                                                  serversControl={serversControl}
                                                                  modalConfirm={modalConfirmControl}
                                                                  key={el.id}
                                                                  alertControl={alertControl}
                                                                  modalServerControl={modalServerControl}
                                    />)
                                    : <EmptyPage/>
                        }

                        <ModalServerAdd modalServerControl={modalServerControl} serversControl={serversControl} iconSelectItems={iconSelectItems} alertControl={alertControl}/>
                        <ModalConfirm options={modalConfirmControl}/>
                        {alertOptions.open && (
                            <Alert className='alert'
                                   message={
                                       <div className={"alert__item " + alertOptions.type}>
                                           <button type="button" className="alert__close" onClick={() => setAlertOptions({...alertOptions, open: false})}/>
                                           <svg className="ok" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                               <path d="M21.8046 11L10.6009 22.2149L5.49805 17.1111" stroke="#87D449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                               <path d="M27.9151 11L16.7114 22.2149L11.6074 17.1111" stroke="#87D449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                           </svg>
                                           <svg className="no" width="43" height="42" viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                               <path d="M15.6367 14.875L27.8867 27.125" stroke="#EB376D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                               <path d="M15.6387 27.1239L27.8887 14.8739" stroke="#EB376D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                           </svg>
                                           <p>{alertOptions.text}</p>
                                       </div>
                                   }
                                   type={alertOptions.type}
                                   closable
                                   closeIcon={false}
                                   afterClose={() => setAlertOptions({...alertOptions, open: false})} />
                        )}
                    </>
                }
            </div>
        </section>
    );
};

export default Main;