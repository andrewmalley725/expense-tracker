/* eslint-disable jsx-a11y/anchor-is-valid */
import './styles.css';
import { useState, useEffect } from 'react';
import Login from './components/users/Login';
import Modal from './Modal';
import Categories from './components/categories/Categories';


function App(){
  const api = 'https://finance-app-flask-afh4ecdnpq-uc.a.run.app';
  //const api = 'http://localhost:5000';
  const [show, setShow] = useState(localStorage.getItem('user') ? false : true);
  const [login, setLogin] = useState(localStorage.getItem('user') ? true : false);
  const [func, setFunc] = useState(<></>);
  
  useEffect(() => {
    setFunc(<Login api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>)
  }, [])

  return ( //main
    <div>
      <div style={{display: !show ? 'none' : 'block'}}>
        <Modal show ={show} func={func}/>
      </div>
      <div style={{display: !login ? 'none' : 'block'}}>
        <Categories api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>
      </div>
    </div>
  );
}

export default App;
