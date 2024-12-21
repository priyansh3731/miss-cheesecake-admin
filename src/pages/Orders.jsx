import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import "../css/orders.css";
import { onValue, ref, remove } from "firebase/database";
import { database } from "../config";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedValue, setSelectedValue] = useState('ALL');
    const array = ["ALL", "UNFULFILLED", "UNPAID"]
    const navigate = useNavigate();
    const [to,setTo] = useState(null)
    const [from ,setFrom] = useState(null)

    useEffect(() => {
        const ordersRef = ref(database, 'orders');
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const ordersArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort orders by date in descending order
                const sortedOrders = ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
                setData(sortedOrders);
            }
        });
    }, []); // This effect runs once on component mount

    const handleChange = (event) => {
        const res = event.target.value;
        setSelectedValue(res);
        if(res === "ALL"){
            const temp = data
            setOrders(temp)
            console.log(orders)
        }else if(res === "UNFULFILLED"){
            setOrders(data.filter(({trackingid})=> trackingid===""))
        }else{
            setOrders(data.filter(({ordermethod})=>ordermethod==="cod"))
        }
    };


    const changeHandler = (value) => {
        if (value === "") {
            setOrders(data);
        } else {
            setOrders(data.filter(({ id, ordermethod, date, price,trackingid }) => (new Date(date).toLocaleString()).toLowerCase().includes(value.toLowerCase()) || id.toLowerCase().includes(value.toLowerCase()) || ordermethod.toLowerCase().includes(value.toLowerCase()) || String(price).toLowerCase().includes(value.toLowerCase())));
        }
        // Reset to the first page when filtering
        setCurrentPage(1);
    };

    // Function to get total number of items in an order
    const getTotalItems = (products) => {
        if (!products || !Array.isArray(products)) {
            return 0;
        }
        return products.reduce((total, product) => total + (product.qtn || 0), 0);
    };

    // Get the current items for the page
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const handlePageChange = (direction) => {
        if (direction === "next" && indexOfLastOrder < orders.length) {
            setCurrentPage(prevPage => prevPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <>
            <Navbar />
            <div className="orders-container">
                <h2>Orders</h2>

                {/* <div className="order-overview-container">
                    <input type="date"  className="date-input" />
                    <input type="date" className="date-input" />
                    <p>price</p>
                </div> */}

                <div className="order-list-container">

                <div className="radio-inputs">
                    {
                        array.map((name)=>{
                            return<label className="radio" key={name}>
                            <input
                                type="radio"
                                name="radio"
                                value={name}
                                checked={selectedValue === name}
                                onChange={handleChange}
                            />
                            <span className="name">{name}</span>
                        </label>
                        })
                    }
                </div>


                    <input className="search-input" placeholder="Search" onChange={(e) => changeHandler(e.target.value)} />

                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Delivery Method</th>
                                <th>Fulfillment Status</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(({ id, ordermethod, date, price, products, trackingid }) => (
                                <tr key={id} onClick={()=>navigate(`${id}`)}>
                                    <td>{id}</td>
                                    <td>{new Date(date).toLocaleString()}</td>
                                    <td>{price}</td>
                                    <td>{ordermethod}</td>
                                    <td>{trackingid ? "Fulfilled" : "Unfulfilled"}</td>
                                    <td>{getTotalItems(products)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button
                            onClick={() => handlePageChange("prev")}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            onClick={() => handlePageChange("next")}
                            disabled={indexOfLastOrder >= orders.length}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;
