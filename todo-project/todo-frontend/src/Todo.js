import { useEffect, useState } from "react";

export default function Todo() {

   // ================= STATE MANAGEMENT =================

   // Input fields for adding new todo
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");

   // Store all todo items from API
   const [todos, setTodos] = useState([]);

   // Error & success messages
   const [error, setError] = useState("");
   const [successfully, setSuccessfully] = useState("");

   // Track which item is being edited
   const [editId, setEditId] = useState("");

   // Store edit input values
   const [editTitle, setEditTitle] = useState("");
   const [editDescription, setEditDescription] = useState("");

   // API Base URL
   const apiUrl = "http://localhost:8000";

   // ================= ADD TODO =================

   const handleSubmit = () => {
      setError("");

      // Validate input fields
      if (title.trim() !== '' && description.trim() !== '') {

         // Send POST request to backend
         fetch(apiUrl + "/todos", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description })
         })
         .then((res) => {
            if (res.ok) {

               // Add new item to UI instantly
               // setTodos([...todos, { title, description }]);
               getItems();
               // Clear input fields
               setTitle("");
               setDescription("");

               // Show success message
               setSuccessfully("Item added successfully");

               // Hide message after 3 seconds
               setTimeout(() => {
                  setSuccessfully("");
               }, 3000);

            } else {
               setError("Unable to create todo item");
            }
         })
         .catch(() => {
            setError("Server error while creating item");
         });
      } else {
         setError("Please enter title and description");
      }
   };

   // ================= GET TODOS =================

   useEffect(() => {
      getItems(); // Call API when component loads
   }, []);

   const getItems = () => {
      fetch(apiUrl + "/todos")
         .then((res) => res.json())
         .then((data) => {
            setTodos(data); // Store API data in state
         })
         .catch(() => {
            setError("Unable to fetch todos");
         });
   };

   // ================= UPDATE TODO =================

   const handleUpdate = () => {
      fetch(apiUrl + "/todos/" + editId, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            title: editTitle,
            description: editDescription
         })
      })
      .then((res) => {
         if (res.ok) {

            // Show success message
            setSuccessfully("Item updated successfully");

            // Exit edit mode
            setEditId("");

            // Refresh list from API
            getItems();

            // Hide message after 3 sec
            setTimeout(() => {
               setSuccessfully("");
            }, 3000);

         } else {
            setError("Unable to update item");
         }
      })
      .catch(() => {
         setError("Server error while updating item");
      });
   };

   // ================= DELETE TODO =================

   const handleDelete = (id) => {

      // Confirm before deleting
      if (window.confirm("Are you sure you want to delete?")) {

         fetch(apiUrl + "/todos/" + id, {
            method: "DELETE"
         })
         .then((res) => {
            if (res.ok) {

               // Show success message
               setSuccessfully("Item deleted successfully");

               // Refresh list
               getItems();

               // Hide message after 3 sec
               setTimeout(() => {
                  setSuccessfully("");
               }, 3000);

            } else {
               setError("Unable to delete item");
            }
         })
         .catch(() => {
            setError("Server error while deleting item");
         });
      }
   };

   // ================= CANCEL EDIT =================

   const handleEditCancel = () => {
      setEditId(""); // Exit edit mode
   };

   // ================= UI =================

   const handleEdit = (item) => {
      setEditId(item._id);
      setEditTitle(item.title);
      setEditDescription(item.description);
   }
 console.log("Y",todos);
   return (
      <>
         {/* HEADER */}
         <div className="row p-3 bg-success text-light">
            <h1>ToDo Project with MERN stack</h1>
         </div>

         {/* ADD TODO */}
         <div className="row">
            <h3 className="p-3">Add Item</h3>

            {/* Success message */}
            {successfully && <p className="text-success p-3">{successfully}</p>}

            <div className="form-group d-flex gap-2">
               
               {/* Title input */}
               <input
                  placeholder="Title..."
                  className="form-control"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />

               {/* Description input */}
               <input
                  placeholder="Description..."
                  className="form-control"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               />

               {/* Submit button */}
               <button
                  className="btn btn-dark"
                  onClick={handleSubmit}
               >
                  Submit
               </button>
            </div>

            {/* Error message */}
            {error && <p className="text-danger p-3">{error}</p>}
         </div>

         {/* TODO LIST */}
         <div className="row mt-3">
            <h3>Task</h3>
      
            <ul className="list-group">
               {todos.map((item) => (
                  <li
                     key={item._id}
                     className="list-group-item d-flex bg-info justify-content-between align-items-center my-2"
                  >

                     {/* LEFT SIDE (TEXT / EDIT MODE) */}
                     <div className="d-flex flex-column">

                        {editId !== item._id ? (
                           <>
                              <span className="fw-bold">{item.title}</span>
                              <span>{item.description}</span>
                           </>
                        ) : (
                           <>
                              <div className="d-flex gap-2">

                                 {/* Edit Title */}
                                 <input
                                    className="form-control"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                 />

                                 {/* Edit Description */}
                                 <input
                                    className="form-control"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                 />

                              </div>
                           </>
                        )}

                     </div>

                     {/* RIGHT SIDE BUTTONS */}
                     <div className="d-flex gap-2">

                        {editId === item._id ? (
                           <button
                              className="btn btn-warning"
                              onClick={handleUpdate}
                           >
                              Update
                           </button>
                        ) : (
                           <button
                              className="btn btn-warning"
                              onClick= {() => handleEdit(item)}
                              // onClick={() => {
                              //    setEditId(item._id);
                              //    setEditTitle(item.title);
                              //    setEditDescription(item.description);
                              // }}
                           >
                              Edit
                           </button>
                        )}

                        {editId === item._id ? (
                           <button
                              className="btn btn-danger"
                              onClick={handleEditCancel}
                           >
                              Cancel
                           </button>
                        ) : (
                           <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(item._id)}
                           >
                              Delete
                           </button>
                        )}

                     </div>

                  </li>
               ))}
            </ul>
         </div>
      </>
   );
}