import './App.css';
import { lazy, Suspense, useState } from 'react';

import { AppBar } from './components'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Loading from './pages/Loading';

const Login = lazy(() => import('./pages/Login'))
const Documents = lazy(() => import('./pages/Documents'))
const Document = lazy(() => import('./pages/Document'))
const Register = lazy(() => import('./pages/Register'))

function App() {
  const [currentRoute, setCurrentRoute] = useState('/')

  console.log()

  return (
    <Router>
      { currentRoute !== '/login' && currentRoute !== '/register' ? <AppBar/> : "" }
      
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="" element={<Documents setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/documents" element={<Documents setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/document" element={<Document setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/document/:id" element={<Document setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/login" element={<Login setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/register" element={<Register setCurrentRoute={setCurrentRoute}/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
