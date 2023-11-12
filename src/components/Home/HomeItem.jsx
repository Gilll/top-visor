import React, {useState} from 'react';
import {cutIp} from "../../utils/tools";
import {NavLink} from "react-router-dom";
import HomeItemDetails from "./HomeItemDetails";
import {useApi} from "../../hooks/useApi";
import {Dropdown} from "antd";

const HomeItem = ({server, active, modalConfirm, serversControl, alertControl, modalServerControl}) => {
    const [deleteServer, deleteIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/server/${server.id}/delete`,
    });

    const [resetServer, resetIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/server/${server.id}/reboot`,
    });

    const [turnServer, turnIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/server/${server.id}/${server.isAlive ? 'off' : 'on'}`,
    });

    const [changeSentServer, changeSentIsLoading] = useApi({
        method: 'POST',
        url: `/profile-monitoring-system/settings/all/server/${server.id}/sending/${server.isSentActive ? 'stop' : 'start'}`,
    });

    const [threads, setThreads] = useState([]);
    const threadsControl = {get: threads, set: setThreads};
    const [getThreads, threadsIsLoading] = useApi({
        method: 'GET',
        url: `/profile-monitoring-system/settings/getByServerId?id=${server.id}`
    });

    const items = [
        {
            label:
                <button type="button" className="home__item-btn-item home-item-edit" onClick={() => {
                    if (!threads.length) {
                        getThreads().then((resp) => {
                            if (resp.status === 'SUCCESS') {
                                setThreads(resp.result);
                                modalServerControl.set({open: true, server: server, threads: resp.result});
                            } else {
                                modalServerControl.set({open: true, server: server, threads: null});
                            }
                        }).catch(() => modalServerControl.set({open: true, server: server, threads: null}));
                    } else {
                        modalServerControl.set({open: true, server: server, threads: threads});
                    }
                }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.08876 1.00474L0.866469 7.22594C0.626689 7.46568 0.398907 7.93317 0.350951 8.2688L0.015261 10.6422C-0.104629 11.5053 0.494815 12.1046 1.35802 11.9847L3.73182 11.6491C4.06751 11.6012 4.53511 11.3734 4.77489 11.1337L10.9972 4.91247C12.0642 3.84563 12.5797 2.599 10.9972 1.01673C9.41463 -0.577532 8.16777 -0.07408 7.08876 1.00474Z" fill="#8B98EE"/>
                        <path d="M6 2.25C6.50769 4.06154 7.92692 5.49231 9.75 6" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label:
                <button type="button" className="home__item-btn-item"
                        onClick={() => modalConfirm.set({
                            style: 'red',
                            titleText: <>Удалить сервер <b>{server.name}?</b></>,
                            btnText: 'Да, удалить',
                            onConfirm: () => {
                                deleteServer().then((resp) => {
                                    modalConfirm.close();

                                    if (resp.status === 'SUCCESS') {
                                        alertControl.set({text: 'Сервер "' + server.name + '" успешно удален', type: 'success', open: true});
                                        serversControl.set(serversControl.get.filter((item) => item.id !== server.id));
                                    } else {
                                        alertControl.set({text: resp.error.description, type: 'error', open: true});
                                    }
                                });
                            },
                            open: true})}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.0466 3.48668C12.9733 3.38001 11.8999 3.30001 10.8199 3.24001V3.23334L10.6733 2.36668C10.5733 1.75334 10.4266 0.833344 8.86661 0.833344H7.11994C5.56661 0.833344 5.41994 1.71334 5.31328 2.36001L5.17328 3.21334C4.55328 3.25334 3.93328 3.29334 3.31328 3.35334L1.95328 3.48668C1.67328 3.51334 1.47328 3.76001 1.49994 4.03334C1.52661 4.30668 1.76661 4.50668 2.04661 4.48001L3.40661 4.34668C6.89994 4.00001 10.4199 4.13334 13.9533 4.48668C13.9733 4.48668 13.9866 4.48668 14.0066 4.48668C14.2599 4.48668 14.4799 4.29334 14.5066 4.03334C14.5266 3.76001 14.3266 3.51334 14.0466 3.48668Z" fill="#EB376D"/>
                        <path d="M12.8202 5.42666C12.6602 5.25999 12.4402 5.16666 12.2135 5.16666H3.78683C3.56016 5.16666 3.33349 5.25999 3.18016 5.42666C3.02683 5.59332 2.94016 5.81999 2.95349 6.05332L3.36683 12.8933C3.44016 13.9067 3.53349 15.1733 5.86016 15.1733H10.1402C12.4668 15.1733 12.5602 13.9133 12.6335 12.8933L13.0468 6.05999C13.0602 5.81999 12.9735 5.59332 12.8202 5.42666ZM9.10682 11.8333H6.88683C6.61349 11.8333 6.38683 11.6067 6.38683 11.3333C6.38683 11.06 6.61349 10.8333 6.88683 10.8333H9.10682C9.38016 10.8333 9.60682 11.06 9.60682 11.3333C9.60682 11.6067 9.38016 11.8333 9.10682 11.8333ZM9.66683 9.16666H6.33349C6.06016 9.16666 5.83349 8.93999 5.83349 8.66666C5.83349 8.39332 6.06016 8.16666 6.33349 8.16666H9.66683C9.94016 8.16666 10.1668 8.39332 10.1668 8.66666C10.1668 8.93999 9.94016 9.16666 9.66683 9.16666Z" fill="#EB376D"/>
                    </svg>
                </button>,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label:
                <button type="button" className="home__item-btn-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.21942 0.0627702C6.14891 0.0987467 6.05223 0.182848 6.00457 0.249645C5.91891 0.369723 5.91781 0.389528 5.90692 1.98058L5.89594 3.59004L4.91082 3.60168C3.46988 3.61871 3.55465 3.50933 3.55465 5.3516C3.55465 6.78562 3.56133 6.82996 3.8036 7.00277C3.90672 7.07632 3.98766 7.09195 4.32344 7.10312L4.72113 7.11636L4.73668 8.95859C4.75207 10.7789 4.75344 10.8057 4.8527 11.211C5.09399 12.1962 5.5141 12.9634 6.20598 13.6822C6.77844 14.2768 7.3618 14.6687 8.10543 14.9582C8.4816 15.1046 9.15074 15.2735 9.35477 15.2735C9.43379 15.2735 9.45309 15.2928 9.45309 15.3718C9.45309 15.5758 9.62196 16.245 9.76836 16.6211C10.0624 17.3766 10.4559 17.9576 11.0727 18.5473C11.9816 19.4162 13.1195 19.9147 14.3573 19.9862C14.7238 20.0074 14.8109 20.0007 14.9343 19.9422C15.3316 19.7536 15.3845 19.1914 15.0288 18.938C14.9359 18.8719 14.8201 18.8467 14.4802 18.8187C13.1662 18.7105 12.0692 18.1053 11.3466 17.0899C11.0257 16.6389 10.7486 15.9782 10.6493 15.4276L10.6243 15.2887L10.9732 15.2219C11.991 15.0268 12.8677 14.5739 13.62 13.8548C14.4168 13.093 14.8949 12.2513 15.1662 11.1328C15.2402 10.8275 15.248 10.6531 15.2627 8.95859L15.2788 7.11636L15.6765 7.10312C16.0123 7.09195 16.0932 7.07632 16.1963 7.00277C16.4386 6.82996 16.4453 6.78562 16.4453 5.3516C16.4453 3.91757 16.4386 3.87324 16.1963 3.70043C16.0789 3.61668 16.036 3.61285 15.0879 3.60168L14.1015 3.59004V2.02554C14.1015 0.296403 14.0998 0.283044 13.8526 0.106676C13.6821 -0.0148861 13.3491 -0.0148861 13.1786 0.106676C12.9314 0.283044 12.9297 0.296208 12.9297 2.02742V3.59379H9.99996H7.07028V2.02742C7.07028 0.300817 7.06793 0.282458 6.8261 0.110231C6.67082 -0.000315758 6.38668 -0.0225423 6.21942 0.0627702ZM9.74282 7.17062C9.67657 7.20332 9.33891 7.51539 8.9925 7.8641C8.21828 8.64347 8.15078 8.77105 8.32371 9.12828C8.40266 9.29132 8.43324 9.31082 9.27098 9.73136C9.74711 9.97039 10.1441 10.1727 10.1532 10.1809C10.1623 10.1892 10.018 10.351 9.8325 10.5406C9.48715 10.8936 9.41403 11.0114 9.41403 11.2155C9.41403 11.4577 9.65125 11.7328 9.90039 11.7796C10.1784 11.8318 10.2547 11.7823 10.9448 11.1027C11.7711 10.2889 11.8523 10.1418 11.6762 9.77804C11.5973 9.615 11.5667 9.5955 10.7289 9.17496C10.2528 8.93593 9.85613 8.73394 9.84746 8.72613C9.83875 8.71832 9.9841 8.55379 10.1705 8.36047C10.3568 8.16718 10.5265 7.96367 10.5476 7.90824C10.6457 7.65007 10.5414 7.37675 10.2764 7.19824C10.1231 7.09488 9.91782 7.08425 9.74282 7.17062Z" fill="#FE6E1E"/>
                    </svg>
                </button>,
            key: '3',
        },
        {
            type: 'divider',
        },
        {
            label:
                <button type="button" className="home__item-btn-item"
                        onClick={() => {
                            modalConfirm.set({
                                style: server.isAlive ? 'red' : 'green',
                                titleText: <>{server.isAlive ? 'Выключить' : 'Включить'} сервер <b>{server.name}?</b></>,
                                btnText: server.isAlive ? 'Да, выключить' : 'Да, включить',
                                onConfirm: () => {
                                    turnServer().then((resp) => {
                                        modalConfirm.close();

                                        if (resp.status === 'SUCCESS') {
                                            alertControl.set({text: 'Сервер "' + server.name + '" успешно ' + (server.isAlive ? 'выключен' : 'включен'), type: 'success', open: true});
                                            serversControl.set(serversControl.get.map((item) => {
                                                if (item.id === server.id) {
                                                    return {...item, isAlive: !item.isAlive}
                                                } else {
                                                    return item
                                                }
                                            }));
                                        } else {
                                            alertControl.set({text: resp.error.description, type: 'error', open: true});
                                        }
                                    });
                                },
                                open: true})
                        }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <path d="M12.3997 5.18091C13.2703 6.05179 13.8631 7.16126 14.1032 8.36904C14.3433 9.57682 14.2198 10.8287 13.7485 11.9663C13.2772 13.1039 12.4791 14.0763 11.4552 14.7604C10.4313 15.4445 9.22751 15.8096 7.9961 15.8096C6.76468 15.8096 5.56092 15.4445 4.53701 14.7604C3.51311 14.0763 2.71503 13.1039 2.2437 11.9663C1.77236 10.8287 1.64894 9.57682 1.88903 8.36904C2.12912 7.16126 2.72194 6.05179 3.59253 5.18091" stroke="#73798D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.99902 1.9707V8.88911" stroke="#73798D" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>,
            key: '4',
        },
        {
            type: 'divider',
        },
        {
            label:
                <button type="button" className="home__item-btn-item"
                        onClick={() => {
                            modalConfirm.set({
                                style: 'green',
                                titleText: <>Перезагрузить сервер <b>{server.name}?</b></>,
                                btnText: 'Да, перезагрузить',
                                onConfirm: () => {
                                    resetServer().then((resp) => {
                                        modalConfirm.close();

                                        if (resp.status === 'SUCCESS') {
                                            alertControl.set({text: 'Сервер "' + server.name + '" успешно перезагружен', type: 'success', open: true});
                                        } else {
                                            alertControl.set({text: resp.error.description, type: 'error', open: true});
                                        }
                                    });
                                },
                                open: true})
                        }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M10.6997 14.9295C13.5597 14.1485 15.6663 11.4527 15.6663 8.24545C15.6663 4.42992 12.7063 1.33325 8.99967 1.33325C4.55301 1.33325 2.33301 5.17643 2.33301 5.17643M2.33301 5.17643V2.02447M2.33301 5.17643H3.67301H5.29301" stroke="#5BC2FF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.5 9.28223C1.5 12.9111 4.5 15.5032 8 15.5032" stroke="#5BC2FF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 0"/>
                    </svg>
                </button>,
            key: '5',
        },
    ];

    const createDate = (() => {
        let dateDay = server.createdDate.slice(8,10),
            dateMonth = server.createdDate.slice(5,7),
            dateTime = server.createdDate.slice(11,16);

        return `${dateDay}.${dateMonth} ${dateTime}`
    })();

    const updateDate = (() => {
        if (server.settingsLastUpdateDate) {
            let dateDay = server.settingsLastUpdateDate.slice(8,10),
                dateMonth = server.settingsLastUpdateDate.slice(5,7),
                dateTime = server.settingsLastUpdateDate.slice(11,16);

            return `${dateDay}.${dateMonth} ${dateTime}`
        }

        return '-';
    })();

    const order = (() => {
        let i = 0;
        if (!server.modes?.length) {
            i += 1;

            if (!server.isAlive) {
                i += 1;
            }
        } else if (!server.isSentActive && server.isAlive) {
            i += 4;
        } else if (!server.isAlive) {
            i += 5;

            if (!server.isSentActive) {
                i += 1;
            }
        } else if (server.isAlive) {
            i = 3;
        }
        return i;
    })();

    return (
        <div className={"home__item" + (active[0] === server.id ? ' active' : '')} style={{'order': order}}
             onClick={() => {
                 active[1](active[0] === server.id ? null : server.id);
                 if (!threads.length && server.modes?.length) {
                     getThreads().then((resp) => {
                         setThreads(resp.result);
                     }).catch(() => false);
                 }
             }}>
            <div className="home__item-content">
                <div>
                    <div className="home__item-btn">
                        <NavLink to={"/monitoring/" + server.id}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.0007 1.83337C5.94065 1.83337 1.83398 5.94004 1.83398 11C1.83398 16.06 5.94065 20.1667 11.0007 20.1667C16.0607 20.1667 20.1673 16.06 20.1673 11C20.1673 5.94004 16.0607 1.83337 11.0007 1.83337ZM11.0007 8.02087C10.6248 8.02087 10.3132 7.70921 10.3132 7.33337C10.3132 6.95754 10.6248 6.64587 11.0007 6.64587C13.4023 6.64587 15.3548 8.59837 15.3548 11C15.3548 13.4017 13.4023 15.3542 11.0007 15.3542C10.6248 15.3542 10.3132 15.0425 10.3132 14.6667C10.3132 14.2909 10.6248 13.9792 11.0007 13.9792C12.6415 13.9792 13.9798 12.6409 13.9798 11C13.9798 9.35921 12.6415 8.02087 11.0007 8.02087ZM11.0007 18.1042C7.08648 18.1042 3.89648 14.9142 3.89648 11C3.89648 10.6242 4.20815 10.3125 4.58398 10.3125C4.95982 10.3125 5.27148 10.6242 5.27148 11C5.27148 14.1625 7.83815 16.7292 11.0007 16.7292C14.1632 16.7292 16.7298 14.1625 16.7298 11C16.7298 7.83754 14.1632 5.27087 11.0007 5.27087C10.6248 5.27087 10.3132 4.95921 10.3132 4.58337C10.3132 4.20754 10.6248 3.89587 11.0007 3.89587C14.9148 3.89587 18.1048 7.08587 18.1048 11C18.1048 14.9142 14.9148 18.1042 11.0007 18.1042Z" fill="#8B98EE"/>
                            </svg>
                        </NavLink>
                    </div>
                    <div className="home__item-btn home__item-btn--circle" onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                            menu={{items}}
                            trigger={['click']}
                            overlayClassName='home-btn-list'
                        >
                            <button type="button" className="home-list-btn" onClick={(e) => e.stopPropagation()}>
                                <svg width="3" height="14" viewBox="0 0 3 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="1.5" cy="1.5" r="1.5" fill="#8B98EE"/>
                                    <circle cx="1.5" cy="6.88461" r="1.5" fill="#8B98EE"/>
                                    <circle cx="1.5" cy="12.2692" r="1.5" fill="#8B98EE"/>
                                </svg>
                            </button>
                        </Dropdown>
                    </div>
                </div>
                <div className="status">
                    <div className={"home__status-icon" + (server.isAlive ? ' active' : ' disable')} />
                    <div className="home__status-version"><span>{server.versionName ?? '?'}</span></div>
                    <div className={"home__status-owner " + server.affiliation}>
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4.30283C11 3.68518 10.6975 3.11362 10.1842 2.77253L6.5175 0.311132C5.90333 -0.103711 5.09667 -0.103711 4.4825 0.311132L0.815833 2.77253C0.311667 3.11362 0 3.68518 0 4.30283V9.53906C0 9.79719 0.201667 10 0.458333 10H10.5417C10.7983 10 11 9.79719 11 9.53906V4.30283ZM5.5 7.69532C4.62 7.69532 3.89583 6.96704 3.89583 6.08205C3.89583 5.19705 4.62 4.46877 5.5 4.46877C6.38 4.46877 7.10417 5.19705 7.10417 6.08205C7.10417 6.96704 6.38 7.69532 5.5 7.69532Z" fill="white"/>
                        </svg>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.77891 13.0687C4.76016 13.0687 4.73516 13.0812 4.71641 13.0812C3.50391 12.4812 2.51641 11.4874 1.91016 10.2749C1.91016 10.2562 1.92266 10.2312 1.92266 10.2124C2.68516 10.4374 3.47266 10.6062 4.25391 10.7374C4.39141 11.5249 4.55391 12.3062 4.77891 13.0687Z" fill="white"/>
                            <path d="M13.0859 10.2812C12.4672 11.5249 11.4359 12.5312 10.1797 13.1374C10.4172 12.3437 10.6172 11.5437 10.7484 10.7374C11.5359 10.6062 12.3109 10.4374 13.0734 10.2124C13.0672 10.2374 13.0859 10.2624 13.0859 10.2812Z" fill="white"/>
                            <path d="M13.1359 4.81904C12.3484 4.58154 11.5547 4.38779 10.7484 4.25029C10.6172 3.44404 10.4234 2.64404 10.1797 1.86279C11.4734 2.48154 12.5172 3.52529 13.1359 4.81904Z" fill="white"/>
                            <path d="M4.78203 1.93049C4.55703 2.69299 4.39453 3.46799 4.26328 4.25549C3.45703 4.38049 2.65703 4.58049 1.86328 4.81799C2.46953 3.56174 3.47578 2.53049 4.71953 1.91174C4.73828 1.91174 4.76328 1.93049 4.78203 1.93049Z" fill="white"/>
                            <path d="M9.68281 4.11826C8.23281 3.95576 6.77031 3.95576 5.32031 4.11826C5.47656 3.26201 5.67656 2.40576 5.95781 1.58076C5.97031 1.53076 5.96406 1.49326 5.97031 1.44326C6.46406 1.32451 6.97031 1.24951 7.50156 1.24951C8.02656 1.24951 8.53906 1.32451 9.02656 1.44326C9.03281 1.49326 9.03281 1.53076 9.04531 1.58076C9.32656 2.41201 9.52656 3.26201 9.68281 4.11826Z" fill="white"/>
                            <path d="M4.11973 9.68232C3.25723 9.52607 2.40723 9.32607 1.58223 9.04482C1.53223 9.03232 1.49473 9.03857 1.44473 9.03232C1.32598 8.53857 1.25098 8.03232 1.25098 7.50107C1.25098 6.97607 1.32598 6.46357 1.44473 5.97607C1.49473 5.96982 1.53223 5.96982 1.58223 5.95732C2.41348 5.68232 3.25723 5.47607 4.11973 5.31982C3.96348 6.76982 3.96348 8.23232 4.11973 9.68232Z" fill="white"/>
                            <path d="M13.7496 7.50107C13.7496 8.03232 13.6746 8.53857 13.5559 9.03232C13.5059 9.03857 13.4684 9.03232 13.4184 9.04482C12.5871 9.31982 11.7371 9.52607 10.8809 9.68232C11.0434 8.23232 11.0434 6.76982 10.8809 5.31982C11.7371 5.47607 12.5934 5.67607 13.4184 5.95732C13.4684 5.96982 13.5059 5.97607 13.5559 5.97607C13.6746 6.46982 13.7496 6.97607 13.7496 7.50107Z" fill="white"/>
                            <path d="M9.68281 10.8811C9.52656 11.7436 9.32656 12.5936 9.04531 13.4186C9.03281 13.4686 9.03281 13.5061 9.02656 13.5561C8.53906 13.6749 8.02656 13.7499 7.50156 13.7499C6.97031 13.7499 6.46406 13.6749 5.97031 13.5561C5.96406 13.5061 5.97031 13.4686 5.95781 13.4186C5.68281 12.5874 5.47656 11.7436 5.32031 10.8811C6.04531 10.9624 6.77031 11.0186 7.50156 11.0186C8.23281 11.0186 8.96406 10.9624 9.68281 10.8811Z" fill="white"/>
                            <path d="M9.85306 9.85159C8.28987 10.0488 6.71208 10.0488 5.14889 9.85159C4.95167 8.28841 4.95167 6.71061 5.14889 5.14743C6.71208 4.95021 8.28987 4.95021 9.85306 5.14743C10.0503 6.71061 10.0503 8.28841 9.85306 9.85159Z" fill="white"/>
                        </svg>
                    </div>
                    <div className={"home__status-thread" + (server.maxPower <= 100 ? ' azure' : ' green')}>
                        <span className="maxPower">{server.maxPower}</span>
                    </div>
                </div>
                <div>
                    <p className="name">{server.name}</p>
                </div>
                <div>
                    <p className="ip">{cutIp(server.ip)}</p>
                </div>
                <div>
                    <p className="target">{server.purpose}</p>
                </div>
                {
                    server.modes?.length ?
                        <>
                            <div>
                                <ul className="home__monitoring">
                                    {server.receiptStatistics?.map((el, i) =>
                                        <li key={i}>
                                            <div>
                                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.4688 0.455789C-4.76837e-08 0.911567 0 1.64423 0 3.11112C0 4.57801 -4.76837e-08 5.31068 0.4688 5.76646C0.9376 6.22223 1.6912 6.22223 3.2 6.22223H12.8C14.3088 6.22223 15.0624 6.22223 15.5312 5.76646C16 5.31068 16 4.57801 16 3.11112C16 1.64423 16 0.911567 15.5312 0.455789C15.0624 1.13977e-05 14.3088 1.14441e-05 12.8 1.14441e-05H3.2C1.6912 1.14441e-05 0.9376 1.13977e-05 0.4688 0.455789ZM5.6 4.47223C5.44087 4.47223 5.28826 4.41078 5.17574 4.30138C5.06321 4.19198 5 4.04361 5 3.8889V2.33334C5 2.17864 5.06321 2.03026 5.17574 1.92087C5.28826 1.81147 5.44087 1.75001 5.6 1.75001C5.75913 1.75001 5.91174 1.81147 6.02426 1.92087C6.13679 2.03026 6.2 2.17864 6.2 2.33334V3.8889C6.2 4.04361 6.13679 4.19198 6.02426 4.30138C5.91174 4.41078 5.75913 4.47223 5.6 4.47223ZM9.2 2.52779C9.04087 2.52779 8.88826 2.58925 8.77574 2.69864C8.66321 2.80804 8.6 2.95641 8.6 3.11112C8.6 3.26583 8.66321 3.41421 8.77574 3.5236C8.88826 3.633 9.04087 3.69446 9.2 3.69446H12.8C12.9591 3.69446 13.1117 3.633 13.2243 3.5236C13.3368 3.41421 13.4 3.26583 13.4 3.11112C13.4 2.95641 13.3368 2.80804 13.2243 2.69864C13.1117 2.58925 12.9591 2.52779 12.8 2.52779H9.2ZM3.2 4.47223C3.04087 4.47223 2.88826 4.41078 2.77574 4.30138C2.66321 4.19198 2.6 4.04361 2.6 3.8889V2.33334C2.6 2.17864 2.66321 2.03026 2.77574 1.92087C2.88826 1.81147 3.04087 1.75001 3.2 1.75001C3.35913 1.75001 3.51174 1.81147 3.62426 1.92087C3.73679 2.03026 3.8 2.17864 3.8 2.33334V3.8889C3.8 4.04361 3.73679 4.19198 3.62426 4.30138C3.51174 4.41078 3.35913 4.47223 3.2 4.47223ZM0.4688 8.23357C-4.76837e-08 8.68935 0 9.42201 0 10.8889C0 12.3558 -4.76837e-08 13.0885 0.4688 13.5442C0.9376 14 1.6912 14 3.2 14H12.8C14.3088 14 15.0624 14 15.5312 13.5442C16 13.0885 16 12.3558 16 10.8889C16 9.42201 16 8.68935 15.5312 8.23357C15.0624 7.77779 14.3088 7.77779 12.8 7.77779H3.2C1.6912 7.77779 0.9376 7.77779 0.4688 8.23357ZM8.6 10.8889C8.6 10.7342 8.66321 10.5858 8.77574 10.4764C8.88826 10.367 9.04087 10.3056 9.2 10.3056H12.8C12.9591 10.3056 13.1117 10.367 13.2243 10.4764C13.3368 10.5858 13.4 10.7342 13.4 10.8889C13.4 11.0436 13.3368 11.192 13.2243 11.3014C13.1117 11.4108 12.9591 11.4722 12.8 11.4722H9.2C9.04087 11.4722 8.88826 11.4108 8.77574 11.3014C8.66321 11.192 8.6 11.0436 8.6 10.8889ZM2.6 11.6667C2.6 11.8214 2.66321 11.9698 2.77574 12.0792C2.88826 12.1886 3.04087 12.25 3.2 12.25C3.35913 12.25 3.51174 12.1886 3.62426 12.0792C3.73679 11.9698 3.8 11.8214 3.8 11.6667V10.1111C3.8 9.95641 3.73679 9.80804 3.62426 9.69864C3.51174 9.58925 3.35913 9.52779 3.2 9.52779C3.04087 9.52779 2.88826 9.58925 2.77574 9.69864C2.66321 9.80804 2.6 9.95641 2.6 10.1111V11.6667ZM5.6 12.25C5.44087 12.25 5.28826 12.1886 5.17574 12.0792C5.06321 11.9698 5 11.8214 5 11.6667V10.1111C5 9.95641 5.06321 9.80804 5.17574 9.69864C5.28826 9.58925 5.44087 9.52779 5.6 9.52779C5.75913 9.52779 5.91174 9.58925 6.02426 9.69864C6.13679 9.80804 6.2 9.95641 6.2 10.1111V11.6667C6.2 11.8214 6.13679 11.9698 6.02426 12.0792C5.91174 12.1886 5.75913 12.25 5.6 12.25Z" fill="#5BC2FF"/>
                                                </svg>
                                                <span>{server.numberOfServerRecipients ?? '0'}</span>
                                            </div>
                                            <div>
                                                <img src={el.settingsTypeIconLink} alt=""/>
                                                <span>{el.numberOfSuccess}</span>
                                                <span className="stat-error">{el.numberOfFail}</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <ul className="home__monitoring">
                                    {server.deliveryStatistics?.map((el, i) =>
                                        <li key={i}>
                                            <div>
                                                <img src={el.settingsTypeIconLink} alt=""/>
                                                <span>{el.numberOfSuccess}</span>
                                                <span className="stat-error">{el.numberOfFail}</span>
                                            </div>
                                            <div>
                                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.4688 0.455789C-4.76837e-08 0.911567 0 1.64423 0 3.11112C0 4.57801 -4.76837e-08 5.31068 0.4688 5.76646C0.9376 6.22223 1.6912 6.22223 3.2 6.22223H12.8C14.3088 6.22223 15.0624 6.22223 15.5312 5.76646C16 5.31068 16 4.57801 16 3.11112C16 1.64423 16 0.911567 15.5312 0.455789C15.0624 1.13977e-05 14.3088 1.14441e-05 12.8 1.14441e-05H3.2C1.6912 1.14441e-05 0.9376 1.13977e-05 0.4688 0.455789ZM5.6 4.47223C5.44087 4.47223 5.28826 4.41078 5.17574 4.30138C5.06321 4.19198 5 4.04361 5 3.8889V2.33334C5 2.17864 5.06321 2.03026 5.17574 1.92087C5.28826 1.81147 5.44087 1.75001 5.6 1.75001C5.75913 1.75001 5.91174 1.81147 6.02426 1.92087C6.13679 2.03026 6.2 2.17864 6.2 2.33334V3.8889C6.2 4.04361 6.13679 4.19198 6.02426 4.30138C5.91174 4.41078 5.75913 4.47223 5.6 4.47223ZM9.2 2.52779C9.04087 2.52779 8.88826 2.58925 8.77574 2.69864C8.66321 2.80804 8.6 2.95641 8.6 3.11112C8.6 3.26583 8.66321 3.41421 8.77574 3.5236C8.88826 3.633 9.04087 3.69446 9.2 3.69446H12.8C12.9591 3.69446 13.1117 3.633 13.2243 3.5236C13.3368 3.41421 13.4 3.26583 13.4 3.11112C13.4 2.95641 13.3368 2.80804 13.2243 2.69864C13.1117 2.58925 12.9591 2.52779 12.8 2.52779H9.2ZM3.2 4.47223C3.04087 4.47223 2.88826 4.41078 2.77574 4.30138C2.66321 4.19198 2.6 4.04361 2.6 3.8889V2.33334C2.6 2.17864 2.66321 2.03026 2.77574 1.92087C2.88826 1.81147 3.04087 1.75001 3.2 1.75001C3.35913 1.75001 3.51174 1.81147 3.62426 1.92087C3.73679 2.03026 3.8 2.17864 3.8 2.33334V3.8889C3.8 4.04361 3.73679 4.19198 3.62426 4.30138C3.51174 4.41078 3.35913 4.47223 3.2 4.47223ZM0.4688 8.23357C-4.76837e-08 8.68935 0 9.42201 0 10.8889C0 12.3558 -4.76837e-08 13.0885 0.4688 13.5442C0.9376 14 1.6912 14 3.2 14H12.8C14.3088 14 15.0624 14 15.5312 13.5442C16 13.0885 16 12.3558 16 10.8889C16 9.42201 16 8.68935 15.5312 8.23357C15.0624 7.77779 14.3088 7.77779 12.8 7.77779H3.2C1.6912 7.77779 0.9376 7.77779 0.4688 8.23357ZM8.6 10.8889C8.6 10.7342 8.66321 10.5858 8.77574 10.4764C8.88826 10.367 9.04087 10.3056 9.2 10.3056H12.8C12.9591 10.3056 13.1117 10.367 13.2243 10.4764C13.3368 10.5858 13.4 10.7342 13.4 10.8889C13.4 11.0436 13.3368 11.192 13.2243 11.3014C13.1117 11.4108 12.9591 11.4722 12.8 11.4722H9.2C9.04087 11.4722 8.88826 11.4108 8.77574 11.3014C8.66321 11.192 8.6 11.0436 8.6 10.8889ZM2.6 11.6667C2.6 11.8214 2.66321 11.9698 2.77574 12.0792C2.88826 12.1886 3.04087 12.25 3.2 12.25C3.35913 12.25 3.51174 12.1886 3.62426 12.0792C3.73679 11.9698 3.8 11.8214 3.8 11.6667V10.1111C3.8 9.95641 3.73679 9.80804 3.62426 9.69864C3.51174 9.58925 3.35913 9.52779 3.2 9.52779C3.04087 9.52779 2.88826 9.58925 2.77574 9.69864C2.66321 9.80804 2.6 9.95641 2.6 10.1111V11.6667ZM5.6 12.25C5.44087 12.25 5.28826 12.1886 5.17574 12.0792C5.06321 11.9698 5 11.8214 5 11.6667V10.1111C5 9.95641 5.06321 9.80804 5.17574 9.69864C5.28826 9.58925 5.44087 9.52779 5.6 9.52779C5.75913 9.52779 5.91174 9.58925 6.02426 9.69864C6.13679 9.80804 6.2 9.95641 6.2 10.1111V11.6667C6.2 11.8214 6.13679 11.9698 6.02426 12.0792C5.91174 12.1886 5.75913 12.25 5.6 12.25Z" fill="#5BC2FF"/>
                                                </svg>
                                                <span>{server.numberOfDeliveryServers ?? '0'}</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </>
                        :
                        <>
                            <div>
                                <div className="home__not-flow">
                                    потоки еще не настроены
                                </div>
                            </div>
                            <div/>
                        </>
                }
                <div>
                    <p>{createDate}</p>
                </div>
                <div>
                    <p>{updateDate}</p>
                </div>
                <div>
                    <p className="location">{server.location ?? '-'}</p>
                </div>
                <div>
                    <button type="button"
                            className={"home__switch-btn switch-btn" + (server.modes?.length ? (server.isSentActive ? ' active' : ' disable') : '')}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (server.modes?.length) {
                                    modalConfirm.set({
                                        style: server.isSentActive ? 'red' : 'green',
                                        titleText: <>{server.isSentActive ? 'Выключить' : 'Включить'} отправку на сервере <b>{server.name}?</b></>,
                                        btnText: server.isSentActive ? 'Да, выключить' : 'Да, включить',
                                        onConfirm: () => {
                                            changeSentServer().then((resp) => {
                                                modalConfirm.close();

                                                if (resp.status === 'SUCCESS') {
                                                    alertControl.set({text: 'Отправка успешно ' + (server.isSentActive ? 'выключена' : 'включена'), type: 'success', open: true});
                                                    serversControl.set(serversControl.get.map((item) => {
                                                        if (item.id === server.id) {
                                                            return {...item, isSentActive: !server.isSentActive}
                                                        }
                                                        return item
                                                    }));
                                                    if (threads.length) setThreads(threads.map((item) => {return {...item, isActive: !server.isSentActive}}));
                                                } else {
                                                    alertControl.set({text: resp.error.description, type: 'error', open: true});
                                                }
                                            });
                                        },
                                        open: true})
                                }
                            }}
                    />
                </div>
            </div>
            {active[0] === server.id &&
                <HomeItemDetails threadsIsLoading={threadsIsLoading}
                                 serversControl={serversControl}
                                 server={server}
                                 threadsControl={threadsControl}
                                 modalConfirm={modalConfirm}
                                 alertControl={alertControl}
                />
            }
        </div>
    );
};

export default HomeItem;