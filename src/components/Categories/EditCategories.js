import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditCategories.css';
import { useUserContext } from '../User/UserContext';
import { useCategoryContext } from './CategoryContext';
import baseUrl from '../../utils/baseURL';
function EditCategory() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const user = useUserContext();
  const {updateCategories} = useCategoryContext();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the current category details from the API based on the category ID
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${baseUrl}/netcraft/category/fetch-category/${categoryId}`,
        {
            
            headers: {
                "Authorization": `Bearer ${user?.user.token}`
            } 
            
        });
        setCategory(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
    
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the updated category data
    const updatedCategory = {
      // ...category,
      title,
      description,
    };

    try {
      // Send a request to update the category based on the category ID
      await axios.put(`${baseUrl}/netcraft/category/update-category/${categoryId}`, updatedCategory, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${user?.user?.token}`
        }
      });
      // Redirect back to the category list or take any other appropriate action
      
      updateCategories();
      navigate('/');
      // You can use the `useNavigate` hook if you're using React Router v6
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="edit-category-container"> {/* Apply the edit-category-container class */}
      <h2 className="edit-category-title">Edit Category</h2> {/* Apply the edit-category-title class */}
      <form className="edit-category-form" onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={handleDescriptionChange} />
        </div>
        <button type="button" className="edit-category-button" onClick={() => navigate('/')}>Close</button>
        <button type="submit" className="edit-category-button">Update Category</button> {/* Apply the edit-category-button class */}
      </form>
    </div>
  );
}

export default EditCategory;
