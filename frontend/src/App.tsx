import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:3000/create-checkout-session');
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
      <form onSubmit={handleSubmit}> 
        <button type='submit'>
          Checkout
        </button>
      </form>
    </>
  );
}

export default App;
