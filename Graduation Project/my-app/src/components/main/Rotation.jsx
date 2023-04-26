import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector, useDispatch } from "react-redux"
import { getHeadlineNewsListAsync } from '../../redux/newsSlice';

function UncontrolledExample() {
    const { headlineNewsList } = useSelector(state => state.news)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!headlineNewsList.length) {
            dispatch(getHeadlineNewsListAsync())
        }
        // getHeadlineNewApi().then(({ data }) => {
        //     setCarousel(data)
        // })
    }, [headlineNewsList, dispatch])
    const imgS = headlineNewsList.map(item => (
        <Carousel.Item key={item.id}>
            <img className='d-block w-100' src={item.headImgSrc} alt="img" />
            <div>
                <h3>{item.title}</h3>
                <p>{item.describe}</p>
            </div>
        </Carousel.Item>
    ))

    return (
        <div>
            <Carousel>
                {imgS}
            </Carousel>
        </div>
    );
}

export default UncontrolledExample;