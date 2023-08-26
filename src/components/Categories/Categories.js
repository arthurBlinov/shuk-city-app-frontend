import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categories.css';
import ImagePopup from '../Popup/ImagePopup';
import UserDetailsPopup from '../Popup/UserDetailsPopup';
import { useUserContext } from '../User/UserContext';
import {  useNavigate, Link } from 'react-router-dom';
import { useCategoryContext } from './CategoryContext';

function Categories() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserContext(); 
  const {categories, updateCategories} = useCategoryContext();
  
  const handleCategoryClick = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index); 
    }
  };

  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true);
  };
  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(null);
  };
  const openUserPopup = (user) => {
    setSelectedUser(user);
    setShowUserPopup(true);
  };

  const closeUserPopup = () => {
    setShowUserPopup(false);
    setSelectedUser(null);
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/netcraft/category/fetch-category/${categoryId}`)
  };

  const handleDeleteCategory = async (id) => {
    
    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": "/*/",
          "Authorization": `Bearer ${user?.token}`
        }
      }
     
      await axios.put(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/delete-category/${id}`, {},
     config);
      updateCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <>
    {(user && user?.isAccountVerified) ? (
        <div className='categories'>

        {categories.map((category, index) => (
        <div key={category?._id}>
          {!category?.ifCategoryDeleted && (
            <div className={`category ${expandedIndex === index ? 'expanded' : ''}`}>
            <div className='category-title' onClick={() => handleCategoryClick(index)}>
              <h1>{category?.title}</h1>
            </div>
            <div className={`category-description ${expandedIndex === index ? 'expanded' : ''}`}>
              <p>{expandedIndex === index ? category?.description : `${category?.description?.split('').slice(0, 35).join('')}...`}</p>
            </div>
            <div className="posts-link">
            <Link to={`/netcraft/category/fetch-comments/${category?._id}`}>View Comments</Link>
  
            </div>
            <div className={`showing-category ${expandedIndex === index ? 'expanded' : ''}`}>
              {category?.image && (
                <div className={`category-image ${expandedIndex === index ? 'expanded' : ''}`}>
                  <img src={category?.image} alt={category.title} onClick={() => openImagePopup(category?.image)} />
                </div>
              )}
              {user && (user?._id !== category?.user?._id) ? (<div className="category-user" onClick={() => openUserPopup(category?.user)}>
                
                <div className="category-user-details">
                  <div className="category-user-photo-container">
                    <img src={category?.user?.profilePhoto} alt="" className="category-user-photo" />
                  </div>
                  <div className="category-user-name">{category?.user?.name}</div>
                </div>
               
              </div>

              ) : ''}
               {user && (user?._id === category?.user?._id) ? (
                  <div className="category-user-actions">
                    <button onClick={() => handleEditCategory(category?._id)}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category?._id)}>Delete</button>
                  </div>
                ) : ''}
            </div>
          </div>
          )}
        </div>
          
        ))}
        {showImagePopup && (
          <ImagePopup handlePopup={closeImagePopup} url={selectedImage} />
        )}
        {showUserPopup && (
          <UserDetailsPopup selectedUser={selectedUser} closeUserPopup={closeUserPopup} />
        )}
        <div className='last-category'/>
      </div>
    ) : (
      <div className="user-rules">
      <h2>App Rules</h2>
      <ul className="rule-list">
        <li>
          Rule 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget elit eget mi euismod auctor.
          Fusce quis justo et elit tristique viverra in at tortor. Sed nec ex in risus scelerisque gravida.
        </li>
        <li>
          Rule 2: Proin non massa sit amet mi tincidunt ullamcorper. Pellentesque lacinia, dolor a auctor tincidunt,
          erat odio lacinia justo, in volutpat sapien libero ac enim. Curabitur vel varius mauris.
        </li>
        <li>
          Rule 3: Ut volutpat nisl et urna feugiat, sit amet pharetra urna cursus. Aenean aliquam hendrerit
          lorem, a tincidunt metus varius vel. Nullam non tincidunt felis. Morbi vestibulum tellus nec sapien
          interdum scelerisque.
        </li>
      </ul>
    </div>
    )}
      
    </>
    
  );
}

export default Categories;




