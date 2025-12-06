import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {

  const [list,setList] = useState([]);

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("none");

  // Editing states
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: "",
    image: null
  });

  const fetchList = async () =>{
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data)
    }
    else{
      toast.error("error");
    }
  }

  const removeFood = async(foodId)=>{
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }else{
      toast.error("Error");
    }
  }

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", editData.name);
      formData.append("price", editData.price);
      formData.append("category", editData.category);

      if (editData.image) {
        formData.append("image", editData.image);
      }

      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("Updated!");
        setEditId(null);
        fetchList();
      } else {
        toast.error("Error updating");
      }

    } catch (err) {
      toast.error("Error");
    }
  };

  useEffect(()=>{
    fetchList();
  },[])

  const filteredList = list
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "low-high") return a.price - b.price;
      if (sortType === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className='list add flex-col'>

      {/* TOP BAR */}
      <div className="top-controls" style={{ 
        width: "100%", display: "flex", gap: "10px", marginBottom: "15px" 
      }}>
        
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Total Items: {filteredList.length}
        </span>

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="none">Sort</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

      </div>

      {/* HEADER */}
      <p>All foods list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
      </div>

      {filteredList.map((item,index)=>{

        // EDIT MODE
        if (editId === item._id) {
          return (
            <div key={index} className="list-table-format">

              {/* IMAGE EDIT */}
              <label htmlFor="editImage" style={{ cursor: "pointer" }}>
                <img
                  src={
                    editData.image
                      ? URL.createObjectURL(editData.image)
                      : `${url}/images/${item.image}`
                  }
                  alt=""
                />
              </label>
              <input
                id="editImage"
                type="file"
                hidden
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.files[0] })
                }
              />

              {/* TEXT FIELDS */}
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />

              <input
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              />

              <input
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              />

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>

            </div>
          );
        }

        // NORMAL MODE
        return(
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <p
                className='cursor'
                onClick={() => {
                  setEditId(item._id);
                  setEditData({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    image: null
                  });
                }}
              >
                ✏️
              </p>

              <p
                onClick={()=>removeFood(item._id)}
                className='cursor'
              >
                ❌
              </p>
            </div>

          </div>
        )
      })}
      
    </div>
  )
}

export default List
