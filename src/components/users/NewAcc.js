import { useRef } from "react";
import axios from 'axios';
import Login from "./Login";


export default function NewAcc({api, setFunc, setShow, setLogin}){
    const username = useRef("");
    const password = useRef("");
    const firstname = useRef("");
    const lastname = useRef("");

    const submit = () => {

      setShow(false);
      setLogin(true);

      const body = {
        username: username.current,
        firstname: firstname.current,
        lastname: lastname.current,
        password: password.current,
      };

      axios.post(`${api}/addUser`, body).then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem("apiKey", res.data.apiKey);
        
        window.location.reload();
      })
      .catch(error => console.log(error));
    }

    return(
      <div className="form-container">
        First Name: <input type='text' onChange={(e) => firstname.current = e.target.value}></input><br/>
        Last Name: <input type='text' onChange={(e) => lastname.current = e.target.value}></input><br/>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='password' onChange={(e) => password.current = e.target.value}></input><br/>
        <button type='button' onClick={submit}>Submit</button>  
        <button type='button' onClick={() => setFunc(<Login api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>)}>Already have an account</button>
      </div>
    )
  }