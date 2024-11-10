import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSign, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
const user={_id:"sdshd",role:"user"}
const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const logOutHandler=()=>{
      setIsOpen(false)
    }
  return (
   <nav className="header">
    <Link onClick={()=>setIsOpen(false)} to={"/"}>HOME</Link>
    <Link onClick={()=>setIsOpen(false)} to={"/search"}><FaSearch/></Link>
    <Link onClick={()=>setIsOpen(false)} to={"/cart"}><FaShoppingBag/></Link>
    {
        user?._id?(
            <>
            <button onClick={()=>setIsOpen((prev)=>!prev)}><FaUser/></button>
            <dialog open={isOpen}>
              <div>
                {user.role==="admin" &&(
                    <Link onClick={()=>setIsOpen(false)} to="/admin/dashboard">Admin</Link>
        )}
        <Link onClick={()=>setIsOpen(false)} to="/orders">Orders</Link>
        <button onClick={logOutHandler}>
            <FaSignOutAlt/>
        </button>
              </div>
            </dialog>
            </>
        ):<Link to={"/login"}>LOGIN</Link>
    }
   </nav>
  )
}

export default Header
