import { useRef, useState } from "react";
import axios from 'axios';

export default function AddBalance({api, setShow, setLogin, category}){
    const amount = useRef(0);
    const user = JSON.parse(localStorage.getItem('user'));
    const apiKey = localStorage.getItem("apiKey");
    const [isLoading, setLoading] = useState(false);
    const url = `${api}/addBalance/${user._id}`;

    const add = () => {
      setLoading(true);
      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        amount: parseFloat(amount.current),
        category: category
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload();
        setLoading(false);
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className='form-container'>
        <h4>Add funds to {category}</h4>
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={add}>Add</button>
          <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }