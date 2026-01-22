import React, {  useEffect } from 'react'
import CategoryBar from '../../components/Category/CategoryBar.jsx'
import { getToken, removeToken, saveToken } from '../../../utils/auth.js';
import Products from '../../components/Products/Products.jsx';
import WishlistIcon from '../../components/WishList/WishlistIcon.jsx';
function HomePage() {

  useEffect(() => {
    console.log(location.pathname)
  }, []);
  let token = localStorage.getItem("token");
  let tem =getToken()
  const handleDelete = () => {
    if(tem) removeToken()
    else saveToken(token)
  };
  
  
  return (
    <div>
      
      <CategoryBar></CategoryBar>
      <Products></Products>
    </div>
    
  )
}

export default HomePage