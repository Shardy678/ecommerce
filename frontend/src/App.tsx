import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cart from './Cart';
import Login from './Login';
import Profile from './Profile';
import ProductList from './ProductList';

type User = {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUserData = async (id: string) => {
      try {
        const response = await axios.get<User>(`http://localhost:3000/user/${id}`)
        setUser(response.data)
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }
    fetchUserData('6731df29685b4d9476b1ac6c');
  }, [])

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (priceId:string) => {
    try {
      const response = await axios.post('http://localhost:3000/create-checkout-session', {priceId});
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <>
      <div>
        <h1>User Profile</h1>
        <div>
          <label>Username:</label>
          <span>{user.username}</span>
        </div>
        <div>
          <label>Email:</label>
          <span>{user.password}</span>
        </div>
        <div>
          <label>Role:</label>
          <span>{user.role}</span>
        </div>
      </div>
      <button onClick={() => handleSubmit('price_1QJuoqJj5OvhYSRkn84gqupA')}>Checkout</button>
      <Cart/>
      <Login/>
      <Profile/>
      <ProductList/>
    </>
  );
}

export default App;
