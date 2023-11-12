import React from 'react';
import EmptyPage from "../EmptyPage";
import MonitoingHeader from "./MonitoingHeader";
import MonitoringServer from "./MonitoringServer";

const MonitoringItem = ({item}) => {
    return (
        <div className="monitoring__content">
            <div className="monitoring__content-header">
                <p className="monitoring__item-title-box">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 1.75L6 6.25L10.5 1.75" stroke="#92A1B2" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{item.periodName}</span>
                </p>
                {item.settings.length > 0 &&
                    <MonitoingHeader setting={item.settings[0]}/>
                }
                {item.settings.length > 1 ?
                    <MonitoingHeader setting={item.settings[1]}/> : <ul className="monitoring__data-list"/>
                }
            </div>
            {item.settings.length > 0 ?
                <div className="monitoring__wrap">
                    <ul className="monitoring__list">
                        {item.settings[0].info.length > 0 && item.settings[0].info.map((el, i) =>
                                <MonitoringServer num={i+1} server={el} key={i}/>
                            )}
                    </ul>
                    <ul className="monitoring__list">
                        {item.settings.length > 1 && item.settings[1].info.length > 0 && item.settings[1].info.map((el, i) =>
                            <MonitoringServer num={i+1} server={el} key={i}/>
                        )}
                    </ul>
                </div>
                : <EmptyPage/>
            }
        </div>
    );
};

export default MonitoringItem;