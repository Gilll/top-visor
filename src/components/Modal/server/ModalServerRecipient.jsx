import React, {useEffect, useRef, useState} from 'react';
import ModalServerRecipientItem from "./ModalServerRecipientItem";
import {useApi} from "../../../hooks/useApi";

const ModalServerRecipient = ({thread, serversControl, alertControl}) => {
    const [recipients, setRecipients] = useState(thread?.servers ?? []);
    const id = useRef(0);

    const addItem = () => {
        setRecipients([...recipients, {id: id.current}]);
        id.current++;
    }

    const [serverUpdate, serverUpIsLoading] = useApi({
        method: 'POST',
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 1,
            numberPage: 0,
            serverIds: [thread?.server?.id || 0],
        },
    });

    useEffect(() => {
        serverUpdate().then((resp) => {
            serversControl.set(serversControl.get.map((item) => {
                if (item.id === resp.result[0].id) {
                    return resp.result[0];
                }

                return item;
            }));
        });
    }, [recipients]);

    return (
        <>
            <div className="modal-server__form-title">
                <p>Принимающие серверы</p>
                <span className="error-text">Чтобы добавить сервер, заполните и сохраните настройки</span>
            </div>
            <div className="modal-server__form recipients">
                <button className="modal-server__thread-add-btn" onClick={addItem}>
                    <span className="icon"/>
                    <span>Еще один сервер</span>
                </button>
                <div className="modal-server__recipient-header">
                    <div className="modal-server__form-item flex-25">
                        <div className="modal-server__item-title-box">
                            <p>выберите сервер</p>
                            <div className="modal-server__item-tooltip">
                                <p>Сервер, на который будут производится отправки профилей.</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-server__form-item flex-75">
                        <div className="modal-server__item-title-box">
                            <p>директория куда</p>
                            <div className="modal-server__item-tooltip">
                                <p>Директория в которую будут отправляться профиля.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {recipients.map((el, i) => <ModalServerRecipientItem serversControl={serversControl}
                                                                     alertControl={alertControl}
                                                                     deleteItem={() => setRecipients(recipients.filter((item, i) => item.id !== el.id))}
                                                                     addItem={(id, item) => setRecipients(recipients.map((el) => {
                                                                         if (el.id === id) return item;
                                                                         return el;
                                                                     }))}
                                                                     key={el.id}
                                                                     index={i + 1}
                                                                     recipient={el}
                                                                     settingId={thread.id}
                />)}
            </div>
        </>
    );
};

export default ModalServerRecipient;