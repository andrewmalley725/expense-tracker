import { useRef, useState } from "react";
import axios from 'axios';

export default function Expense({api, setShow, setLogin, account}){
    const amount = useRef(0);
    const description = useRef("");
    const user = JSON.parse(localStorage.getItem("user"));
    const apiKey = localStorage.getItem("apiKey");
    const [isLoading, setLoading] = useState(false);
    const url = `${api}/addTransaction/${user._id}`;

    const add = () => {
      setLoading(true);
      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        account_name: account,
        amount: parseFloat(amount.current),
        description: description.current.trimEnd()
      };

      axios.post(url, body, { headers }).then(res => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload();
      })
        .catch(error => {console.log(error)});
    }

    return(
      <div className='form-container'>
        <h4>Add expense</h4>
        Account: {account} <br/>
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        Description: <input type='text' onChange={(e) => {description.current = e.target.value}}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={add}>Add</button>
          <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }