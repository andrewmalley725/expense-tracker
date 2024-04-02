import { useRef, useState } from "react";
import axios from 'axios';
import NewAcc from "./NewAcc";

export default function Login({api, setFunc, setShow, setLogin}){
    const username = useRef("");
    const password = useRef("");
    const [msg, setMsg] = useState("");
    const [isLoading, setLoading] = useState(false);

    const submit = () => {
      setLoading(true);
      const body = {
        username: username.current,
        password: password.current
      };
      
      axios.post(`${api}/authenticate`, body).then(res => {
        if (res.data.status === 'successfully logged in'){
          setShow(false);
          setLogin(true);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem("apiKey", res.data.apiKey);
          window.location.reload();
        }
        else {
          setMsg(res.data.status);
        }
        setLoading(false);
      })
    }
    return(
      <div className="form-container">
        <h4>Expense tracker login</h4>
        <p style={{color: 'red'}}>{msg}</p>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='password' onChange={(e) => password.current = e.target.value}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={submit}>Submit</button>
          <button type='button' onClick={() => {setFunc(<NewAcc api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>)}}>Create new account</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }