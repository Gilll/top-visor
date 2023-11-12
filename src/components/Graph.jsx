import React, {useEffect, useState} from 'react';
import EmptyPage from "./EmptyPage";
import PageIsLoading from "./PageIsLoading";

const Graph = ({data, name, isLoading, group}) => {
    const [successMaxVal, setSuccessMaxVal] = useState(-1)
    const [errorsMaxVal, setErrorsMaxVal] = useState(-1)

    useEffect(() => {
        setSuccessMaxVal(findMaxVal(data.map(el => el.numberOfSuccess)))
        setErrorsMaxVal(findMaxVal(data.map(el => el.numberOfFail)))
    },[])

    const findMaxVal = (numArr) => {
        return Math.max.apply(null, numArr)
    }

    return (
        <>
            {isLoading ? <PageIsLoading/> : (data && data.length > 0) ? <div>
                <div className="modal-stat__title-box">
                    <p className="modal-stat__title">
                        <span className="gray">{group ? "Группа: " : "Сервер: "}</span><span>{name}</span>
                    </p>
                    <p className="modal-stat__sub-title">
                        <span>Профилей и ошибок </span>
                        <span className="gray">за {data.length} дней</span>
                    </p>
                </div>
                {successMaxVal >= 0 && errorsMaxVal >= 0 &&
                <div className="modal-stat__stat">
                    <div className="modal-stat__data-labels">
                        <span className="label-send">{Math.trunc(successMaxVal/9*9)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*8)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*7)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*6)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*5)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*4)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*3)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9*2)}</span>
                        <span className="label-send">{Math.trunc(successMaxVal/9)}</span>
                        <span>0</span>
                        <span className="label-fail">{Math.trunc(errorsMaxVal/3)}</span>
                        <span className="label-fail">{Math.trunc(errorsMaxVal/3*2)}</span>
                        <span className="label-fail">{errorsMaxVal}</span>
                    </div>
                    <div className="modal-stat__data-list">
                        {data.map((el, i) =>
                            <div className="modal-stat__data-item-box" key={i}>
                                <div className="modal-stat__data-item-date">{new Date(el.startDate).getDate().toString().padStart(2, "0") + '.' + (new Date(el.startDate).getMonth() + 1).toString().padStart(2, "0")}</div>
                                <div className="modal-stat__data-item">
                                    <div className="send" style={{"--percent": successMaxVal === 0 ? 0 : el.numberOfSuccess/successMaxVal}}><span>{el.numberOfSuccess}</span></div>
                                    <div className="fail" style={{"--percent": errorsMaxVal === 0 ? 0 : el.numberOfFail/errorsMaxVal}}><span>{el.numberOfFail}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                }
                </div> : <EmptyPage/>
            }
        </>
    );
};

export default Graph;