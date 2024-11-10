import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
const Home = () => {
  const addToCartHandler=()=>{

  }
  return (
    <div className="home">
      <section></section>
      <h1>Latest Products
        <Link to="/search" className="findMore">More</Link>
      </h1>
      <main>
        <ProductCard productId="dp" name="camera" price={5000} stock={50}
        photo="https://www.bhphotovideo.com/images/images2500x2500/nikon_26485_coolpix_l840_digital_camera_1120471.jpg"
        handler={addToCartHandler}/>
      </main>
    </div>
  )
}

export default Home
