import React, {useState} from 'react';
import {useApi} from "../../hooks/useApi";
import {message} from "antd";

const SelectServersForm = ({serverList, closeModal, versionId}) => {
    const [dropDownIsOpen, setDropDownIsOpen] = useState(false)
    const [selectedServers, setSelectedServers] = useState([])

    const [tryUpdatePO, UpdatePoIsLoading] = useApi({
        url: '/profile-monitoring-system/server/update?versionId=' + versionId,
        data: { serverIds: selectedServers.map(el => el.id) }
    })

    const handle = () => {
        if (selectedServers.length > 0) {
            tryUpdatePO().then(resp => {
                console.log(resp)
            }).catch(err => message.error(err.message))
        }
    }

    return (
        <div className="modal-group__form" onClick={() => setDropDownIsOpen(false)}>
            <div className="modal-group__form-item">
                <div className="modal-group__item-title-box"><p>выберите серверы</p>
                    <div className="modal-group__item-tooltip"><p>Выберите сервера которые на которых будет обновлено ПО.</p></div>
                </div>
                <div className="modal-group__servers-box">
                    <button type="button" className="modal-group__server-add" onClick={(e) => {
                        e.stopPropagation()
                        setDropDownIsOpen(!dropDownIsOpen)
                    }}>Добавить сервер</button>
                    <div className="modal-group__servers-list-box" onClick={e => e.stopPropagation()} style={dropDownIsOpen ? { "height":  "31rem", "paddingTop": "2rem", "paddingBottom": "2rem", "opacity": "1" } : { "height":  "0", "paddingTop": "0", "paddingBottom": "0", "opacity": "0" }}><label
                        className="modal-group__servers-list-search">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z"
                                stroke="#505050" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path d="M19.2531 19.25L15.2656 15.2625" stroke="#505050" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input placeholder="Поиск по IP, названию.."/></label>
                        <ul className="modal-group__servers-list">
                            {serverList.length > 0 && serverList.map(el =>
                                <li className={selectedServers.filter(item => item.id === el.id).length > 0 ? "modal-group__servers-list-item active" : "modal-group__servers-list-item"} key={el.id}>
                                    <label className="modal-group__server-item-checkbox" onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (selectedServers.filter(item => item.id === el.id).length > 0) {
                                            setSelectedServers(selectedServers.filter(item => item.id !== el.id))
                                        } else {
                                            setSelectedServers([...selectedServers, el])
                                        }
                                    }}>
                                        <input id="group1011" value="1011" type="checkbox" name="group-server-add"/>
                                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1.5L4.75 9.75L1 6" stroke="#86E28A" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </label>
                                    <div className="modal-group__server-item-status-box">
                                        <div className="modal-group__server-item-status active"/>
                                        <div className="modal-group__server-item-owner rent">
                                            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M11 4.30283C11 3.68518 10.6975 3.11362 10.1842 2.77253L6.5175 0.311132C5.90333 -0.103711 5.09667 -0.103711 4.4825 0.311132L0.815833 2.77253C0.311667 3.11362 0 3.68518 0 4.30283V9.53906C0 9.79719 0.201667 10 0.458333 10H10.5417C10.7983 10 11 9.79719 11 9.53906V4.30283ZM5.5 7.69532C4.62 7.69532 3.89583 6.96704 3.89583 6.08205C3.89583 5.19705 4.62 4.46877 5.5 4.46877C6.38 4.46877 7.10417 5.19705 7.10417 6.08205C7.10417 6.96704 6.38 7.69532 5.5 7.69532Z"
                                                    fill="white"/>
                                            </svg>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                        <div className="modal-group__server-item-code azure">
                                            <span>{el.maxPower}</span>
                                        </div>
                                    </div>
                                    <p className="modal-group__server-item-name-box">
                                        <span>{el.name}</span>
                                        <span>{el.ip}</span>
                                    </p>
                                    <p className="modal-group__server-item-desc">{el.purpose}</p>
                                    <p className="modal-group__server-item-desc">{el.location}</p>
                                    <button type="button" className={ el.isSentActive ? "home__switch-btn switch-btn active" : "home__switch-btn switch-btn"}/>
                                </li>
                            )}
                        </ul>
                    </div>
                    {selectedServers.map(el =>
                        <div className="modal-group__server" key={el.id}>
                            <p className="modal-group__server-name">{el.name}</p>
                            <p className="modal-group__server-ip">{el.ip}</p>
                            <label htmlFor="group1011" className="modal-group__server-del" onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedServers(selectedServers.filter(item => item.id !== el.id))
                            }}/>
                        </div>
                    )}
                </div>
            </div>
            <div className="modal-group__buttons">
                <button type="submit" onClick={handle} className={selectedServers.length > 0 ? (UpdatePoIsLoading ? "modal-group__submit isLoading" : "modal-group__submit") : "modal-group__submit disable" }><i>
                    <svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg className="no" width="28" height="28" viewBox="0 0 28 28" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.75 18.0131L17.7781 9.98497" stroke="white" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </i><span className="submit-text">СОхранить</span>
                    <img
                        src="https://profile-monitoring-dev.website.yandexcloud.net/assets/aa145e6fba96cfb72d93.svg"
                        className="isLoading__img"/>
                </button>
                <button type="button" className="modal-group__cancel close" onClick={closeModal}><span>Отменить</span></button>
            </div>
        </div>
    );
};

export default SelectServersForm;