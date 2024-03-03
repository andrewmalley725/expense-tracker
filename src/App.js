import './styles.css';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

localStorage.clear();

function App(){
  const api = 'https://sample-project-667a4.web.app/api';
  const [show, setShow] = useState(true);
  const [func, setFunc] = useState(<Login/>);
  const [login, setLogin] = useState(false);

  function NewAcc(){
    const username = useRef("");
    const password = useRef("");
    const firstname = useRef("");
    const lastname = useRef("");
    const email = useRef("");

    const submit = () => {
      const body = {
        userName: username.current,
        first: firstname.current,
        last: lastname.current,
        pass: password.current,
        email: email.current
      };

      axios.post(`${api}/newUser`, body).then(res => {
        localStorage.setItem("userId", res.data.record.userid);
        localStorage.setItem("username", res.data.record.username);
        localStorage.setItem("name", `${res.data.record.firstname} ${res.data.record.lastname}`);
        localStorage.setItem("apiKey", res.data.apiKey);
        setShow(!show);
        setLogin(!login);
      })
      .catch(error => console.log(error));
    }

    return(
      <div className="form-container">
        First Name: <input type='text' onChange={(e) => firstname.current = e.target.value}></input><br/>
        Last Name: <input type='text' onChange={(e) => lastname.current = e.target.value}></input><br/>
        Email: <input type='text' onChange={(e) => email.current = e.target.value}></input><br/>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='text' onChange={(e) => password.current = e.target.value}></input><br/>
        <button type='button' onClick={submit}>Submit</button>  
        <button type='button' onClick={() => setFunc(<Login/>)}>Already have an account</button>
      </div>
    )
  }

  function Login(){
    const username = useRef("");
    const password = useRef("");
    const [msg, setMsg] = useState("");

    const submit = () => {
      const body = {
        username: username.current,
        password: password.current
      };
      axios.post(`${api}/authenticate`, body).then(res => {
        if (res.data.status === 'success'){
          localStorage.setItem("userId", res.data.record.userid);
          localStorage.setItem("username", res.data.record.username);
          localStorage.setItem("name", `${res.data.record.firstname} ${res.data.record.lastname}`);
          localStorage.setItem("apiKey", res.data.apiKey);
          setShow(!show);
          setLogin(!login);
        }
        else {
          setMsg(res.data.status);
        }
      })
    }
    return(
      <div className="form-container">
        <p style={{color: 'red'}}>{msg}</p>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='text' onChange={(e) => password.current = e.target.value}></input><br/>
        <button type='button' onClick={submit}>Submit</button>
        <button type='button' onClick={() => {setFunc(<NewAcc/>)}}>Create new account</button>  
      </div>
    )
  }

  function Categories(){
    const [data, setData] = useState({});

    useEffect(() => {
      const uid = localStorage.getItem("userId");
      const apiKey = localStorage.getItem("apiKey");

      if (uid){
        const payload = {
          headers: {
            'x-api-key': apiKey
          }
        }
        axios.get(`${api}/categories/${uid}`, payload).then(res => {
          setData(res.data);
        });
    }
    }, []);

    const newCategory = () => {
      setFunc(<AddCategory/>);
      setShow(!show);
    }

    return (
      data ? (
        <div className="categories-container">
          <h2>Welcome {data.user}</h2>
          <h4>Current Balance: {data.total_balance}</h4>
          <b>Categories:</b>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Weight</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.accounts ? data.accounts.map(rec => (
                <tr>
                  <td>{rec.account_name}</td>
                  <td>{rec.weight}</td>
                  <td>{rec.balance}</td>
                </tr>
              )) 
              : <></>}
              <tr>
                <td>
                  <b>
                    TOTAL
                  </b>
                </td>
                <td></td>
                <td>
                  <b>
                    {data.total_balance}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
          <button type='button' onClick={newCategory}>New category</button>
        </div>
      ) : <></>
    );
  }

  function AddCategory(){
    const name = useRef("");
    const weight = useRef(0);
    const balance = useRef(0);

    const url = `${api}/newCategory`;

    const add = () => {
      const apiKey = localStorage.getItem("apiKey");

      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        userid: localStorage.getItem('userId'),
        name: name.current,
        weight: weight.current,
        balance: balance.current
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        setShow(false);
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className="form-container">
        Category Name: <input type='text' onChange={(e) => {name.current = e.target.value}}></input><br/>
        Weight: <input type='number' onChange={(e) => {weight.current = e.target.value}}></input><br/>
        Balance: <input type='number' onChange={(e) => {balance.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
      </div>
    )
  }

  function Modal({ func }){
    return(
      show ? <div className="modal">
        <div className="ovelay"></div>
        <div className='modal-content'>
          {func}
        </div>
      </div> : <></>
    )
  }

  return ( //main
    <div>
      <div style={{display: !show ? 'none' : 'block'}}>
        <Modal func={func}/>
      </div>
      <div style={{display: !login ? 'none' : 'block'}}>
        <Categories/>
      </div>
    </div>
  );
}

export default App;
