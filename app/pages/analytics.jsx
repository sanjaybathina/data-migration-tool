import React, { useState, useEffect } from "react";
import Modal from "@/components/MigrationsModal";
import axios from "axios";

export default function Index() {
  const [data, setData] = useState([]);
  const [migrations, setMigrations] = useState([]);

  const getData = async () => {
    axios
      .get(`/api/hosts`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMigrations = async () => {
    axios
      .get(`/api/migrations`)
      .then((res) => {
        setMigrations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    getMigrations();
  }, []);

  return (
    <div className="container text-white mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Analytics</h1>
        <div className="col-auto d-inline-flex align-items-center"></div>
      </div>
      {/* loop all rows and get low mean high response times by createdAt updatedAt */}
      <div className="row">
        <div className="col-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title">Total Hosts</h5>
              <h1 className="card-text">{data.length}</h1>
            </div>
          </div>
        </div>

        {/* low */}
        <div className="col-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title">Low Response Time</h5>
              <h1 className="card-text">
                {(new Date(
                  migrations?.sort(
                    (a, b) => a.createdAt - b.createdAt
                  )[0]?.createdAt
                ).getTime() -
                  new Date(
                    migrations?.sort(
                      (a, b) => a.createdAt - b.createdAt
                    )[0]?.updatedAt
                  ).getTime()) *
                  -1}{" "}
                ms
              </h1>
            </div>
          </div>
        </div>

        {/* mean */}
        <div className="col-4">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title">Mean Response Time</h5>
              <h1 className="card-text">
                {(new Date(
                  migrations?.sort(
                    (a, b) => a.createdAt - b.createdAt
                  )[1]?.createdAt
                ).getTime() -
                  new Date(
                    migrations?.sort(
                      (a, b) => a.createdAt - b.createdAt
                    )[1]?.updatedAt
                  ).getTime()) *
                  -1}{" "}
                ms
              </h1>
            </div>
          </div>
        </div>

        {/* high */}
        <div className="col-4 mt-3">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title">High Response Time</h5>
              <h1 className="card-text">
                {(new Date(
                  migrations?.sort((a, b) => a.createdAt - b.createdAt)[
                    migrations.length - 1
                  ]?.createdAt
                ).getTime() -
                  new Date(
                    migrations?.sort((a, b) => a.createdAt - b.createdAt)[
                      migrations.length - 1
                    ]?.updatedAt
                  ).getTime()) *
                  -1}{" "}
                ms
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
