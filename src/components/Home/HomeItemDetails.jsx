import React, {useState} from 'react';
import DetailsThread from "./DetailsThread";
import projectIconSquare from '../../assets/img/project-icon-square.svg'
import ModalLog from "../Modal/ModalLog";
import PageIsLoading from "../PageIsLoading";

const HomeItemDetails = ({serversControl, threadsIsLoading, server, threadsControl, modalConfirm, alertControl}) => {
    const [detailsTabsIsOpen, setDetailsTabsIsOpen] = useState(1);
    const [isModalLogOpen, setIsModalLogOpen] = useState(false);
    const modalLogControl = {get: isModalLogOpen, set: setIsModalLogOpen};

    let cpuTemplate = (function () {
        let temp = [];

        for (let i = 0; i < 30; i++) {
            temp.push(
                <div key={i}>
                    <div className="cpu-loading" style={{'--percent': 0}}/>
                    <div className="cpu-minute">{i + 1}</div>
                </div>
            );
        }

        return temp;
    })();

    return (
        <div className="details" onClick={(e) => e.stopPropagation()}>
            <div className="details__tabs">
                <button type='button' className={"details__tab" + (detailsTabsIsOpen === 1 ? ' active' : '')} onClick={() => setDetailsTabsIsOpen(1)}>Потоки</button>
                <button type='button' className={"details__tab" + (detailsTabsIsOpen === 2 ? ' active' : '')} onClick={() => setDetailsTabsIsOpen(2)}>Информация</button>
                <button type='button' className={"details__tab" + (detailsTabsIsOpen === 3 ? ' active' : '')} onClick={() => setDetailsTabsIsOpen(3)}>Конфигурация</button>
                <button type="button" className="details__download-log" onClick={() => setIsModalLogOpen(true)}>
                    <span>Скачать логи</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.97 1H3.03C1.76 1 1 1.76 1 3.03V5.97C1 7.24 1.76 8 3.03 8H5.97C7.24 8 8 7.24 8 5.97V3.03C8 1.76 7.24 1 5.97 1ZM6.47 5.56C6.72 5.81 6.72 6.22 6.47 6.47C6.34 6.59 6.17 6.65 6.01 6.65C5.85 6.65 5.69 6.59 5.56 6.47L4.49 5.41L3.45 6.47C3.32 6.59 3.16 6.65 2.98 6.65C2.82 6.65 2.66 6.59 2.53 6.47C2.28 6.22 2.28 5.81 2.53 5.56L3.6 4.5L2.54 3.45C2.29 3.2 2.29 2.79 2.54 2.54C2.79 2.29 3.2 2.29 3.45 2.54L4.49 3.6L5.55 2.54C5.8 2.29 6.21 2.29 6.46 2.54C6.71 2.79 6.71 3.2 6.46 3.45L5.41 4.5L6.47 5.56Z" fill="#EB376D" />
                        <path d="M21.5004 15.82C21.5004 15.97 21.4504 16.12 21.3204 16.25C19.8704 17.71 17.2904 20.31 15.8104 21.8C15.6804 21.94 15.5104 22 15.3404 22C15.0104 22 14.6904 21.74 14.6904 21.36V17.86C14.6904 16.4 15.9304 15.19 17.4504 15.19C18.4004 15.18 19.7204 15.18 20.8504 15.18C21.2404 15.18 21.5004 15.49 21.5004 15.82Z" fill="#EB376D" />
                        <path d="M21.5004 15.82C21.5004 15.97 21.4504 16.12 21.3204 16.25C19.8704 17.71 17.2904 20.31 15.8104 21.8C15.6804 21.94 15.5104 22 15.3404 22C15.0104 22 14.6904 21.74 14.6904 21.36V17.86C14.6904 16.4 15.9304 15.19 17.4504 15.19C18.4004 15.18 19.7204 15.18 20.8504 15.18C21.2404 15.18 21.5004 15.49 21.5004 15.82Z" fill="#EB376D" />
                        <path d="M16.63 2H10.5C9.95 2 9.5 2.45 9.5 3V6.5C9.5 8.16 8.16 9.5 6.5 9.5H3.5C2.95 9.5 2.5 9.95 2.5 10.5V17.13C2.5 19.82 4.68 22 7.37 22H12.19C12.74 22 13.19 21.55 13.19 21V17.86C13.19 15.56 15.1 13.69 17.45 13.69C17.98 13.68 19.27 13.68 20.5 13.68C21.05 13.68 21.5 13.24 21.5 12.68V6.87C21.5 4.18 19.32 2 16.63 2ZM8.72 17.01H6.08C5.67 17.01 5.33 16.67 5.33 16.26C5.33 15.84 5.67 15.5 6.08 15.5H8.72C9.15 15.5 9.47 15.84 9.47 16.26C9.47 16.67 9.15 17.01 8.72 17.01ZM11.51 13.3H6.08C5.67 13.3 5.33 12.96 5.33 12.55C5.33 12.13 5.67 11.79 6.08 11.79H11.51C11.92 11.79 12.27 12.13 12.27 12.55C12.27 12.96 11.92 13.3 11.51 13.3Z" fill="#EB376D" />
                    </svg>
                </button>
            </div>
            {detailsTabsIsOpen === 1 ?
                threadsIsLoading ?
                    <PageIsLoading/>
                    :
                    <div className="details__tab-content details-threads">
                        {threadsControl.get?.length ?
                            threadsControl.get.map((item) => <DetailsThread serversControl={serversControl}
                                                                            threadsControl={threadsControl}
                                                                            thread={item}
                                                                            key={item.id}
                                                                            modalConfirm={modalConfirm}
                                                                            alertControl={alertControl}/>)
                            : ''}
                    </div>
                : ''}
            {detailsTabsIsOpen === 2 &&
                <div className="details__tab-content details-info">
                    <div className="details__text-wrap">
                        <div className="details__text-item">
                            <p className="details__text-title">max МОщн. BAs</p>
                            <p className="details__text-desc maxPower2">{server.maxPower}</p>
                        </div>
                        <div className="details__text-item">
                            <p className="details__text-title">потоков факт.</p>
                            <p className="details__text-desc maxPower2">{server.numberOfThreads}</p>
                        </div>
                        <div className="details__text-item">
                            <p className="details__text-title">корпус</p>
                            <p className="details__text-desc cases">{server.cases ?? '-'}</p>
                        </div>
                        <div className="details__text-item">
                            <p className="details__text-title">от кого</p>
                            <p className="details__text-desc from">{server.from ?? '-'}</p>
                        </div>
                        <div className="details__text-item">
                            <p className="details__text-title">управление</p>
                            <p className="details__text-desc control">{server.control ?? '-'}</p>
                        </div>
                        <div className="details__text-item">
                            <p className="details__text-title">Провайдер</p>
                            <p className="details__text-desc control">???</p>
                        </div>
                        <div className="details__text-item details__text-item--big">
                            <p className="details__text-title">доступы</p>
                            <p className="details__text-desc accesses">{server.accesses ?? '-'}</p>
                        </div>
                        <div className="details__text-item details__text-item--big">
                            <p className="details__text-title">сервер антикаптчи</p>
                            <p className="details__text-desc accesses">???</p>
                        </div>
                    </div>
                    <div className="details__text-wrap">
                        <div className="details__text-item details__text-item--flex-30">
                            <p className="details__text-title">нагрузка <b>цп</b> за последние <span className="green">30 мин</span></p>
                            <div className="details__cpu-box">
                                <div className="details__cpu-percents">
                                    <div>0</div>
                                    <div>10</div>
                                    <div>30</div>
                                    <div>60</div>
                                    <div>100</div>
                                </div>
                                <div className="details__cpu-content">
                                    {cpuTemplate}
                                </div>
                            </div>
                        </div>
                        <div className="details__text-item details__text-item--flex-30">
                            <p className="details__text-title">Справка</p>
                            <p className="details__text-desc help">
                                {server.help ?? '-'}<br/>
                                Токен сервера - {server.token}
                            </p>
                        </div>
                        <div className="details__text-item details__text-item--flex-30">
                            <p className="details__text-title">Неисправность</p>
                            <p className="details__text-desc help">
                                {server.error ?? '-'}
                            </p>
                        </div>
                    </div>
                    <div className="details__groups">
                        {
                            server.groups?.map((el, i) =>
                                <div className="details__group-item" key={i}>
                                    <svg width="34" height="6" xmlns="http://www.w3.org/2000/svg" fill="none">
                                        <path strokeWidth="0" stroke="null" id="svg_1" fillOpacity="0.3" fill="#88D0FA" d="m0,10.82973c0,-3.866 3.13401,-7 7,-7l10.907,0c1.0486,0 2.0838,0.23558 3.0291,0.68934l9.6278,4.62132c0.9453,0.45376 1.9805,0.68934 3.0291,0.68934l109.407,0c3.866,0 7,3.13401 7,6.99996l0,28c0,3.866 -3.134,7 -7,7l-136,0c-3.86599,0 -7,-3.134 -7,-7l0,-33.99996z"/>
                                    </svg>
                                    <span>{el.name}</span>
                                </div>
                            )
                        }
                    </div>
                    <div className="details__projects">
                        {
                            server.projects?.map((el, i) =>
                                <div className="details__project-item" key={i}>
                                    <div className="details__project-icon">
                                        <img src={projectIconSquare} alt="" />
                                    </div>
                                    <p>{el.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            }
            {detailsTabsIsOpen === 3 ?
                <div className="details__tab-content details-config">
                    <ul className="details__config-list">
                        <li className="details__config-item">
                            <p className="details__config-title">процессор</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">SSD</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">SSD</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">RAM</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">видеокарта</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">блок питания</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">терпопаста</p>
                            <p className="details__config-name">
                                ?? <i>|</i> ??
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                        <li className="details__config-item">
                            <p className="details__config-title">дополнительно</p>
                            <p className="details__config-name">
                                ???
                            </p>
                            <button type="button" className="details__config-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M4.21803 13.0817C3.18519 12.7088 2.26895 11.9791 1.68589 10.9414C0.353185 8.57415 1.16947 5.49345 3.53502 4.0666L7.43317 1.71551C9.78206 0.288654 12.814 1.06692 14.1467 3.41799C15.4794 5.78527 14.6631 8.86601 12.2975 10.2929L11.7811 10.6496" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.8294 4.8761C18.8622 5.24903 19.7785 5.97863 20.3615 7.01634C21.6942 9.38363 20.8779 12.4644 18.5124 13.8912L14.6142 16.2423C12.2653 17.6691 9.23344 16.8909 7.90073 14.5398C6.56803 12.1725 7.38431 9.09181 9.74986 7.66495L10.2663 7.30824" stroke="#5BC2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
                : ''
            }

            <ModalLog isOpen={modalLogControl} id={server.id} alertControl={alertControl}/>
        </div>
    );
};

export default HomeItemDetails;