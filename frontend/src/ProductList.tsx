import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";

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
    fetchPrices();
  }, [products]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product List</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-6">
              <Badge variant="secondary" className="mb-2">
                <div className="mr-1">
                  {product.metadata.category || "Uncategorized"}
                </div>
              </Badge>
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">
                {product.description || "No description"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  {product.default_price
                    ? prices[product.id] || "Loading..."
                    : "Price not available"}
                </span>
                <Button
                  onClick={() => handleSubmit(product.default_price)}
                  disabled={!product.default_price}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
