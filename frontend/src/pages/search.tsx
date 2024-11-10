import { useState } from "react"
import ProductCard from "../components/product-card"

const Search = () => {
  const [search,setSearch]=useState("")
  const [sort,setSort]=useState("")
  const [maxPrice,setMaxPrice]=useState(100000)
  const [category,setCategory]=useState("")
  const [page,setPage]=useState(1)
  const addToCardHandler=()=>{}
  const isNextPage=page<4;
  const isPrevPage=page>1;
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>MaxPrice:{maxPrice || ""}</h4>
          <input type="range" min={100} max={100000} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/>
        </div>
        <div>
          <h4>Sort</h4>
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="asc">Sample 1</option>
            <option value="dsc">Sample 2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name.."
        value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <div className="search-product-list">
          <ProductCard productId="dp" name="camera" price={5000} stock={50}
        photo="https://www.bhphotovideo.com/images/images2500x2500/nikon_26485_coolpix_l840_digital_camera_1120471.jpg"
        handler={addToCardHandler}/>
        </div>
        <article>
          <button disabled={!isPrevPage} onClick={()=>setPage((prev)=>prev-1)}>Prev</button>
          <span>{page} of {4}</span>
          <button disabled={!isNextPage} onClick={()=>setPage((prev)=>prev+1)}>Next</button>
        </article>
      </main>
    </div>
  )
}

export default Search
