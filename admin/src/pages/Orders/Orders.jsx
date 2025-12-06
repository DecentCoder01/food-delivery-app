import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from "react-toastify"
import { assets } from "../../assets/assets"

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // newest first

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.log(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Error updating status");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Filtered and searched orders
  const displayedOrders = orders
    .filter(order => {
      // Status filter
      if (filterStatus && order.status !== filterStatus) return false;
      // Search filter (by customer name or item name)
      const nameMatch = (order.address.firstName + " " + order.address.lastName)
        .toLowerCase().includes(searchText.toLowerCase());
      const itemMatch = order.items.some(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      return nameMatch || itemMatch;
    })
    .sort((a, b) => {
      // Date-wise sorting
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Totals
  const totalOrders = orders.length;
  const totalProcessing = orders.filter(o => o.status === "Food Processing").length;
  const totalOut = orders.filter(o => o.status === "Out for Delivery").length;
  const totalDelivered = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className='order add'>
      <h3>Order Page</h3>

      {/* Summary */}
      <div className="order-summary">
        <p>Total Orders: {totalOrders}</p>
        <p>Processing: {totalProcessing}</p>
        <p>Out for Delivery: {totalOut}</p>
        <p>Delivered: {totalDelivered}</p>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by name or item"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Food Processing">Food Processing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="order-list">
        {displayedOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx !== order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>

              <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>

            <p>Item: {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
