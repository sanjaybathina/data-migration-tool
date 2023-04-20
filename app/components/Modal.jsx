import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

function AddHost(props) {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const toggle = () => setModal(!modal);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/hosts', {
        name,
        host,
        port,
        username,
        password
    })
    .then(res => {
        toggle();
        props.getData();
    })
    .catch(err => {
        console.log(err);
    })
    }


  return (
    <div className='text-white'>
      <Button color="danger" onClick={toggle}>
        Add Host
      </Button>
      <Modal
        className='border border-white'
      isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control text-white"
                        onChange={(e) => setName(e.target.value)}
                    id="name" placeholder="Enter name" />
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="host">Host</label>
                    <input type="text" className="form-control text-white"
                        onChange={(e) => setHost(e.target.value)}
                    id="host" placeholder="Enter host" />
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="port">Port</label>
                    <input type="text" className="form-control text-white"
                        onChange={(e) => setPort(e.target.value)}
                    id="port" placeholder="Enter port" />
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control text-white"
                        onChange={(e) => setUsername(e.target.value)}
                    id="username" placeholder="Enter username" />
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="password">Password</label>
                    <input type="text" className="form-control text-white"
                        onChange={(e) => setPassword(e.target.value)}
                    id="password" placeholder="Enter password" />
                </div>
                <div className="mt-2">

                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={toggle}>Cancel</button>
                </div>
            </form>
        </ModalBody>
        
      </Modal>
    </div>
  );
}

export default AddHost;