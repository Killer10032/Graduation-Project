import React, { useState, useEffect } from 'react';
import Figure from 'react-bootstrap/Figure';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { getNewsListAsync } from '../../redux/newsSlice';

const News = () => {
    const [searchItem, setSearchItem] = useState("")
    const [searchList, setSearchList] = useState([])
    const { newsList } = useSelector(state => state.news)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!newsList.length) {
            dispatch(getNewsListAsync())
        }
        // getNewsApi().then(({ data }) => {
        //     setNews(data)
        // })
    }, [newsList, dispatch])

    function handlerChange(name) {
        setSearchItem(name)
        const arr = newsList.filter((item) => {
            return item.title.match(name)
        })
        setSearchList(arr)
    }

    const isRender = searchItem ? searchList : newsList

    const list = isRender.map(item => (
        <div className='figure-news' key={item.id}>
            <Figure.Image
                className='figure-news-image'
                alt="171x180"
                src={item.imgSrc}
            />
            <div className='figure-news-describe'>
                <NavLink to={`/newDetails/${item.id}`}>{item.title}</NavLink>
                <p>{item.describe}</p>
            </div>
        </div>

    ))

    return (
        <div>
            <input className='form-control news-form-search' placeholder='search' type="text" value={searchItem} onChange={(e) => handlerChange(e.target.value)} />
            <Figure>
                {list}
            </Figure>
        </div>

    );
}

export default News;
