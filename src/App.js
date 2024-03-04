import './styles.css';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

//localStorage.clear();

function App(){
  const api = 'https://sample-project-667a4.web.app/api';
  const [show, setShow] = useState(localStorage.getItem('userId') ? false : true);
  const [func, setFunc] = useState(<Login/>);
  const [login, setLogin] = useState(localStorage.getItem('userId') ? true : false);

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
        setShow(false);
        setLogin(true);
      })
      .catch(error => console.log(error));
    }

    return(
      <div className="form-container">
        First Name: <input type='text' onChange={(e) => firstname.current = e.target.value}></input><br/>
        Last Name: <input type='text' onChange={(e) => lastname.current = e.target.value}></input><br/>
        Email: <input type='text' onChange={(e) => email.current = e.target.value}></input><br/>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='password' onChange={(e) => password.current = e.target.value}></input><br/>
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
          setShow(false);
          setLogin(true);
        }
        else {
          setMsg(res.data.status);
        }
      })
    }
    return(
      <div className="form-container">
        <h4>Expense tracker login</h4>
        <p style={{color: 'red'}}>{msg}</p>
        Username: <input type='text' onChange={(e) => username.current = e.target.value}></input><br/>
        Password: <input type='password' onChange={(e) => password.current = e.target.value}></input><br/>
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
      setShow(true);
      //console.log(show);
    }

    const addFunds = () => {
      setFunc(<Payday/>);
      setShow(true);
    }

    const addExpense = () => {
      setFunc(<Expense/>);
      setShow(true);
    }

    const logout = () => {
      localStorage.clear();
      setFunc(<Login/>);
      setLogin(false);
      setShow(true);
    }

    const viewTransactions = () => {
      setFunc(<Transactions/>);
      setShow(true);
    }

    const calculateTotalWeight = () => {
      if (data && data.accounts){
        return data.accounts.reduce((total, rec) => total + rec.weight, 0);
      }
    };

    return (
      data ? (
        <div className="categories-container">
          <h2>Welcome {data.user}</h2>
          <h2>Current Total Balance: ${data.total_balance}</h2>
          <button type='button' onClick={newCategory}>New category</button>
          <button type='button' onClick={addFunds}>Add funds</button>
          <button type='button' onClick={addExpense}>Add expense</button>
          <button type='button' onClick={viewTransactions}>View transactions</button>
          <button type='button' onClick={logout}>Logout</button>
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
                  <td>{(rec.weight * 100).toFixed(0)}%</td>
                  <td>${rec.balance.toFixed(2)}</td>
                </tr>
              )) 
              : <></>}
              <tr>
                <td>
                  <b>
                    TOTAL
                  </b>
                </td>
                <td><b>{(calculateTotalWeight() * 100).toFixed(0)}%</b></td>
                <td>
                  <b>
                    ${(data.total_balance * calculateTotalWeight()).toFixed(2)}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : <></>
    );
  }

  function AddCategory(){
    const name = useRef("");
    const weight = useRef(0);
    const balance = useRef(0);

    const url = `${api}/newCategory`;

    // console.log(show);

    const add = () => {
      const apiKey = localStorage.getItem("apiKey");

      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        userid: localStorage.getItem('userId'),
        name: name.current,
        weight: parseFloat(weight.current) / 100,
        balance: parseFloat(balance.current)
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        setShow(false);
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className="form-container">
        <h4>New category</h4>
        Category Name: <input type='text' onChange={(e) => {name.current = e.target.value}}></input><br/>
        Weight: %<input type='number' onChange={(e) => {weight.current = e.target.value}}></input><br/>
        Balance: <input type='number' onChange={(e) => {balance.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => setShow(false)}>Close</button>
      </div>
    )
  }

  function Payday(){
    const [data, setData] = useState({});
    const accountid = useRef(null);
    const amount = useRef(0);
    const description = useRef("");
    const url = `${api}/payday`;

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

    const add = () => {
      const apiKey = localStorage.getItem("apiKey");

      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        userid: localStorage.getItem("userId"),
        accountid: parseInt(accountid.current) || null,
        amount: parseFloat(amount.current),
        description: description.current
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        setShow(false);
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className='form-container'>
        <h4>Add funds</h4>
        {/* Account: <select onChange={(e) => accountid.current = e.target.value}>
          <option selected disabled>Select a category to allocate money to (if any)</option>
          <option value={null}>None</option>
          {
            data.accounts ? data.accounts.map(rec => {
              return(
                <option value={rec.accountid}>{rec.account_name}</option>
              )
            }) : <></>
          }
        </select><br/> */}
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        Description: <input type='text' onChange={(e) => {description.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => setShow(false)}>Close</button>
      </div>
    )
  }

  function Expense(){
    const [data, setData] = useState({});
    const accountid = useRef(null);
    const amount = useRef(0);
    const description = useRef("");
    const url = `${api}/newExpense`;

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

    const add = () => {
      const apiKey = localStorage.getItem("apiKey");

      const headers = {
        'x-api-key': apiKey
      }

      const body = {
        userid: localStorage.getItem("userId"),
        accountid: parseInt(accountid.current) || null,
        amount: parseFloat(amount.current),
        description: description.current
      };

      axios.post(url, body, { headers }).then(res => {
        console.log('added');
        setShow(false);
      })
      .catch(error => {console.log(error)});
    }

    return(
      <div className='form-container'>
        <h4>Add expense</h4>
        Account: <select onChange={(e) => accountid.current = e.target.value}>
          <option selected disabled>Select a category</option>
          <option value={null}>None</option>
          {
            data.accounts ? data.accounts.map(rec => {
              return(
                <option value={rec.accountid}>{rec.account_name}</option>
              )
            }) : <></>
          }
        </select><br/>
        Amount: $<input type='number' onChange={(e) => {amount.current = e.target.value}}></input><br/>
        Description: <input type='text' onChange={(e) => {description.current = e.target.value}}></input><br/>
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => setShow(false)}>Close</button>
      </div>
    )
  }

  function Transactions(){
    const [data, setData] = useState({});
    const url = `${api}/userExpenses`;

    useEffect(() => {
      const uid = localStorage.getItem("userId");
      const apiKey = localStorage.getItem("apiKey");
      
      if (uid){
        const payload = {
          headers: {
            'x-api-key': apiKey
          }
        }
        axios.get(`${url}/${uid}`, payload).then(res => {
          setData(res.data);
        });
    }
    }, [url]);

    return(
      <div className='categories-container' style={{overflow: 'scroll', maxHeight: '300px'}}>
        <button type='button' onClick={() => setShow(false)}>Close</button>
        <table>
          <thead>
            <th>Expense</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Date</th>
          </thead>
          <tbody>
            {
              data.transactions ? data.transactions.map(rec => (
                <tr>
                  <td>{rec.description}</td>
                  <td>${rec.amount}</td>
                  <td>{rec.account_name}</td>
                  <td>{`${new Date(rec.date).getUTCMonth() + 1}-${new Date(rec.date).getUTCDate()}-${new Date(rec.date).getUTCFullYear()}`}</td>
                </tr>
              )) : <></>
            }
          </tbody>
        </table>
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
