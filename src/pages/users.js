import React, {useEffect, useState} from "react";


export function Users() {
    const [content, setCountent] = useState(<UsersList showForm={showForm} />);

    function showList() {
        setCountent(<UsersList showForm={showForm} />);
    }

    function showForm(user) {
        setCountent(<UsersForm user={user} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    )
}


function UsersList(props) {
    const [users, setUsers] = useState([]);

    function fetchUsers() {
        fetch("http://localhost:3004/users")
        .then((response) => {
           if(!response.ok) {
                throw new Error("Unexpected Server Response");
           } 
           return response.json()
        })
        .then((data) => { 
            //console.log(data);
            setUsers(data);
        })
        .catch((error) => console.log("Error: ", error));
    }

    //fetchUsers();
    useEffect(() => fetchUsers(), []);

    function deleteUsers(id) {
        fetch("http://localhost:3004/users/" + id, {
            method: "DELETE"
        })
            .then((response) => response.json())
            .then((data) => fetchUsers());
    }

    return (
        <>
        <h2 className="text-center mb-3">List of Users</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
        <button onClick={() => fetchUsers()} type="button" className="btn btn-outline-primary me-2">Refresh</button>
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Id</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user, index) => {
                        return (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.id}</td>
                                <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                    <button onClick={() => props.showForm(user)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button onClick={() => deleteUsers(user.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </>
    )
}

function UsersForm(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        // read form data
        const formData = new FormData(event.target);

        // convert formData to object
        const user = Object.fromEntries(formData.entries());

        // form vlaidation
        if (!user.name || !user.email ) {
            console.log("Please provide all the required fields!");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please provide all the required fields!
                </div>
            )
            return;
        }

        if (props.user.id){
            // update the user
            fetch("http://localhost:3004/users/" + props.user.id, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
            return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.log("Error:", error);
            });
        }
        else {
            // create a new user
            user.CreatedAt = new Date().toISOString().slice(0, 10);
            fetch("http://localhost:3004/users", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
            return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.log("Error:", error);
            });
        }
    }
    return (
        <>
        <h2 className="text-center mb-3">{props.user.id ? "Edit User" : "Create New User"}</h2>

        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Name</label>
                        <div className="col-sm-8">
                            <input className="form-control"
                                name="name"
                                defaultValue={props.user.name} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Email</label>
                        <div className="col-sm-8">
                            <input className="form-control"
                                name="email"
                                defaultValue={props.user.email} />
                        </div>
                    </div>
                    {props.user.id && <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">ID</label>
                        <div className="col-sm-8">
                            <input readOnly className="form-control-plaintext"
                                name="id"
                                defaultValue={props.user.id} />
                        </div>
                    </div>}
                    <div className="row">
                        <div className="offset-sm-4 col-sm-4 d-grid">
                            <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                        </div>
                        <div className="col-sm-4 d-grid">
                            <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}