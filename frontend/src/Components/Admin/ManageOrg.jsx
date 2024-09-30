import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrg = () => {
    const [users, setUsers] = useState(['']);
    const [showPopup, setShowPopup] = useState(false);
    const [removeId, setRemoveId] = useState(null);

    useEffect(() => {
        const getOrgDetails = async () => {
            try {
                const res = await axios.get("http://localhost:8081/adminauth/orgDetails");
                setUsers(res.data.orgDetails);
            } catch (err) {
                console.log(err);
            }
        };
        getOrgDetails();
    }, []);

    const handleRemove = (id) => {
        setRemoveId(id);
        setShowPopup(true);
    };

    const confirmRemove = () => {
        // Call API to remove user with id = removeId
        axios.delete(`http://localhost:8081/adminauth/removeOrg/${removeId}`)
            .then(response => {
                setUsers(users.filter(user => user.id !== removeId));
                setShowPopup(false);
            })
            .catch(error => {
                console.log(error);
                setShowPopup(false);
            });
    };

    const cancelRemove = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className="users-management1">
                <h2 id='hhh'>Org Management</h2>
                <table className="users-tabl">
                    <thead>
                        <tr>
                            <th>Organisation name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.orgname}</td>
                                <td>{user.org_email}</td>
                                <td>{user.phno}</td>
                                <td>
                                <button id='view' className='view-bt' onClick={() => handleViewUser(user.id)}>View</button>
                                    <button
                                        onClick={() => handleRemove(user.id)}
                                        id="remove"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showPopup && (
                <div className="orgpopup">
                    <p>Are you sure you want to remove this organisation?</p>
                    <button onClick={confirmRemove}>Yes</button>
                    <button onClick={cancelRemove}>No</button>
                </div>
            )}
        </>
    )
}

export default ManageOrg