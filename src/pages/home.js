import React, {useEffect, useState} from "react";


export function Home() {
    const [content, setCountent] = useState(<BooksList showForm={showForm} />);

    function showList() {
        setCountent(<BooksList showForm={showForm} />);
    }

    function showForm(book) {
        setCountent(<BooksForm book={book} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    )
}


function BooksList(props) {
    const [books, setBooks] = useState([]);

    function fetchBooks() {
        fetch("http://localhost:3004/books")
        .then((response) => {
           if(!response.ok) {
                throw new Error("Unexpected Server Response");
           } 
           return response.json()
        })
        .then((data) => { 
            //console.log(data);
            setBooks(data);
        })
        .catch((error) => console.log("Error: ", error));
    }

    //fetchUsers();
    useEffect(() => fetchBooks(), []);

    function deleteBooks(id) {
        fetch("http://localhost:3004/books/" + id, {
            method: "DELETE"
        })
            .then((response) => response.json())
            .then((data) => fetchBooks());
    }

    return (
        <>
        <h2 className="text-center mb-3">List of Books</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
        <button onClick={() => fetchBooks()} type="button" className="btn btn-outline-primary me-2">Refresh</button>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>ISBN</th>
                </tr>
            </thead>
            <tbody>
                {
                    books.map((book, index) => {
                        return (
                            <tr key={index}>
                                <td>{book.id}</td>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                    <button onClick={() => props.showForm(book)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button onClick={() => deleteBooks(book.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
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

function BooksForm(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        // read form data
        const formData = new FormData(event.target);

        // convert formData to object
        const book = Object.fromEntries(formData.entries());

        // form validation
        if (!book.name || !book.author || !book.isbn ) {
            console.log("Please provide all the required fields!");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please provide all the required fields!
                </div>
            )
            return;
        }

        if (props.book.id){
            // update the user
            fetch("http://localhost:3004/books/" + props.book.id, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book)
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
        
            book.CreatedAt = new Date().toISOString().slice(0, 10);
            fetch("http://localhost:3004/books", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book)
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
        <h2 className="text-center mb-3">{props.book.id ? "Edit" : "Add New Book"}</h2>

        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

                <form onSubmit={(event) => handleSubmit(event)}>
                    {props.book.id && <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">ID</label>
                        <div className="col-sm-8">
                            <input readOnly className="form-control-plaintext"
                                name="id"
                                defaultValue={props.book.id} />   
                        </div>    
                    </div>}
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Name</label>
                        <div className="col-sm-8">
                            <input className="form-control"
                                name="name"
                                defaultValue={props.book.name} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Author</label>
                        <div className="col-sm-8">
                            <input className="form-control"
                                name="author"
                                defaultValue={props.book.author} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">ISBN</label>
                        <div className="col-sm-8">
                            <input className="form-control"
                                name="isbn"
                                defaultValue={props.book.isbn} />
                        </div>
                    </div>
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