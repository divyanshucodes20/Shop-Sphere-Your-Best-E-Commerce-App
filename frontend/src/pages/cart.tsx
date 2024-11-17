import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import {CartItem} from "../types/types";
import { addToCart, removeCartItem } from "../redux/reducer/cartReducer";


const Cart = () => {
  const { 
    cartItems, 
    subTotal, 
    tax, 
    total, 
    shippingCharges, 
    discount 
  } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
const dispatch=useDispatch();
  const incrementHandler = (cartItem: CartItem) => {
    
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}));
  };
  const decrementHandler = (cartItem: CartItem) => {
    
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}));
  };
  const removeHandler = (productId:string) => {
    
    dispatch(removeCartItem(productId))
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsValidCouponCode(Math.random() > 0.5); // Simulating coupon validation
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => <CartItemCard incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler} key={idx} cartItem={item} />)
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subTotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red">-₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode && (
          isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using this <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon Code <VscError />
            </span>
          )
        )}
        {cartItems.length > 0 && <Link to="/shipping">Proceed to Buy</Link>}
      </aside>
    </div>
  );
};

export default Cart;
