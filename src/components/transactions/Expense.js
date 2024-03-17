import { useRef } from "react";
import axios from 'axios';

export default function Expense({api, setShow, setLogin}){
    const account = useRef(null);
    const amount = useRef(0);
    const description = useRef("");
    const user = JSON.parse(localStorage.getItem("user"));
    const apiKey = localStorage.getItem("apiKey");
    const url = `${api}/addTransaction/${user._id}`;

    const add = () => {

      const headers = {
        'x-api-key': apiKey
      }

      if (account.current === null){
        alert('Please select an account!')
      }

      else {
        const body = {
          account_name: account.current ? account.current : 'Unallocated funds',
          amount: parseFloat(amount.current),
          description: description.current
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
        Account: <select onChange={(e) => account.current = e.target.value}>
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
        Description: <input type='text' onChange={(e) => {description.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
      </div>
    )
  }