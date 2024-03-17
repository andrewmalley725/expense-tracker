import { useRef } from "react";
import axios from 'axios';

export default function Payday({api, setShow, setLogin}){
    const amount = useRef(0);
    const description = useRef("");
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = localStorage.getItem("apiKey");
    const url = `${api}/addPayday/${user._id}`;

    const add = () => {
      
      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        amount: parseFloat(amount.current),
        description: description.current
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload();
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className='form-container'>
        <h4>Add funds</h4>
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        Description: <input type='text' onChange={(e) => {description.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
      </div>
    )
  }