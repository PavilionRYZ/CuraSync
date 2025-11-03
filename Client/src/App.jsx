import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/slices/authSlice";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import RoutesComponent from './routes/Routes';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/pages/Loading';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, token, dispatch]);

  return (
    <ErrorBoundary>
      {isLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <ThemeProvider>
            {/* Full-height flex layout ensures footer stays at the bottom */}
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

              {/* Fixed Navbar on top */}
              <Navbar />

              {/* Main scrollable area with proper bottom padding */}
              <main className="flex-grow px-4 md:px-6 pt-6 pb-24 overflow-y-auto">
                <RoutesComponent />
              </main>

              {/* Footer always at bottom */}
              <Footer />
            </div>
          </ThemeProvider>
        </Fragment>
      )}
    </ErrorBoundary>
  );
};

export default App;
