import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { getLastMonths } from "../../../utils/features";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../../components/loader";

const {last12Months:months}=getLastMonths()
const Linecharts = () => {

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError } = useLineQuery(user?._id!);


  const products=data?.charts.products||[];
  const revenue=data?.charts.revenue||[];
  const discount=data?.charts.discount||[];
  const users=data?.charts.users||[];


  if (isError) return <Navigate to={"/admin/dashboard"} />;


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        {
          isLoading?(<Skeleton length={20}/>):(
            <>
            <section>
          <LineChart
            data={users}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={months}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={products}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={months}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={revenue}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={months}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={months}
          />
          <h2>Discount Allotted </h2>
        </section>
            </>
          )
        }
      </main>
    </div>
  );
};

export default Linecharts;
