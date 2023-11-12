import React, {useState} from 'react';
import {Dropdown} from "antd";
import EmptyPage from "../EmptyPage";

const NetworkRouterItem = ({item, editItem, deleteItem}) => {
    const [detailsIsOpen, setDetailIsOpen] = useState(false)

    const items = [
        {
            label: <button type="button" className="home__item-btn-item captcha-item-edit" onClick={editItem}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.08876 1.00474L0.866469 7.22594C0.626689 7.46568 0.398907 7.93317 0.350951 8.2688L0.015261 10.6422C-0.104629 11.5053 0.494815 12.1046 1.35802 11.9847L3.73182 11.6491C4.06751 11.6012 4.53511 11.3734 4.77489 11.1337L10.9972 4.91247C12.0642 3.84563 12.5797 2.599 10.9972 1.01673C9.41463 -0.577532 8.16777 -0.07408 7.08876 1.00474Z"
                        fill="#8B98EE"/>
                    <path d="M6 2.25C6.50769 4.06154 7.92692 5.49231 9.75 6" stroke="white"
                          strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </button>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <button type="button" className="home__item-btn-item captcha-item-del" onClick={deleteItem}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.0466 3.48668C12.9733 3.38001 11.8999 3.30001 10.8199 3.24001V3.23334L10.6733 2.36668C10.5733 1.75334 10.4266 0.833344 8.86661 0.833344H7.11994C5.56661 0.833344 5.41994 1.71334 5.31328 2.36001L5.17328 3.21334C4.55328 3.25334 3.93328 3.29334 3.31328 3.35334L1.95328 3.48668C1.67328 3.51334 1.47328 3.76001 1.49994 4.03334C1.52661 4.30668 1.76661 4.50668 2.04661 4.48001L3.40661 4.34668C6.89994 4.00001 10.4199 4.13334 13.9533 4.48668C13.9733 4.48668 13.9866 4.48668 14.0066 4.48668C14.2599 4.48668 14.4799 4.29334 14.5066 4.03334C14.5266 3.76001 14.3266 3.51334 14.0466 3.48668Z"
                        fill="#EB376D"/>
                    <path
                        d="M12.8202 5.42666C12.6602 5.25999 12.4402 5.16666 12.2135 5.16666H3.78683C3.56016 5.16666 3.33349 5.25999 3.18016 5.42666C3.02683 5.59332 2.94016 5.81999 2.95349 6.05332L3.36683 12.8933C3.44016 13.9067 3.53349 15.1733 5.86016 15.1733H10.1402C12.4668 15.1733 12.5602 13.9133 12.6335 12.8933L13.0468 6.05999C13.0602 5.81999 12.9735 5.59332 12.8202 5.42666ZM9.10682 11.8333H6.88683C6.61349 11.8333 6.38683 11.6067 6.38683 11.3333C6.38683 11.06 6.61349 10.8333 6.88683 10.8333H9.10682C9.38016 10.8333 9.60682 11.06 9.60682 11.3333C9.60682 11.6067 9.38016 11.8333 9.10682 11.8333ZM9.66683 9.16666H6.33349C6.06016 9.16666 5.83349 8.93999 5.83349 8.66666C5.83349 8.39332 6.06016 8.16666 6.33349 8.16666H9.66683C9.94016 8.16666 10.1668 8.39332 10.1668 8.66666C10.1668 8.93999 9.94016 9.16666 9.66683 9.16666Z"
                        fill="#EB376D"/>
                </svg>
            </button>,
            key: '1',
        },
    ];

    return (
        <div className={ detailsIsOpen ? "home__item active" : "home__item" } style={{"order": "0" }}>
            <div className="home__item-content" onClick={() => setDetailIsOpen(!detailsIsOpen)}>
                <div onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                        className="actions-dropdown"
                        overlayClassName="actions-dropdown-list"
                        destroyPopupOnHide={true}
                    >
                        <div className="home__item-btn home__item-btn--circle">
                            <button type="button" className="home-list-btn">
                                <svg width="3" height="14" viewBox="0 0 3 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="1.5" cy="1.5" r="1.5" fill="#8B98EE"/>
                                    <circle cx="1.5" cy="6.88461" r="1.5" fill="#8B98EE"/>
                                    <circle cx="1.5" cy="12.2692" r="1.5" fill="#8B98EE"/>
                                </svg>
                            </button>
                        </div>
                    </Dropdown>
                </div>
                <div>
                    <div className="home__status-icon active"/>
                </div>
                <div>
                    <span>{item.name}</span>
                </div>
                <div className="ip">{("" + item.ip).replace('http://', '').replace('https://', '').replace(/\:.*/, '')}</div>
                <div className="name">{item.location}</div>
                <div>{item.countOfServers}</div>
            </div>
            <div className="details" data-load="true" style={ detailsIsOpen ? {
                "display": "block", "height": "21.4rem", "overflow": "hidden", "padding": "7rem 2rem 2rem 2rem"
            } : {"display": "block", "height": "0", "overflow": "hidden", "padding": "4.8rem 2rem 0rem 2rem" }}>
                <p className="networks__details-title">Подключенные сервера</p>
                <ul className="details__thread-list">
                    {item.servers.length > 0 ? item.servers.map(el =>
                            <li className="details__thread-item active" key={el.id}>
                                <div className="details__thread-item-header">
                                    <div className="home__status-owner undefined">
                                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M11 4.30283C11 3.68518 10.6975 3.11362 10.1842 2.77253L6.5175 0.311132C5.90333 -0.103711 5.09667 -0.103711 4.4825 0.311132L0.815833 2.77253C0.311667 3.11362 0 3.68518 0 4.30283V9.53906C0 9.79719 0.201667 10 0.458333 10H10.5417C10.7983 10 11 9.79719 11 9.53906V4.30283ZM5.5 7.69532C4.62 7.69532 3.89583 6.96704 3.89583 6.08205C3.89583 5.19705 4.62 4.46877 5.5 4.46877C6.38 4.46877 7.10417 5.19705 7.10417 6.08205C7.10417 6.96704 6.38 7.69532 5.5 7.69532Z"
                                                fill="white"/>
                                        </svg>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4.77891 13.0687C4.76016 13.0687 4.73516 13.0812 4.71641 13.0812C3.50391 12.4812 2.51641 11.4874 1.91016 10.2749C1.91016 10.2562 1.92266 10.2312 1.92266 10.2124C2.68516 10.4374 3.47266 10.6062 4.25391 10.7374C4.39141 11.5249 4.55391 12.3062 4.77891 13.0687Z"
                                                fill="white"/>
                                            <path
                                                d="M13.0859 10.2812C12.4672 11.5249 11.4359 12.5312 10.1797 13.1374C10.4172 12.3437 10.6172 11.5437 10.7484 10.7374C11.5359 10.6062 12.3109 10.4374 13.0734 10.2124C13.0672 10.2374 13.0859 10.2624 13.0859 10.2812Z"
                                                fill="white"/>
                                            <path
                                                d="M13.1359 4.81904C12.3484 4.58154 11.5547 4.38779 10.7484 4.25029C10.6172 3.44404 10.4234 2.64404 10.1797 1.86279C11.4734 2.48154 12.5172 3.52529 13.1359 4.81904Z"
                                                fill="white"/>
                                            <path
                                                d="M4.78203 1.93049C4.55703 2.69299 4.39453 3.46799 4.26328 4.25549C3.45703 4.38049 2.65703 4.58049 1.86328 4.81799C2.46953 3.56174 3.47578 2.53049 4.71953 1.91174C4.73828 1.91174 4.76328 1.93049 4.78203 1.93049Z"
                                                fill="white"/>
                                            <path
                                                d="M9.68281 4.11826C8.23281 3.95576 6.77031 3.95576 5.32031 4.11826C5.47656 3.26201 5.67656 2.40576 5.95781 1.58076C5.97031 1.53076 5.96406 1.49326 5.97031 1.44326C6.46406 1.32451 6.97031 1.24951 7.50156 1.24951C8.02656 1.24951 8.53906 1.32451 9.02656 1.44326C9.03281 1.49326 9.03281 1.53076 9.04531 1.58076C9.32656 2.41201 9.52656 3.26201 9.68281 4.11826Z"
                                                fill="white"/>
                                            <path
                                                d="M4.11973 9.68232C3.25723 9.52607 2.40723 9.32607 1.58223 9.04482C1.53223 9.03232 1.49473 9.03857 1.44473 9.03232C1.32598 8.53857 1.25098 8.03232 1.25098 7.50107C1.25098 6.97607 1.32598 6.46357 1.44473 5.97607C1.49473 5.96982 1.53223 5.96982 1.58223 5.95732C2.41348 5.68232 3.25723 5.47607 4.11973 5.31982C3.96348 6.76982 3.96348 8.23232 4.11973 9.68232Z"
                                                fill="white"/>
                                            <path
                                                d="M13.7496 7.50107C13.7496 8.03232 13.6746 8.53857 13.5559 9.03232C13.5059 9.03857 13.4684 9.03232 13.4184 9.04482C12.5871 9.31982 11.7371 9.52607 10.8809 9.68232C11.0434 8.23232 11.0434 6.76982 10.8809 5.31982C11.7371 5.47607 12.5934 5.67607 13.4184 5.95732C13.4684 5.96982 13.5059 5.97607 13.5559 5.97607C13.6746 6.46982 13.7496 6.97607 13.7496 7.50107Z"
                                                fill="white"/>
                                            <path
                                                d="M9.68281 10.8811C9.52656 11.7436 9.32656 12.5936 9.04531 13.4186C9.03281 13.4686 9.03281 13.5061 9.02656 13.5561C8.53906 13.6749 8.02656 13.7499 7.50156 13.7499C6.97031 13.7499 6.46406 13.6749 5.97031 13.5561C5.96406 13.5061 5.97031 13.4686 5.95781 13.4186C5.68281 12.5874 5.47656 11.7436 5.32031 10.8811C6.04531 10.9624 6.77031 11.0186 7.50156 11.0186C8.23281 11.0186 8.96406 10.9624 9.68281 10.8811Z"
                                                fill="white"/>
                                            <path
                                                d="M9.85306 9.85159C8.28987 10.0488 6.71208 10.0488 5.14889 9.85159C4.95167 8.28841 4.95167 6.71061 5.14889 5.14743C6.71208 4.95021 8.28987 4.95021 9.85306 5.14743C10.0503 6.71061 10.0503 8.28841 9.85306 9.85159Z"
                                                fill="white"/>
                                        </svg>
                                    </div>
                                    <p className="home__status-thread azure">{el.server.numberOfThreads}</p>
                                    <p className="details__thread-item-name">{el.server.name}</p>
                                    <p className="details__thread-item-ip">{("" + el.server.ip).replace('http://', '').replace('https://', '').replace(/\:.*/, '')}</p>
                                </div>
                                <div className="details__thread-item-footer">
                                    <button type="button"
                                            className="details__thread-server-btn details__thread-btn--min"/>
                                </div>
                            </li>
                        )
                        :
                        <EmptyPage/>
                    }
                </ul>
            </div>
        </div>
    );
};

export default NetworkRouterItem;