import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
}

const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setAllProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, allProducts]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredProducts.length > 0 && (
        <div>
          {filteredProducts.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
