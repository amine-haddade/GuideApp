import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = (/*{ allowedRoles }*/) => {
//   const { token, user, isAuthenticated } = useSelector((state) => state.auth);

//   if (!isAuthenticated || !token || !user) {
//     return <Navigate to="/login" replace />;
//   }

  // Si tu veux ajouter des rôles plus tard :
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoutes;

