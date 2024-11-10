import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItem from "../components/cart-item";

const cartItems=[
  {
    productId:"ajbsdn",
    photo:"https://www.bhphotovideo.com/images/images2500x2500/nikon_26485_coolpix_l840_digital_camera_1120471.jpg",
    name:"camera",
    price:3000,
    quantity:4,
    stock:10
  }
];
const Subtotal=4000;
const tax=Math.round(Subtotal*0.18)
const shippingCharges=100
const Discount=200;
const total=Subtotal+tax+shippingCharges-Discount
const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("")
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false)
  useEffect(() => {
     const timeOutId=setTimeout(()=>{
        if(Math.random()>0.5){
          setIsValidCouponCode(true)
        }
        else{
          setIsValidCouponCode(false)
        }
     },1000)
  
    return () => {
      clearTimeout(timeOutId)
      setIsValidCouponCode(false)
    }
  }, [couponCode])
  
  return (
   <div className="cart">
    <main>

      {cartItems.length>0?(cartItems.map((i,idx)=>(
        <CartItem key={idx} cartItem={i}/>
      ))): <h1>No Items in Added</h1>}
    </main>
    <aside>
      <p>Subtotal:₹{Subtotal}</p>
      <p>Shipping Charges:₹{shippingCharges}</p>
      <p>Tax:₹{tax}</p>
      <p>
        Discount:<em className="red">-₹{Discount}</em>
      </p>
      <p>
        <b>Total:₹{total}</b>
      </p>
      <input type="text"placeholder="Coupon Code" value={couponCode} onChange={(e)=>setCouponCode(e.target.value)}/>
      {
      couponCode &&(
        isValidCouponCode?(<span className="green">₹{Discount} off using this <code>{couponCode}</code></span>):
        (<span className="red">Invalid Coupon Code <VscError/></span>)
      )
      }
      {
        cartItems.length>0 && <Link to="/shipping">Proceed to Buy</Link>
      }
    </aside>
   </div>
  )
}

export default Cart
