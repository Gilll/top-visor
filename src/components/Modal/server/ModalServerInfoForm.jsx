import React, {useEffect, useRef, useState} from 'react';
import {Form, Input, Radio, Switch} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useApi} from "../../../hooks/useApi";
import projectSquareIcon from '../../../assets/img/project-icon-square.svg'

const ModalServerInfoForm = ({formValues, setFormValues}) => {
    const [affiliationValue, setAffiliationValue] = useState(formValues.affiliation);
    const [maxPowerValue, setMaxPowerValue] = useState(formValues.maxPower);
    const [projectList, setProjectsList] = useState([]);
    const [projectsCheckList, setProjectsCheckList] = useState(formValues.projects?.length ? formValues.projects.map((el) => {return el.id}) : []);
    const [projectListIsOpen, setProjectListIsOpen] = useState(false);

    const affiliationRadioList = [
        {
            label:
                <div className={'modal-server__label' + (affiliationValue === 'owner' ? ' active-radio' : '')}>
                    <span className="modal-server__radio-icon"/>
                    <span className="text">Наш</span>
                    <span className="modal-server__owner-icon">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4.30274C11 3.68509 10.6975 3.11353 10.1842 2.77244L6.5175 0.31104C5.90333 -0.103802 5.09667 -0.103802 4.4825 0.31104L0.815833 2.77244C0.311667 3.11353 0 3.68509 0 4.30274V9.53897C0 9.7971 0.201667 9.99991 0.458333 9.99991H10.5417C10.7983 9.99991 11 9.7971 11 9.53897V4.30274ZM5.5 7.69523C4.62 7.69523 3.89583 6.96695 3.89583 6.08196C3.89583 5.19696 4.62 4.46868 5.5 4.46868C6.38 4.46868 7.10417 5.19696 7.10417 6.08196C7.10417 6.96695 6.38 7.69523 5.5 7.69523Z" fill="white"/>
                        </svg>
                    </span>
                </div>,
            value: 'owner',
        },
        {
            label:
                <div className={'modal-server__label' + (affiliationValue === 'rent' ? ' active-radio' : '')}>
                    <span className="modal-server__radio-icon"/>
                    <span className="text">Аренда</span>
                    <span className="modal-server__owner-icon net">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.77891 13.0687C4.76016 13.0687 4.73516 13.0812 4.71641 13.0812C3.50391 12.4812 2.51641 11.4874 1.91016 10.2749C1.91016 10.2562 1.92266 10.2312 1.92266 10.2124C2.68516 10.4374 3.47266 10.6062 4.25391 10.7374C4.39141 11.5249 4.55391 12.3062 4.77891 13.0687Z" fill="white"/>
                            <path d="M13.0859 10.2811C12.4672 11.5249 11.4359 12.5311 10.1797 13.1374C10.4172 12.3436 10.6172 11.5436 10.7484 10.7374C11.5359 10.6061 12.3109 10.4374 13.0734 10.2124C13.0672 10.2374 13.0859 10.2624 13.0859 10.2811Z" fill="white"/>
                            <path d="M13.1359 4.81901C12.3484 4.58151 11.5547 4.38776 10.7484 4.25026C10.6172 3.44401 10.4234 2.64401 10.1797 1.86276C11.4734 2.48151 12.5172 3.52526 13.1359 4.81901Z" fill="white"/>
                            <path d="M4.78203 1.93052C4.55703 2.69302 4.39453 3.46802 4.26328 4.25552C3.45703 4.38052 2.65703 4.58052 1.86328 4.81802C2.46953 3.56177 3.47578 2.53052 4.71953 1.91177C4.73828 1.91177 4.76328 1.93052 4.78203 1.93052Z" fill="white"/>
                            <path d="M9.68281 4.11829C8.23281 3.95579 6.77031 3.95579 5.32031 4.11829C5.47656 3.26204 5.67656 2.40579 5.95781 1.58079C5.97031 1.53079 5.96406 1.49329 5.97031 1.44329C6.46406 1.32454 6.97031 1.24954 7.50156 1.24954C8.02656 1.24954 8.53906 1.32454 9.02656 1.44329C9.03281 1.49329 9.03281 1.53079 9.04531 1.58079C9.32656 2.41204 9.52656 3.26204 9.68281 4.11829Z" fill="white"/>
                            <path d="M4.11875 9.68229C3.25625 9.52604 2.40625 9.32604 1.58125 9.04479C1.53125 9.03229 1.49375 9.03854 1.44375 9.03229C1.325 8.53854 1.25 8.03229 1.25 7.50104C1.25 6.97604 1.325 6.46354 1.44375 5.97604C1.49375 5.96979 1.53125 5.96979 1.58125 5.95729C2.4125 5.68229 3.25625 5.47604 4.11875 5.31979C3.9625 6.76979 3.9625 8.23229 4.11875 9.68229Z" fill="white"/>
                            <path d="M13.7496 7.50104C13.7496 8.03229 13.6746 8.53854 13.5559 9.03229C13.5059 9.03854 13.4684 9.03229 13.4184 9.04479C12.5871 9.31979 11.7371 9.52604 10.8809 9.68229C11.0434 8.23229 11.0434 6.76979 10.8809 5.31979C11.7371 5.47604 12.5934 5.67604 13.4184 5.95729C13.4684 5.96979 13.5059 5.97604 13.5559 5.97604C13.6746 6.46979 13.7496 6.97604 13.7496 7.50104Z" fill="white"/>
                            <path d="M9.68281 10.8812C9.52656 11.7437 9.32656 12.5937 9.04531 13.4187C9.03281 13.4687 9.03281 13.5062 9.02656 13.5562C8.53906 13.6749 8.02656 13.7499 7.50156 13.7499C6.97031 13.7499 6.46406 13.6749 5.97031 13.5562C5.96406 13.5062 5.97031 13.4687 5.95781 13.4187C5.68281 12.5874 5.47656 11.7437 5.32031 10.8812C6.04531 10.9624 6.77031 11.0187 7.50156 11.0187C8.23281 11.0187 8.96406 10.9624 9.68281 10.8812Z" fill="white"/>
                            <path d="M9.85208 9.85162C8.2889 10.0488 6.7111 10.0488 5.14792 9.85162C4.95069 8.28844 4.95069 6.71064 5.14792 5.14746C6.7111 4.95024 8.2889 4.95024 9.85208 5.14746C10.0493 6.71064 10.0493 8.28844 9.85208 9.85162Z" fill="white"/>
                        </svg>
                    </span>
                </div>,
            value: 'rent',
        },
    ];

    const onChangeAffiliation = ({ target: { value } }) => {
        setAffiliationValue(value);
    };

    const maxPowerRadioList = [
        {
            label:
                <div className={'modal-server__label' + (maxPowerValue === 100 ? ' active-radio' : '')}>
                    <span className="modal-server__radio-icon"/>
                    <span className="text">100</span>
                </div>,
            value: 100,
        },
        {
            label:
                <div className={'modal-server__label' + (maxPowerValue === 200 ? ' active-radio' : '')}>
                    <span className="modal-server__radio-icon"/>
                    <span className="text">200</span>
                </div>,
            value: 200,
        },
    ];

    const onChangeMaxPower = ({ target: { value } }) => {
        setMaxPowerValue(value);
    };

    const [getProjectList, projectListIsLoading] = useApi({
        method: 'GET',
        url: '/profile-monitoring-system/project/all',
    });

    useEffect(() => {
        getProjectList().then((resp) => {
            setProjectsList(resp.result);
        });
    }, []);

    const projectListRef = useRef(null);

    useEffect(() => {
        const onClick = e => projectListRef.current.contains(e.target) || setProjectListIsOpen(false);
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    function flistOnChange (e) {
        if (e.target.checked) {
            setProjectsCheckList([...projectsCheckList, e.target.value]);
            setFormValues({...formValues, projectIds: [...projectsCheckList, e.target.value]});
        } else {
            setProjectsCheckList(projectsCheckList.filter(item => item != e.target.value));
            setFormValues({...formValues, projectIds: projectsCheckList.filter(item => item !== e.target.value)});
        }
    }

    return (
        <div className="modal-server__form">
            <Form.Item
                label={<div><p>Название *</p><div className="modal-server__item-tooltip"><p>Наименование сервера.</p></div></div>}
                name='name'
                className="modal-server__form-item flex-25"
                rules={[
                    {
                        required: true,
                        message: 'Обязательное поле не заполнено',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>IP-адрес *</p><div className="modal-server__item-tooltip"><p>IP адрес сервера, указывается в формате 255.255.255.255 или c добавление порта 255.255.255.255:8080.</p></div></div>}
                name='ip'
                className="modal-server__form-item flex-25"
                rules={[
                    {
                        required: true,
                        message: 'Обязательное поле не заполнено',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>альтернатива</p><p>основной порт</p><p>порт 2</p></div>}
                className="modal-server__form-item modal-server__form-item--ports flex-25"
            >
                <Form.Item noStyle>
                    <Switch disabled/>
                </Form.Item>
                <Form.Item noStyle name='port'>
                    <Input placeholder="400" type='number' disabled/>
                </Form.Item>
                <Form.Item noStyle name='port'>
                    <Input placeholder="80" type='number' disabled/>
                </Form.Item>
            </Form.Item>
            <Form.Item
                label={<div><p>принадлежность</p><div className="modal-server__item-tooltip"><p>Можно указать кому принадлежит сервер, наш собственный или арендованный.</p></div></div>}
                name='affiliation'
                className="modal-server__form-item modal-server__form-item--radioGroup flex-25"
            >
                <Radio.Group
                    options={affiliationRadioList}
                    onChange={onChangeAffiliation}
                    value={affiliationValue}
                />
            </Form.Item>
            <Form.Item
                label={<div><p>назначение</p><div className="modal-server__item-tooltip"><p>Информация о предназначении сервера.</p></div></div>}
                name='purpose'
                className="modal-server__form-item flex-25"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>max количество потоков*</p><div className="modal-server__item-tooltip"><p>Мощнось сервера BAS. Количество потоков которое может выдержать сервер.</p></div></div>}
                name='maxPower'
                className="modal-server__form-item modal-server__form-item--radioGroup flex-25"
                rules={[
                    {
                        required: true,
                        message: 'Обязательное поле не заполнено',
                    },
                ]}
            >
                <Radio.Group
                    options={maxPowerRadioList}
                    onChange={onChangeMaxPower}
                    value={maxPowerValue}
                />
            </Form.Item>
            <Form.Item
                label={<div><p>потоков фактически*</p><div className="modal-server__item-tooltip"><p>Количество потоков работающих на данный момент.</p></div></div>}
                name='numberOfThreads'
                className="modal-server__form-item flex-25"
                rules={[
                    {
                        required: true,
                        message: 'Обязательное поле не заполнено',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>локация</p><div className="modal-server__item-tooltip"><p>Фактическое местонахождение сервера.</p></div></div>}
                name='location'
                className="modal-server__form-item flex-25"
            >
                <Input/>
            </Form.Item>
            <div className="modal-server__form-item flex-100">
                <div className="modal-server__item-title-box">
                    <p>проекты</p>
                    <div className="modal-server__item-tooltip">
                        <p>Выберите проекты в которых будет состоять данный сервер.</p>
                    </div>
                </div>
                <div className="modal-server__flist-content flist-projects" ref={projectListRef}>
                    <button type="button" className="modal-server__flist-add" onClick={() => setProjectListIsOpen(!projectListIsOpen)}>
                        Добавить проект
                    </button>
                    <div className={"modal-server__flist-box" + (projectListIsOpen ? ' active' : '')}>
                        <label className="modal-server__flist-search">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19.2531 19.25L15.2656 15.2625" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input placeholder="Поиск по названию.." type="text"/>
                        </label>
                        <ul className="modal-server__flist">
                            {
                                projectList.length > 0 ? projectList.map((el) => (
                                    <li className={"modal-server__flist-item" + (projectsCheckList.find(e => e == el.id) ? ' active' : '')} key={el.id}>
                                        <label className="modal-server__flist-checkbox">
                                            <input id={`modalProject${el.id}`} value={el.id} onChange={flistOnChange} type="checkbox" name="projectIds" defaultChecked={Boolean(projectsCheckList.find(e => e == el.id))}/>
                                            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13 1.5L4.75 9.75L1 6" stroke="#86E28A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </label>
                                        <div className="modal-server__flist-icon">
                                            <img src={projectSquareIcon} alt=""/>
                                        </div>
                                        <p className="modal-server__flist-name">{el.name}</p>
                                    </li>
                                )) : ''
                            }
                        </ul>
                    </div>
                    {
                        projectsCheckList.map((el) => (
                            <div className="modal-server__flist-label" key={el}>
                                <div className="modal-server__flist-icon">
                                    <img src={projectSquareIcon} alt=""/>
                                </div>
                                <p className="modal-server__flist-label-name">{projectList.find(item => item.id == el)?.name}</p>
                                <label htmlFor={`modalProject${el}`} className="modal-server__flist-label-del"/>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Form.Item
                label={<div><p>от кого</p><div className="modal-server__item-tooltip"><p>От кого получен данный сервер.</p></div></div>}
                name='from'
                className="modal-server__form-item flex-50"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>Доступы</p><div className="modal-server__item-tooltip"><p>Логин, пароль и другие доступы для удаленного подключения к серверу.</p></div></div>}
                name='accesses'
                className="modal-server__form-item flex-50"
            >
                <Input/>
            </Form.Item>
            <Form.Item noStyle name='captcha'>
                <div className="modal-server__form-item flex-100">
                    <div className="modal-server__item-title-box">
                        <p>сервер антикапчи</p>
                        <div className="modal-server__item-tooltip">
                            <p>Выберите сервер антикаптчи для данного сервера.</p>
                        </div>
                    </div>
                    <div className="modal-server__flist-content flist-captcha">
                        <button type="button" className="modal-server__flist-add">
                            Добавить сервер
                        </button>
                        <div className="modal-server__flist-box">
                            <label className="modal-server__flist-search">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19.2531 19.25L15.2656 15.2625" stroke="#505050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <input placeholder="Поиск по названию, ip.." type="text"/>
                            </label>
                            <ul className="modal-server__flist" id="formCaptchaList"/>
                        </div>
                    </div>
                </div>
            </Form.Item>
            <Form.Item
                label={<div><p>Провайдер</p><div className="modal-server__item-tooltip"><p>К какому провайдеру подключен данный сервер.</p></div></div>}
                name='provider'
                className="modal-server__form-item flex-25"
            >
                <Input disabled/>
            </Form.Item>
            <Form.Item
                label={<div><p>умная розетка</p><div className="modal-server__item-tooltip"><p>Если данный сервер подключен к умной розетке, то указываем к какой именно.</p></div></div>}
                name='smartSocket'
                className="modal-server__form-item flex-25"
            >
                <Input disabled/>
            </Form.Item>
            <Form.Item
                label={<div><p>управление</p><div className="modal-server__item-tooltip"><p>Название программы по которой можно подключится к серверу.</p></div></div>}
                name='control'
                className="modal-server__form-item flex-25"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>корпус</p><div className="modal-server__item-tooltip"><p>Какой корпус используется у сервера. Datacenter, Tower или другой.</p></div></div>}
                name='cases'
                className="modal-server__form-item flex-25"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={<div><p>справка</p><div className="modal-server__item-tooltip"><p>Поле для любой дополнительной информации.</p></div></div>}
                name='help'
                className="modal-server__form-item modal-server__form-item--textarea flex-50"
            >
                <TextArea style={{resize: 'none'}}/>
            </Form.Item>
            <Form.Item
                label={<div><p>Неисправность</p><div className="modal-server__item-tooltip"><p>Здесь можно указать какие неисправности имеются на данном сервере.</p></div></div>}
                name='error'
                className="modal-server__form-item modal-server__form-item--textarea flex-50"
            >
                <TextArea style={{resize: 'none'}}/>
            </Form.Item>
        </div>
    );
};

export default ModalServerInfoForm;