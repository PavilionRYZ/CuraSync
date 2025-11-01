import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/slices/authSlice";
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/ErrorBoundary';
import RoutesComponent from './routes/Routes';
import { ThemeProvider } from './context/ThemeContext'
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
            <div>
              <Navbar />
              <main>
                <RoutesComponent />
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </Fragment >
      )}
    </ErrorBoundary>
  )
}

export default App