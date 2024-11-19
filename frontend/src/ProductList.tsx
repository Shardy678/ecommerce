import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string | null;
  description: string | null;
  images: string[];
  livemode: boolean;
  marketing_features: any[];
  metadata: Record<string, any>;
  name: string;
  package_dimensions: any | null;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string | null;
  type: string;
  unit_label: string | null;
  updated: number;
  url: string | null;
}

interface ProductResponse {
  object: string;
  data: Product[];
  has_more: boolean;
  url: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductResponse>(
          "http://localhost:3000/products"
        );
        setProducts(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchPriceFromStripe = async (priceId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/prices/${priceId}`
      );
      const priceData = response.data;

      const amountInDollars = (priceData.unit_amount / 100).toFixed(2);
      const currency = priceData.currency.toUpperCase();

      return `${amountInDollars} ${currency}`;
    } catch (error) {
      console.error("Error fetching price from Stripe:", error);
      return "Price not available";
    }
  };

  const handleSubmit = async (priceId: string | null) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/create-checkout-session",
        { priceId }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const pricePromises = products.map(async (product) => {
        if (product.default_price) {
          const priceString = await fetchPriceFromStripe(product.default_price);
          return { id: product.id, price: priceString };
        }
        return null;
      });

      const priceData = await Promise.all(pricePromises);
      const priceMap = priceData.reduce((acc, price) => {
        if (price) {
          acc[price.id] = price.price;
        }
        return acc;
      }, {} as Record<string, string | null>);

      setPrices(priceMap);
    };

    if (products.length > 0) {
      fetchPrices();
    }
  }, [products]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products: {error}</p>;

  return (
    <div>
      <h1 className="text-lg font-bold">Product List</h1>
      <ul className="flex flex-row gap-5 mt-2">
        {products.map((product) => (
          <li key={product.id} className="border m-4 p-4">
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.description || "No description"}</p>
            <p>{product.metadata.category || "No category"}</p>
            <p>Price: {prices[product.id] || "Loading..."}</p>
            <button
              onClick={() => handleSubmit(product.default_price)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!product.default_price}
            >
              Buy Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
