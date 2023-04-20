import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

function AddMigration(props) {
  const [modal, setModal] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [sourceHost, setSourceHost] = useState("");
  const [sourceDatabase, setSourceDatabase] = useState("test");
  const [destinationDatabase, setDestinationDatabase] = useState("test1");
  const [destinationHost, setDestinationHost] = useState("");

  const toggle = () => setModal(!modal);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/migrations", {
        sourceHostId: sourceHost,
        destinationHostId: destinationHost,
        sourceDatabase,
        destinationDatabase,
      })
      .then((res) => {
        console.log(res);
        toggle();
        props.getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHosts = () => {
    axios
      .get("/api/hosts")
      .then((res) => {
        setHosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getHosts();
  }, []);

  return (
    <div className="d-inline-flex text-white">
      <Button color="danger" onClick={toggle}>
        Add Migration
      </Button>
      <Modal className="border border-white" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Migration</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {/* select */}
            <div className="mb-3">
              <label htmlFor="sourceHost" className="form-label">
                Source Host
              </label>
              <select
                className="form-select"
                id="sourceHost"
                onChange={(e) => setSourceHost(e.target.value)}
              >
                <option value="">Select Source Host</option>
                {hosts.map((host) => (
                  <option key={host.id} value={host._id}>
                    {host.name}
                  </option>
                ))}
              </select>
            </div>

            {/* database */}
            <div className="mb-3">
              <label htmlFor="sourceDatabase" className="form-label">
                Source Database
              </label>
              <input
                type="text"
                className="form-control"
                id="sourceDatabase"
                defaultValue={`test`}
                onChange={(e) => setSourceDatabase(e.target.value)}
              />
            </div>
            

            {/* select */}
            <div className="mb-3">
              <label htmlFor="destinationHost" className="form-label">
                Destination Host
              </label>
              <select
                className="form-select"
                id="destinationHost"
                onChange={(e) => setDestinationHost(e.target.value)}
              >
                <option value="">Select Destination Host</option>
                {hosts.map((host) => (
                  <option key={host.id} value={host._id}>
                    {host.name}
                  </option>
                ))}
              </select>
            </div>

            {/* database */}
            <div className="mb-3">
              <label htmlFor="destinationDatabase" className="form-label">
                Destination Database
              </label>
              <input
                type="text"
                className="form-control"
                id="destinationDatabase"
                defaultValue={`test2`}
                onChange={(e) => setDestinationDatabase(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={toggle}
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddMigration;
