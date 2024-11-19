import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate(); 

  const handleRedirect = () => {
    navigate("/products"); 
  };
  return (
    <>
      <div>Main Page</div>
      <button className="hover:underline" onClick={handleRedirect}>Go to Products</button>
    </>
  );
};

export default MainPage;
