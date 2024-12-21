import "../css/Products.css";
import back from "../assets/back.png";
import { useNavigate, useParams } from "react-router-dom";
import { database, onValue, ref } from "../config";
import { useEffect, useState } from "react";
import { getStorage, ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";  // Import Firebase Storage methods
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { remove, set } from "firebase/database";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import close from "../assets/cancel.png"
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique file names


const ItemTypes = {
    IMAGE: 'image',
};

// ImageItem component for dragging and dropping images
const ImageItem = ({ id, src, index, moveImage }) => {
    const [, ref] = useDrag({
        type: ItemTypes.IMAGE,
        item: { id, index },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.IMAGE,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveImage(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li ref={(node) => ref(drop(node))}>
            <img style={{width:"100px"}} src={src} alt={`Image ${index}`} />
        </li>
    );
};

const AddProduct = () => {
    const [product, setProduct] = useState({
        body_html: "",
        images : [
            ],
            product_type : "",
            tags : [],
            title: "",
            variants : [
              {
                compare_at_price : "",
                inventory_management : "",
                inventory_quantity : 0,
                price : "",
                sku : "",
                title : ""
              }
            ],
            vendor : ""          
    });
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const id = uuidv4();

    const format = [
        'font', 'size', 'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
        'list', 'bullet', 'check', 'indent', 'align',
        'link', 'image', 'video', 'color', 'background', 'script',
    ];

    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'blockquote': 'blockquote' }, { 'code-block': 'code-block' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['clean']
        ],
    };

    const changeHandler=(e)=>{
        const name = e.target.name
        const value = e.target.value
        const data = {...product, [name]: value}
        setProduct(data)
    }


    const changeHandler2=(e)=>{

        const name = e.target.name
        const value = e.target.value
        const updatedProduct = { ...product };

         updatedProduct.variants[0] = {
                ...updatedProduct.variants[0],  // Spread the existing variant properties
                [name]: value  // Update the price
            };
       
        // Update the state
        setProduct(updatedProduct);

    }

    const ClickHandler = async () => {
        const updatedProduct = {...product,body_html: value}
        setProduct(updatedProduct)
        if(updatedProduct.body_html!=="" && updatedProduct.images.length!==0&&updatedProduct.updatedProduct_type!==""&&updatedProduct.title!==""&&updatedProduct.variants[0].price!==""&&updatedProduct.variants[0].compare_at_price!==""&&updatedProduct.variants[0].inventory_quantity!==0){
            await set(ref(database, `products/${id}`), updatedProduct);
            alert("Product uploaded")
            navigate("/")
        }
    };

    // Function to handle the reordering of images
    const moveImage = (fromIndex, toIndex) => {
        const updatedImages = [...product.images];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setProduct({ ...product, images: updatedImages });
    };

    const closeHandler = async (imageIndex, fileUrl) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                // Step 1: Delete the image from Firebase Storage
                const storage = getStorage();
                const fileRef = storageRef(storage, fileUrl);
                await deleteObject(fileRef);
    
                // Step 2: Remove the image from the product's image array in Firebase Database
                const updatedImages = [...product.images];
                updatedImages.splice(imageIndex, 1); // Remove the image from the array
    
                const updatedProduct = { ...product, images: updatedImages };
                setProduct(updatedProduct); // Update the local state
        
                alert("Image deleted successfully!");
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Failed to delete the image.");
            }
    }
    };


    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // Firebase Storage reference
        const uniqueFileName = uuidv4();
        const storage = getStorage();
        const storagepath = `images/${id}/${uniqueFileName}`;
        const storagereferencse = storageRef(storage, storagepath);
        
        try {
            // Upload the file to Firebase Storage
            await uploadBytes(storagereferencse, file);

            // Get the file's download URL
            const fileUrl = await getDownloadURL(storagereferencse);

            // Update the product's images array with the new image URL
            const updatedImages = product.images ? [...product.images, { src: fileUrl }] : [{ src: fileUrl }];
            const updatedProduct = { ...product, images: updatedImages };
            setProduct(updatedProduct);
    
            // Save the updated product to Firebase Database
    
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload the image.');
        }
    };
    
    

    return (
        <>
            {product.length !== 0 ? (
                <div className="product-page-container">
                    <div className="Product-page-header add">
                        <div className="id-name-container">
                            <img src={back} width={20} onClick={() => navigate("/products")} alt="Back" />
                            <h2>{product.title}</h2>
                        </div>
                    </div>

                    <div className="product-container">
                        <label>Title</label>
                        <input onChange={(e)=>changeHandler(e)} name="title" value={product.title} />
                        <label>Description</label>
                        <ReactQuill formats={format} modules={modules} theme="snow" value={value} onChange={setValue} />
                        <div className="page-heading">
                            <label>Media</label>
                            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={uploadImage} />
                            <button onClick={() => document.getElementById('fileInput').click()} className="item-button">+</button>

                        </div>

                        {/* Drag and drop for images */}
                        <DndProvider backend={HTML5Backend}>
                            <ul className="media-container">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((image, index) => (
                                        <div className="icon-container">
                                            <ImageItem
                                                key={image.id}
                                                id={image.id}
                                                src={image.src}
                                                index={index}
                                                moveImage={moveImage}
                                            />
                                            <img onClick={()=>closeHandler(index,image.src)} width={200} className="close-icon" src={close} />
                                        </div>
                                    ))
                                ) : (
                                    <div>No images available.</div>
                                )}
                            </ul>
                        </DndProvider>

                        <label>Category</label>
                        <select name="product_type" onChange={(e)=>changeHandler(e)} value={product.product_type}>
                            <option value="kashmiri Saffron">kashmiri Saffron</option>
                            <option value="Irani Saffron">Irani Saffron</option>
                        </select>
                    </div>

                    <div className="list-price-container">
                        <h3>Pricing</h3>
                        <label>Price</label>
                        <input type="number" onChange={(e)=>changeHandler2(e)} name="price" value={product.variants[0].price} />

                        <label>Compare at price</label>
                        <input type="number" onChange={(e)=>changeHandler2(e)} name="compare_at_price" value={product.variants[0].compare_at_price} />

                        <label>Available Stock</label>
                        <input type="number" onChange={(e)=>changeHandler2(e)} name="inventory_quantity" value={product.variants[0].inventory_quantity} />

                        {/* <label>Tags</label>
                        <input /> */}
                    </div>

                    <div className="save-container">
                        <button className="item-button" onClick={()=>navigate("/products")}>Cancel</button>
                        <button onClick={ClickHandler} className="item-button">Save</button>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default AddProduct;
