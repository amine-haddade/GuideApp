import { Outlet } from "react-router-dom";

const GuestLayout = () => {
//   const { user, token } = useSelector((state) => state.auth);

//   if (token && user) return <Navigate to="/" />;

  return (
    <div className="h-screen bg-fuchsia-700">
      <div  className="bg-orange-400">

navbare Componenet     
      </div>
<Outlet />
    </div>
  );
};

export default GuestLayout;
