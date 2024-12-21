import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database, onValue, ref } from "../config";
import "../css/orderpagecontainer.css"
import edit from "../assets/edit.png"
import Popup from "reactjs-popup";
import back from "../assets/back.png"
import { set } from "firebase/database";

const OrderPage=()=>{

    const {id} = useParams()
    const [order, setOrder] = useState([])
    const [productData,setProductData] = useState([])
    const [price,setPrice] =useState(0)
    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [selectedcountry, setSelectedCountry] = useState('');
    const [selectState, setSelectedState] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [address, setaddress] = useState("");
    const [apt, setapt] = useState("");
    const [contact, setContact] = useState('');
    const [pincode, setPincode] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const navigate = useNavigate();



    const onchangeHandler = (selectedcountry="India"
    ) => {
        if (selectedcountry !== "") {
            setSelectedCountry(selectedcountry);
            const res = country.filter(({ name }) => name === selectedcountry);
            setStates(res[0].states);
        }
    };

    const onchangeHandler2 = (selectedstate) => {
        if (selectedstate !== "") {
            setSelectedState(selectedstate);
            const res = states.filter(({ name }) => name === selectedstate);
            setCity(res[0].cities);
        }
    };


    const clickHandler=async()=>{
        const data = {...order,firstname: firstname,lastname: lastname,address: address, apartment: apt, city: selectedCity, state: selectState, country: selectedcountry, pincode: pincode, phonenumber: contact,trackingid: trackingId}

        await set(ref(database, `orders/${id}`), data);
    }


    useEffect(() => {
        const productRef = ref(database, `orders/${id}`);
        onValue(productRef, (snapshot) => {
        const productData = snapshot.val();
        if (productData) {
            setOrder(productData);
            setProductData(productData.products)
            const products = productData.products
            console.log(productData)
            const sumofarray = products.map(({ variants, qtn }) => parseInt(variants[0].price) * qtn);
            const sum = sumofarray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            setPrice(sum);

            const productsRef = ref(database, 'country');
            onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            setCountry(data);

            setFirstName(productData.firstname)
            setLastName(productData.lastname)
            setaddress(productData.address)
            setContact(productData.phonenumber)
            setPincode(productData.pincode)
            setSelectedCity(productData.city)
            setSelectedState(productData.state)
            setSelectedCountry(productData.country)
            setTrackingId(productData.trackingid)
        });
        } else {
            console.log(`Product with ID ${id} not found`);
        }
        });
    }, []);

    return <>
        <div className="order-page-container">
            <div className="order-page-header">
                <div className="id-name-container">
                    <img src={back} width={20} onClick={()=>navigate("/orders")} ></img>
                    <h2>{id}</h2>
                    <span className="ordermethod">{order.ordermethod === "cod" ? "Payment pending" : "Paid"}</span>
                    <span className="tracking">{order.trackingid==="" ? "Unfulfilled" : "Fulfilled"}</span>
                </div>
                <p className="date">{new Date(order.date).toLocaleString()}</p>
            </div>

            <div className="products-lists-container">
                <div className="products-lists-header">
                    <h4>Delivery Method</h4>
                    <p>Standard</p>
                </div>

                {productData.map(({ images, title, variants, qtn }, index) => (
                    <div className="product-price-container" key={index}>
                        <img width={50} src={images[0].src} alt={title} />
                        <h4>{title}</h4>
                        <h4>* {qtn}</h4>
                        <h4>₹{variants[0].price}</h4>
                    </div>
                ))}

                        <Popup 
                            trigger={<button className="item-button">Fulfill item</button>} 
                            modal 
                            className="centered-popup"
                        >
                            {
                                close => (
                                    <div className="shadow-given">
                                        <div className="popup-header"><h4>Fullfill Items</h4></div>
                            <div className="content">
                            <h4>Tracking Id</h4>
                            <form className="address-form">
                                    <input className="tracking-input" value={trackingId} placeholder="Traking Id" type="text" onChange={(e) => setTrackingId(e.target.value)} />

                                <div className="button-container">
                                    <button className="item-button" onClick={close}>Cancel</button>
                                    <button onClick={clickHandler} className="item-button">Make As Valid</button>
                                </div>
                            </form>
                            </div>
                                    </div>
                                )
                            }
                        </Popup>
            </div>


            <div className="payment-address-container">
                <div className="price-container">
                    <div className="total-container"><h4>Subtotal</h4><h4>₹{price}</h4></div>
                    <div className="total-container"><h4>Shipping</h4><h4>₹70</h4></div>
                    <div className="total-container"><h4>Total</h4><h4>₹{price + 70}</h4></div>
                </div>

                <div className="address-container">
                    <div className="edit-icon-container">
                        <h4>Customer</h4>
                        <Popup 
                            trigger={<img src={edit} alt="Edit" />} 
                            modal 
                            className="centered-popup"
                        >
                            {
                                close => (
                                    <div className="shadow-given">
                                        <div className="popup-header"><h4>Edit Shipping Address</h4></div>
                            <div className="content">
                            <h4>Current</h4>
                            <form className="address-form">
                                {
                                    country ? <div className="select-container"><select className="select-section" onChange={(e) => { onchangeHandler(e.target.value) }}>
                                        <option value={selectedcountry}>{selectedcountry}</option>
                                        {country.map(({ id, name }) => {
                                            return <option key={id} value={name}>{name}</option>
                                        })}
                                    </select></div> : <select className="select-country">
                                        <option value="">Select Country</option>
                                    </select>
                                }

                                <div className="name-section">
                                    <input className="address-input" placeholder="First name" value={firstname} type="text" onChange={(e) => setFirstName(e.target.value)} />
                                    <input className="address-input" value={lastname} placeholder="Last name" type="text" onChange={(e) => setLastName(e.target.value)} />
                                </div>

                                <input className="address-input" placeholder="Address" type="text" value={address} onChange={(e) => setaddress(e.target.value)} />
                                <input className="address-input" value={apt}  placeholder="Apartment, suite, etc (optional)" type="text" onChange={(e) => setapt(e.target.value)} />
                                <input className="address-input" value={contact} placeholder="Phone" type="number" onChange={(e) => setContact(e.target.value)} />

                                <div className="select-container">
                                    {
                                        states ? <select className="select-section" onChange={(e) => { onchangeHandler2(e.target.value) }}>
                                            <option value={selectState}>{selectState}</option>
                                            {states.map(({ id, name }) => {
                                                return <option key={id} value={name}>{name}</option>
                                            })}
                                        </select> : <select className="select-section">
                                            <option value="">Select State</option>
                                        </select>
                                    }

                                    <div style={{ height: "10px" }}></div>

                                    {
                                        city ? <select className="select-section" onChange={(e) => { setSelectedCity(e.target.value) }}>
                                            <option value={selectedCity}>{selectedCity}</option>
                                            {city.map(({ id, name }) => {
                                                return <option key={id} value={name}>{name}</option>
                                            })}
                                        </select> : <select className="select-section">
                                            <option value="">Select City</option>
                                        </select>
                                    }

                                    <div style={{ height: "10px" }}></div>

                                    <input className="address-input" value={pincode} placeholder="Pincode" type="number" onChange={(e) => setPincode(e.target.value)} />
                                </div>

                                <div className="button-container">
                                    <button className="item-button" onClick={close}>Cancel</button>
                                    <button onClick={clickHandler} className="item-button">Make As Valid</button>
                                </div>
                            </form>
                            </div>
                                    </div>
                                )
                            }
                        </Popup>

                    </div>
                    <p>{order.firstname}  {order.lastname}</p>
                    <h4>Contact Infomation</h4>
                    <p>{order.email}</p>
                    <h4>Shipping Address</h4>
                    <p>{order.firstname}  {order.lastname}</p>
                    <p>{order.apartment} {order.address} {order.city} {order.state} {order.country} {order.pincode}</p>
                    <p>+{order.phonenumber}</p>
                </div>
            </div>
        </div>
    </>
}

export default OrderPage;