import { useRef, useState } from "react";
import axios from 'axios';

export default function TransferFunds({api, setShow, setLogin}){
    const to = useRef(null);
    const from = useRef(null);
    const amount = useRef(0);
    const user = JSON.parse(localStorage.getItem("user"));
    const apiKey = localStorage.getItem("apiKey");
    const [isLoading, setLoading] = useState(false);
    const url = `${api}/moveFunds/${user._id}`;

    const add = () => {
      setLoading(true);
      const headers = {
        'x-api-key': apiKey
      }

      if (to.current === null || from.current === null){
        alert('Please select valid categories.')
      }

      else {
        const body = {
          to: to.current ? to.current : 'Unallocated funds',
          amount: parseFloat(amount.current),
          from: from.current ? from.current : 'Unallocated funds'
        };

        axios.post(url, body, { headers }).then(res => {
          console.log(res.data);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.location.reload();
        })
        .catch(error => {console.log(error)});
      }
    }

    return(
      <div className='form-container'>
        <h4>Add expense</h4>
        Account (from): <select onChange={(e) => from.current = e.target.value}>
          <option selected disabled value={null}>Select a category</option>
          {
            user.accounts ? user.accounts.map(rec => {
              return(
                <option value={rec.account_name}>{rec.account_name}</option>
              )
            }) : <></>
          }
        </select><br/>
        Account (to): <select onChange={(e) => to.current = e.target.value}>
          <option selected disabled value={null}>Select a category</option>
          {
            user.accounts ? user.accounts.map(rec => {
              return(
                <option value={rec.account_name}>{rec.account_name}</option>
              )
            }) : <></>
          }
        </select><br/>
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={add}>Add</button>
          <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }