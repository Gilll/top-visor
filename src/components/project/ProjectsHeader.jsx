import React from 'react';
import {routeNames} from "../../router/routeNames";
import {Link} from "react-router-dom";

const ProjectsHeader = ({projectsCount, setSearch, search, callAddModal}) => {
    return (
        <div className="main__header">
            <div>
                <button className="main__btn main__btn--add popup-project" onClick={callAddModal}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5.41663V20.5833" stroke="white" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M5.41797 13H20.5846" stroke="white" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
                <p className="main__title"><span>Проекты</span> <sup>{projectsCount}</sup></p>
            </div>
            <div>
                <Link to={routeNames.yandexAccounts} className="main__wide-btn">Аккаунты XML</Link>
                <label className="main__search-label">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z"
                            stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.2512 19.2501L15.2637 15.2626" stroke="#505050" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск проекта" id="searchProjects"/>
                </label>
            </div>
        </div>
    );
};

export default ProjectsHeader;