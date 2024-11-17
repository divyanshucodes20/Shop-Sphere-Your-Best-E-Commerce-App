import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const dispatch = useDispatch(); // Use hook at the component level
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      toast.error("Item is Out of Stock");
      return;
    }
    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to cart`);
  };

  if (isError) {
    toast.error("Cannot fetch the products");
  }

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findMore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              photo={product.photo}
              handler={addToCartHandler}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
