import './App.css'
import axios from 'axios';
import {useEffect, useState} from 'react'

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
    fetchUserData('672cd146ee9660baa41fc51a')
  },[])

  if (!user) {
    return <div>Loading...</div>;
  }

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
    </>
  )
}

export default App
