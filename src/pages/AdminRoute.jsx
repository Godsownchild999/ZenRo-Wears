import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  if (!user?.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

AdminRoute.propTypes = {
  user: PropTypes.shape({
    isAdmin: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
};

AdminRoute.defaultProps = {
  user: null,
};

export default AdminRoute;