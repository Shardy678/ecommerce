import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
}

const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/search/${searchTerm}`);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    };

    if (searchTerm.trim() !== '') {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
