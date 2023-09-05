import React, { useState } from 'react';
import axios from 'axios';
import './Categories.css';
import ImagePopup from '../Popup/ImagePopup';
import UserDetailsPopup from '../Popup/UserDetailsPopup';
import { useUserContext } from '../User/UserContext';
import {  useNavigate, Link } from 'react-router-dom';
import { useCategoryContext } from './CategoryContext';
import baseUrl from '../../utils/baseURL';
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
     
      await axios.put(`${baseUrl}/netcraft/category/delete-category/${id}`, {},
     config);
      updateCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  
  return (
        <>
        {(user && user?.isAccountVerified) ? (
            <div className='categories'>
    
            {categories?.map((category, index) => (
            <div key={category?._id}>
          {(expandedIndex === 0 && expandedIndex === index) && <div className='first-category' />}
    
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
                      {category?.image?.image?.data?.data && (
                                  <img src={`data:${category?.image?.fileType};charset=utf-8;base64,${uint8ArrayToBase64(category?.image?.image?.data?.data)}`}
                                  alt={category.image.fileName}
                                  onClick={() => openImagePopup(category?.image)}/>
                                  
                                )}
    
                    </div>
                  )}
                  {user && (user?._id !== category?.user?._id) ? (<div className="category-user" onClick={() => openUserPopup(category?.user)}>
                    <div className="category-user-details">
                    
                      <div className="category-user-name">{category?.user?.name}</div>
                    </div>
                   
                  </div>
    
                  ) : ''}
                   {user && (user?._id === category?.user?._id) ? (
                      <div className="category-user-actions">
                        <button onClick={() => handleEditCategory(category?._id)}>לערוך</button>
                        <button onClick={() => handleDeleteCategory(category?._id)}>למחוק</button>
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
          <h2>כללי שימושב אפליקציה</h2>
          <ul className="rule-list">
            <li>
              כלל ברזל 1 אמר להיות רשום כאן
            </li>
            <li>
              כלל ברזל 2 אמור להיות רשום כאן
            </li>
            <li>
              כלל ברזל 3 אמור להיות רשום כאן
            </li>
            <li>
                וכו
            </li>
          </ul>
        </div>
        )}
        </>
        
      );
}

export default Categories;
              
