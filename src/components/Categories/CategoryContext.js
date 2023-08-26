// CategoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/fetch-categories'
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateCategories = async () => {
    await fetchCategories();
  };

  return (
    <CategoryContext.Provider value={{ categories, updateCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);
