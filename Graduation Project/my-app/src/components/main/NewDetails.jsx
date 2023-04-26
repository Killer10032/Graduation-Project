import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
const NewDetails = () => {
    const { id } = useParams()
    const [detail, setDetail] = useState({})
    const { newsList } = useSelector(state => state.news)
    useEffect(() => {
        if (id) {
            const curNews = newsList.filter(item => item.id === ~~id)
            setDetail(curNews[0])
        }
    }, [id, newsList])
    return (
        <div className='detail-container'>
            <div className='detail-header'>
                <h1>{detail.title}</h1>
                <span>{detail.anthor}</span><span>{detail.date}</span>
            </div>
            <div className='detail-information'>
                <img src={detail.imgSrc} alt="" />
                <p>{detail.describe}</p>
            </div>
        </div>
    );
}

export default NewDetails;
