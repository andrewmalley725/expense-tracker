import { useRef, useState } from "react";
import axios from 'axios';

export default function AddCategory({api, setShow, setLogin}){
    const name = useRef("");
    const weight = useRef(0);
    const apiKey = localStorage.getItem("apiKey");
    const user = JSON.parse(localStorage.getItem('user'));
    const [isLoading, setLoading] = useState(false);


    const url = `${api}/addCategory/${user._id}`;

    const add = () => {
      setLoading(true);
      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        account_name: name.current,
        weight: parseFloat(weight.current) / 100,
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload();
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className="form-container">
        <h4>New category</h4>
        Category Name: <input type='text' onChange={(e) => {name.current = e.target.value}}></input><br/>
        Weight: %<input type='number' onChange={(e) => {weight.current = e.target.value}}></input><br/>
        <div style={{display: isLoading ? 'none' : 'block'}}>
          <button type='button' onClick={add}>Add</button>
          <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
        </div>
        <div style={{display: isLoading ? 'block' : 'none'}}>Loading...</div>
      </div>
    )
  }