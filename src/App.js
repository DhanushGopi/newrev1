import './App.css';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Reg from './Pages/Reg';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { newreUserDataStore } from './redux/userdatastore';
import {Provider} from 'react-redux';
import Conductor from './Pages/Conductor';

function App() {

  const pathsandelements = [
    {
      path:'/',
      element:<Login/>
    },
    {
      path:'/reg',
      element:<Reg/>
    },
    {
      path:'/home',
      element:<Home/>
    },
    {
      path:'/passverify',
      element:<Conductor/>
    },
  ]


  const navs = createBrowserRouter(pathsandelements);

  return (
    <Provider store={newreUserDataStore}>
    <div className='App'>
    <RouterProvider router={navs}/>
    </div>
    </Provider>

  );
}

export default App;
