import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import axios from 'axios'


export default function Index() {

  const [data, setData] = useState([]);

  const getData = async () => {
    axios.get(`/api/hosts`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='container text-white mt-4'>
      <div className="d-flex justify-content-between align-items-center">
      <h1>Hosts</h1>
      <div className="col-auto">
        <Modal 
          getData={getData}
        />
      </div>

      </div>
      <div className="row m-0">
        {data.map((host, index) => (
          <div className="col-12 col-md-6 col-lg-4 p-0" key={index}>
            <div className="card bg-dark border-white text-white m-2">
              <div className="card-body">
                <h4 className="card-title mb-2">{host.name}</h4>
                <p className="card-subtitle mb-2 fs-6 mb-0">Host: {host.host}</p>
                <p className="card-subtitle mb-2 fs-6 mb-0">Port: {host.port}</p>
                <p className="card-subtitle mb-2 fs-6 mb-0">Username: {host.username}</p>
                <p className="card-text">{host.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}