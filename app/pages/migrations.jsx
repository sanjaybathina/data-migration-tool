import React, { useState, useEffect } from 'react'
import Modal from '@/components/MigrationsModal'
import axios from 'axios'


export default function Index() {

  const [data, setData] = useState([]);
  const [migrations, setMigrations] = useState([]);

  const getData = async () => {
    axios.get(`/api/hosts`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getMigrations = async () => {
    axios.get(`/api/migrations`)
      .then(res => {
        setMigrations(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    getData();
    getMigrations();
  }, []);

  return (
    <div className='container text-white mt-4'>
      <div className="d-flex justify-content-between align-items-center">
      <h1>Migrations</h1>
      <div className="col-auto d-inline-flex align-items-center">
        <Modal 
          getData={getMigrations}
          hosts={data}
        />
        {/* refresh */}
        <button className="btn btn-primary ms-2" onClick={getMigrations}>
          Refresh
        </button>
      </div>

      </div>
      <table className="table table-dark table-striped table-hover mt-4">
        <thead>
          <tr>
            <th scope="col fw-normal">ID</th>
            <th scope="col fw-normal">Source</th>
            <th scope="col fw-normal">Source Database</th>
            <th scope="col fw-normal">Destination</th>
            <th scope="col fw-normal">Destination Database</th>
            <th scope="col fw-normal">Status</th>
            <th scope="col fw-normal">Created At</th>
            <th scope="col fw-normal">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {migrations.map((migration, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{migration.sourceHostId}</td>
              <td>{migration.sourceDatabase}</td>
              <td>{migration.destinationHostId}</td>
              <td>{migration.destinationDatabase}</td>
              <td>{migration.status}</td>
              <td>{migration.createdAt}</td>
              <td>{migration.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}