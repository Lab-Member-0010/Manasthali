import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Auth({ children }) {
  // Access the state from the store correctly
  const { isLoggedIn } = useSelector((store) => store.user); // Corrected path

  if (isLoggedIn) {
    return children;
  }

  return <Navigate to="/signin" />;
}

export default Auth;
