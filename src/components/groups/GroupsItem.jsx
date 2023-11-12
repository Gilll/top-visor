import React from 'react';
import {Link} from "react-router-dom";
import {routeNames} from "../../router/routeNames";
import imgTop from "../../assets/img/group-top.svg"

const GroupsItem = ({group, deleteGroup, editGroup}) => {
    return (
        <Link to={routeNames.group + '/' + group.id} className="groups__item">
            <div className="groups__item-bg">
                <img src={imgTop} alt=""/>
            </div>
            <button type="button" className="groups__option-btn">
                <span/>
            </button>
            <div className="groups__item-header">
                <div className="groups__servers-qty">
                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.6355 1.83334H8.06093C5.95539 1.83334 4.25 3.47417 4.25 5.5V12.1458C4.25 12.65 4.67873 13.0625 5.20273 13.0625H19.4937C20.0177 13.0625 20.4465 12.65 20.4465 12.1458V5.5C20.4465 3.47417 18.7411 1.83334 16.6355 1.83334Z"
                            fill="#88D0FA"/>
                        <path
                            d="M4.25 15.3542V16.5C4.25 18.5258 5.95539 20.1667 8.06093 20.1667H16.6355C18.7411 20.1667 20.4465 18.5258 20.4465 16.5V15.3542C20.4465 14.85 20.0177 14.4375 19.4937 14.4375H5.20273C4.67873 14.4375 4.25 14.85 4.25 15.3542ZM17.312 17.8383C17.1309 18.0033 16.8832 18.1042 16.6355 18.1042C16.3878 18.1042 16.1401 18.0033 15.9591 17.8383C15.7876 17.6642 15.6828 17.4258 15.6828 17.1875C15.6828 16.9492 15.7876 16.7108 15.9591 16.5367C16.3116 16.1975 16.9499 16.1975 17.312 16.5367C17.4835 16.7108 17.5883 16.9492 17.5883 17.1875C17.5883 17.4258 17.4835 17.6642 17.312 17.8383Z"
                            fill="#88D0FA"/>
                    </svg>
                    <span>{group.servers.length}</span>
                </div>
                <div className="groups__header-numbers orange">
                    <span>{group.sumOfThreads}</span>
                </div>
            </div>
            <div className="groups__item-content">
                <p className="groups__item-name">{group.name}</p>
                <div className="groups__item-buttons">
                    <button type="button" className="groups__item-btn edit" onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        editGroup()
                    }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.27052 1.0305L0.888686 7.41122C0.642758 7.65711 0.409136 8.13659 0.35995 8.48082L0.0156523 10.9151C-0.107312 11.8003 0.507502 12.415 1.39284 12.292L3.82751 11.9478C4.17181 11.8986 4.6514 11.665 4.89732 11.4192L11.2792 5.03843C12.3735 3.94424 12.9023 2.66564 11.2792 1.0428C9.65604 -0.59234 8.3772 -0.0759795 7.27052 1.0305Z"
                                fill="#8B98EE"/>
                            <path d="M6.15625 2.30768C6.67696 4.16567 8.13258 5.63312 10.0024 6.15383"
                                  stroke="#F3F4F8" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button type="button" className="groups__item-btn del" onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        deleteGroup()
                    }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.5078 3.35257C12.4757 3.25001 11.4437 3.17308 10.4052 3.11539V3.10898L10.2642 2.27565C10.1681 1.6859 10.027 0.801289 8.52703 0.801289H6.84754C5.35395 0.801289 5.21293 1.64744 5.11036 2.26924L4.97575 3.08975C4.3796 3.12821 3.78344 3.16667 3.18729 3.22437L1.8796 3.35257C1.61036 3.37821 1.41806 3.61539 1.4437 3.87821C1.46934 4.14103 1.70011 4.33334 1.96934 4.3077L3.27703 4.17949C6.63601 3.84616 10.0206 3.97437 13.4181 4.31411C13.4373 4.31411 13.4501 4.31411 13.4693 4.31411C13.7129 4.31411 13.9245 4.12821 13.9501 3.87821C13.9693 3.61539 13.777 3.37821 13.5078 3.35257Z"
                                fill="#EB376D"/>
                            <path
                                d="M12.3283 5.21796C12.1745 5.0577 11.9629 4.96796 11.745 4.96796H3.64242C3.42447 4.96796 3.20652 5.0577 3.05908 5.21796C2.91165 5.37821 2.82831 5.59616 2.84114 5.82052L3.23857 12.3974C3.30908 13.3718 3.39883 14.5898 5.63601 14.5898H9.75139C11.9886 14.5898 12.0783 13.3782 12.1488 12.3974L12.5463 5.82693C12.5591 5.59616 12.4758 5.37821 12.3283 5.21796ZM8.7578 11.3782H6.62319C6.36037 11.3782 6.14242 11.1603 6.14242 10.8974C6.14242 10.6346 6.36037 10.4167 6.62319 10.4167H8.7578C9.02062 10.4167 9.23857 10.6346 9.23857 10.8974C9.23857 11.1603 9.02062 11.3782 8.7578 11.3782ZM9.29626 8.81411H6.09114C5.82832 8.81411 5.61037 8.59616 5.61037 8.33334C5.61037 8.07052 5.82832 7.85257 6.09114 7.85257H9.29626C9.55908 7.85257 9.77703 8.07052 9.77703 8.33334C9.77703 8.59616 9.55908 8.81411 9.29626 8.81411Z"
                                fill="#EB376D"/>
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default GroupsItem;