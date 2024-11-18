import { Elements } from "@stripe/react-stripe-js"
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QLVdSBcW8wFvc8qqdUfvyvSfQlFDOGgqfHENoyWdalmidM53pDtGKYMarn0NDsC99ncIdf1cC4JODOYinvmZKKC00hlRFJVav');

const CheckOutForm=()=>{
    const submitHandler=()=>{

    }
    return <div className="checkout-container">
     <form onSubmit={submitHandler}>
        
     </form>
    </div>
}

const Checkout = () => {
  return <Elements stripe={stripePromise}>
    <CheckOutForm/>
  </Elements>
}

export default Checkout
