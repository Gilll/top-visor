import React, {useState} from 'react';
import {useApi} from "../../hooks/useApi";
import {message} from "antd";

const SoftModal = ({closeModal, setNewVersion}) => {
    const [file, setFile] = useState()
    const [versionName, setVersionName] = useState('')
    const [showUploadStatus, setUploadStatus] = useState(false)
    const [progress, setProgress] = useState('')

    const uploadFunction = () => {
        const formData = new FormData();
        formData.append('file', file);
        setUploadStatus(true)

        const xhrRequest = new XMLHttpRequest();
        xhrRequest.open('POST', "https://profile-monitoring-dev.mayabiorobotics.ru/profile-monitoring-system/version?versionName=" + versionName);
        xhrRequest.responseType = 'json';
        xhrRequest.onload = function () {
            const obj = xhrRequest.response;
            setNewVersion(obj)
            message.success(`Файл ${obj.fileName} успешно загружен!`)
            closeModal()
        }
        xhrRequest.upload.onprogress = function(e) {
            setProgress((e.loaded / e.total * 100).toFixed(2))
        }
        xhrRequest.send(formData);
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    };

    return (
        <div>
            <div className="modal-upload__title-box"><p className="modal-upload__title">Загрузка файла:</p>
                <label className="modal-upload__name-box">
                    <input onChange={handleFileChange} type="file" id="inputFile"/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49"
                         fill="none">
                        <rect width="49" height="49" rx="17" fill="white"/>
                        <path
                            d="M29.3333 14.1667H20.6667C16.875 14.1667 15.25 16.3334 15.25 19.5834V30.4167C15.25 33.6667 16.875 35.8334 20.6667 35.8334H29.3333C33.125 35.8334 34.75 33.6667 34.75 30.4167V19.5834C34.75 16.3334 33.125 14.1667 29.3333 14.1667ZM23.4075 29.8425C23.7217 30.1567 23.7217 30.6767 23.4075 30.9909C23.245 31.1534 23.0392 31.2292 22.8333 31.2292C22.6275 31.2292 22.4217 31.1534 22.2592 30.9909L20.0925 28.8242C19.7783 28.51 19.7783 27.99 20.0925 27.6759L22.2592 25.5092C22.5733 25.195 23.0933 25.195 23.4075 25.5092C23.7217 25.8234 23.7217 26.3434 23.4075 26.6575L21.815 28.25L23.4075 29.8425ZM29.9075 28.8242L27.7408 30.9909C27.5783 31.1534 27.3725 31.2292 27.1667 31.2292C26.9608 31.2292 26.755 31.1534 26.5925 30.9909C26.2783 30.6767 26.2783 30.1567 26.5925 29.8425L28.185 28.25L26.5925 26.6575C26.2783 26.3434 26.2783 25.8234 26.5925 25.5092C26.9067 25.195 27.4267 25.195 27.7408 25.5092L29.9075 27.6759C30.2217 27.99 30.2217 28.51 29.9075 28.8242ZM32.0417 22.0209H29.875C28.2283 22.0209 26.8958 20.6884 26.8958 19.0417V16.875C26.8958 16.4309 27.2642 16.0625 27.7083 16.0625C28.1525 16.0625 28.5208 16.4309 28.5208 16.875V19.0417C28.5208 19.7892 29.1275 20.3959 29.875 20.3959H32.0417C32.4858 20.3959 32.8542 20.7642 32.8542 21.2084C32.8542 21.6525 32.4858 22.0209 32.0417 22.0209Z"
                            fill="#5BC2FF"/>
                    </svg>
                    <span>{file ? file.name : 'Выберите файл'}</span></label></div>
            <div className="modal-upload__info-box" style={showUploadStatus ? {"display": "block"} : {"display": "none"}}>
                <div className="modal-upload__info-text"><span
                    className="modal-upload__info-text-percent">{progress}%</span> <span
                    className="modal-upload__info-text-ready" style={{"display": "none"}}>Загрузка завершена</span>
                </div>
                <div className="modal-upload__info-line" style={progress ? {'--percent': progress + "%"} : {"--percent": "0%"}}/>
            </div>
            <div className="modal-upload__label-box">
                <div className="modal-upload__label-title-box"><p className="modal-upload__label-title">Название
                    версии*</p></div>
                <label className="modal-upload__label">
                    <input id="inputVersionName" value={versionName} onChange={(e) => setVersionName(e.target.value)}/>
                </label></div>
            <div className="modal-upload__buttons">
                <button onClick={uploadFunction} type="submit" className={ versionName.trim() ? "modal-upload__submit" : "modal-upload__submit disable" } id="btnFileUpload"><span
                    className="icon"><svg className="ok" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                          xmlns="http://www.w3.org/2000/svg"><path
                    d="M17.9167 4.99994L8.75 14.1758L6 11.4258" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/></svg> <svg className="no" width="28"
                                                                              height="28"
                                                                              viewBox="0 0 28 28"
                                                                              fill="none"
                                                                              xmlns="http://www.w3.org/2000/svg"><path
                    d="M9.74805 9.98572L17.7761 18.0138" stroke="white" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"/><path d="M9.75 18.0131L17.7781 9.98497" stroke="white"
                                                  strokeWidth="2" strokeLinecap="round"
                                                  strokeLinejoin="round"/></svg> </span><span
                    className="submit-text">Сохранить</span>
                </button>
                <button onClick={closeModal} type="button" className="modal-upload__cancel-btn close"><span>Отменить</span></button>
            </div>
        </div>
    );
};

export default SoftModal;