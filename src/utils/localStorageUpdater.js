


const setItem = (key, value) => {
   
  localStorage.setItem(key, value );
}

const isToken= () => {
  const isToken = localStorage.getItem("token")
  if(isToken) return true
  else return false
};


const removeItem = (key) => {
  localStorage.removeItem(key);
}   

export { setItem,isToken, removeItem };                     