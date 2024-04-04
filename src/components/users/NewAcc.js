import { useRef, useState } from "react";
import axios from 'axios';
import Login from "./Login";


export default function NewAcc({api, setFunc, setShow, setLogin}){
    const username = useRef("");
    const password = useRef("");
    const firstname = useRef("");
    const lastname = useRef("");
    const [msg, setMsg] = useState('');
    const [isLoading, setLoading] = useState(false);


    const submit = () => {
      setLoading(true);
      

      const body = {
        username: username.current,
        firstname: firstname.current,
        lastname: lastname.current,
        password: password.current,
      };

      axios.post(`${api}/addUser`, body).then(res => {
        if (res.data.status === 'Someone with that username already exists!'){
          setLoading(false);
          setMsg(res.data.status);
        }
        else {
          setShow(false);
          setLogin(true);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem("apiKey", res.data.apiKey);
          setLoading(false);
          window.location.reload();
        }
        
      })
      .catch(error => console.log(error));
    }

    return(
      <div className="form-container">
        <div style={{color: 'red', display: msg ? 'block' : 'none'}}>{msg}</div>
        First Name: <input type='text' onChange={(e) => firstname.current = e.target.value}></input><br/>
        Last Name: <input type='text' onChange={(e) => lastname.current = e.target.value}></input><br/>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='password' onChange={(e) => password.current = e.target.value}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={submit}>Submit</button>
          <button type='button' onClick={() => {setFunc(<Login api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>)}}>Create new account</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }