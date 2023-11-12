import React, {useState} from 'react';

const CSelect = ({list, val, onChange}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState(val)

    return (
        <div className="modal-network__label select flex-33" onClick={() => setIsOpen(!isOpen)}>
            <p>
                {value ? <>
                        <span>{list.findIndex(el => el.id === value) + 1}.</span>

                        <b>{list.filter(el => el.id === value)[0]?.name}</b> {list.filter(el => el.id === value)[0]?.ip}
                    </> : <span className="gray">Название и Ip</span>}
            </p>
            <input type="text" name="id" style={{"display": "none"}}/>
            <svg className="arrow" width="14" height="8" viewBox="0 0 14 8" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.999939L7 6.99994L13 0.999939" stroke="#393B44"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
            <ul className="modal-network__servers-list" style={isOpen ? {"display": "block"} : {"display": "none"}}>
                {list && list.length > 0 && list.map((el, index) =>
                    <li key={el.id} onClick={ () => {
                        setValue(el.id)
                        if (onChange) onChange(el.id)
                    }}>
                        <span>{index + 1}.</span>
                        <b>{el.name}</b> {el.ip}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default CSelect;