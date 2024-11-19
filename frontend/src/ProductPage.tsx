import { useNavigate } from "react-router-dom";
import ProductList from "./ProductList";

const ProductPage = () => {
  const navigate = useNavigate(); 

  const handleRedirect = () => {
    navigate("/"); 
  };
  return (
    <>
      <h1>My Shop</h1>
      <button className="hover:underline" onClick={handleRedirect}>Go back</button>
      <ProductList/>
    </>
  );
};

export default ProductPage;
