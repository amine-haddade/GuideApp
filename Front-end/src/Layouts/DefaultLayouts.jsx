import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
 return(
    <div>
        bonjour amine
        <Outlet/>
    </div>
  );
};

export default DefaultLayout;
