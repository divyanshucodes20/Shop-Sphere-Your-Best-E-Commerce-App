import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import { addToCart, calculatePrice, discountApply, removeCartItem } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

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
    if(cartItem.quantity>=cartItem.stock){
      toast.error(`Only ${cartItem.stock} units of ${cartItem.name} are available in stock.`);
      return;
    }
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      toast.error(`The quantity for ${cartItem.name} must be at least 1.`);
      return;
  }  
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}));
  };
  const removeHandler = (productId:string) => {
    dispatch(removeCartItem(productId))
    toast.success("Item Removed from Cart")
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`).then((res)=>{
        dispatch(discountApply(res.data.discount))
        setIsValidCouponCode(true)})
      .catch(()=>{
        dispatch(discountApply(0))
        setIsValidCouponCode(false);
      }) 
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      
    };
  }, [couponCode]);

  useEffect(()=>{
   dispatch(calculatePrice())
  },[cartItems])
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
