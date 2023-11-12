import React, {useEffect, useRef, useState} from 'react';

const SwitchUI = ({options, onChange, className }) => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const [switched, setSwitched] = useState(true)

    const getWidth = (link) => {
        return link.current ? link.current.offsetWidth : 0
    }

    useEffect(() => {
        setSwitched(false)
    }, []);

    return (
        <div className={className ? "main__filter-switched" + " " + className : "main__filter-switched"} onClick={() => {
            onChange(!switched ? options[1].value : options[0].value)
            setSwitched(!switched)
        }}>
            <label ref={ref1} htmlFor="networksRouterInput" className={switched ? "main__switched-item" : "main__switched-item active" }>{options[0].title}</label>
            <div className="main__switched-bg" style={switched ?
                { "width": getWidth(ref2) + "px", "left": getWidth(ref1) + 15 + "px" } :
                { "width": getWidth(ref1) + "px", "left": "0.5rem" }}
            />
            <label ref={ref2} htmlFor="networksRootInput" className={!switched ? "main__switched-item" : "main__switched-item active" }>{options[1].title}</label>
        </div>
    );
};

export default SwitchUI;
