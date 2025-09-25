import { Route, Routes } from 'react-router';
import './App.css';
import AppBarComponent from './components/header/AppBarComponent';
import { ToastContainer } from 'react-toastify';
import { routes } from './routes';
import UserComponent from './components/user/UserComponent';

function App() {
  return (
    <div className="App">
      <AppBarComponent />
      <UserComponent />
      <Routes>
        {
          routes.map((element, index) => {
            return (
              <Route
                path={element.path}
                element={element.element}
                key={index}
              />
            )
          })
        }
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
