import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { addNewsListAsync } from '../../redux/newsSlice';

const AddNews = () => {
    const [addNew, setAddNew] = useState({
        imgSrc: "",
        title: "",
        describe: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function updateAddNewInfo(info, key) {
        const arr = { ...addNew }
        arr[key] = info
        setAddNew(arr)
    }
    function submitNewInfo(e) {
        e.preventDefault()
        for (const key in addNew) {
            if (!addNew[key]) {
                alert("Please write")
                return
            }
        }
        dispatch(addNewsListAsync(addNew))
        navigate("/news")

    }
    return (
        <div className="container">
            <h1 className="page-header">Form</h1>
            <form id="myForm" onSubmit={submitNewInfo}>
                <div className="well">
                    <div className="form-group">
                        <label>imgSrc</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="imgSrc"
                            value={addNew.imgSrc}
                            onChange={(e) => updateAddNewInfo(e.target.value, 'imgSrc')}
                        />
                    </div>
                    <div className="form-group">
                        <label>title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="title"
                            value={addNew.title}
                            onChange={(e) => updateAddNewInfo(e.target.value, 'title')}
                        />
                    </div>
                    <div className="form-group">
                        <label>describe</label>
                        <textarea
                            type="text"
                            rows="10"
                            className="form-control"
                            placeholder="describe"
                            value={addNew.describe}
                            onChange={(e) => updateAddNewInfo(e.target.value, 'describe')}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddNews;
