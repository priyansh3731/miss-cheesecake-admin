import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import "../css/orders.css";
import { onValue, ref, remove } from "firebase/database";
import { database } from "../config";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedValue, setSelectedValue] = useState('ALL');
    const array = ["ALL", "UNFULFILLED", "UNPAID"]
    const navigate = useNavigate();

    useEffect(() => {
        const ordersRef = ref(database, 'products');
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


    const changeHandler = (value) => {
        if (value === "") {
            setOrders(data);
        } else {
            setOrders(data.filter(({id, title,body_html,variants,product_type,vendor}) =>  id.toLowerCase().includes(value.toLowerCase()) || title.toLowerCase().includes(value.toLowerCase()) || String(variants[0].price).toLowerCase().includes(value.toLowerCase()) || product_type.toLowerCase().includes(value.toLowerCase())|| vendor.toLowerCase().includes(value.toLowerCase()) || body_html.toLowerCase().includes(value.toLowerCase())));
        }
        // Reset to the first page when filtering
        setCurrentPage(1);
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
                <div className="page-heading"><h2>Products</h2><button className="item-button" onClick={()=>navigate("/add-product")}>Add Product</button></div>

                
                <div className="order-list-container">

                    <input className="search-input" placeholder="Search" onChange={(e) => changeHandler(e.target.value)} />

                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Title</th>
                                <th>inventory</th>
                                <th>price</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Vendor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(({ id, title,images,variants,product_type,vendor}) => {
                                if (images && images[0] && images[0].src) {
                                return (<tr key={id} onClick={()=>navigate(`${id}`)}>
                                    <td><img src={images[0].src} width={50} /></td>
                                    <td>{title}</td>
                                    <td>{variants[0].inventory_quantity}</td>
                                    <td>{variants[0].price}</td>
                                    <td>{product_type}</td>
                                    <td>{product_type}</td>
                                    <td>{product_type}</td>
                                </tr>)}
                            })}
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

export default Products;
