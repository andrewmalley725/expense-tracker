/* eslint-disable jsx-a11y/anchor-is-valid */
import './styles.css';
import axios from 'axios';
import { useState, useRef } from 'react';

function App(){
  const api = 'https://finance-app-flask-afh4ecdnpq-uc.a.run.app';
  //const api = 'http://localhost:5000';
  const [show, setShow] = useState(localStorage.getItem('user') ? false : true);
  const [func, setFunc] = useState(<Login/>);
  const [login, setLogin] = useState(localStorage.getItem('user') ? true : false);

  // if (localStorage.getItem('user')){
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const apiKey = localStorage.getItem('apiKey');
  //   const _id = user._id;
  //   const payload = {
  //     headers: {
  //       'x-api-key': apiKey
  //     }
  //   };

  //   axios.get(`${api}/data/${_id}`, payload).then(res => {
  //     localStorage.setItem('user', JSON.stringify(res.data.user));
  //     window.location.reload();
  //   })
  // }

  function NewAcc(){
    const username = useRef("");
    const password = useRef("");
    const firstname = useRef("");
    const lastname = useRef("");

    const submit = () => {

      setShow(false);

      const body = {
        username: username.current,
        firstname: firstname.current,
        lastname: lastname.current,
        password: password.current,
      };

      axios.post(`${api}/addUser`, body).then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem("apiKey", res.data.apiKey);
        setLogin(true);
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
      setShow(false);
      axios.post(`${api}/authenticate`, body).then(res => {
        if (res.data.status === 'successfully logged in'){
          setLogin(true);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem("apiKey", res.data.apiKey);
          window.location.reload();
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
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

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

    const viewIncome = () => {
      setFunc(<Paychecks/>);
      setShow(true);
    }

    function del(rec){
      const apiKey = localStorage.getItem('apiKey');
      const payload = {
        headers: {
          'x-api-key': apiKey
        }
      }
      axios.delete(`${api}/deleteCategory/${user._id}?category=${rec.account_name}`, payload).then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload();
      })
    }

    return (
      user && user.accounts ? (
        <div className="categories-container">
          <h2>Welcome {`${user.firstname} ${user.lastname}`}</h2>
          <h2>Current Total Balance: ${user.balance.toFixed(2)}</h2>
          <button type='button' onClick={newCategory}>New category</button>
          <button type='button' onClick={addFunds}>Add funds</button>
          <button type='button' onClick={addExpense}>Add expense</button>
          <button type='button' onClick={viewTransactions}>View transactions</button>
          <button type='button' onClick={viewIncome}>View income</button>
          <button type='button' onClick={logout}>Logout</button>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Weight</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {user.accounts ? user.accounts.reverse().map(rec => (
                <tr>
                  <td>{rec.account_name}</td>
                  <td>{(rec.weight * 100).toFixed(1)}%</td>
                  <td>${(rec.balance * 1.0).toFixed(2)}</td>
                  {rec.account_name !== 'Unallocated funds' ? <td><button type='button' onClick={() => del(rec)}>DELETE</button></td> : <td></td>}
                </tr>
              )) 
              : <></>}
              <tr>
                <td>
                  <b>
                    TOTAL
                  </b>
                </td>
                <td><b>100%</b></td>
                <td>
                  <b>
                    ${(user.balance * 1).toFixed(2)}
                  </b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : !login ? <h1>Loading Data...</h1> : <></>
    );
  }

  function AddCategory(){
    const name = useRef("");
    const weight = useRef(0);
    const apiKey = localStorage.getItem("apiKey");
    const user = JSON.parse(localStorage.getItem('user'));

    const url = `${api}/addCategory/${user._id}`;

    const add = () => {

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
        <button type='button' onClick={add}>Add</button>
        <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
      </div>
    )
  }

  function Payday(){
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

  function Expense(){
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

  function Transactions(){
    const [desc, setDesc] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const orderDescription = () => {
      setDesc(!desc);
    };

    const orderDate = () => {
      setDesc(!desc);
    };

    const orderAccount = () => {
      setDesc(!desc);
    };

    const orderAmount = () => {
      setDesc(!desc);
    };

    const getSum = () => {
      if (user.transactions && user.transactions.length > 0) {
        let total = 0;
        for (let i of user.transactions){
          total += i.amount;
        }
        return total;
      }
      return 0;
    };

    return(
      <div className='categories-container' style={{overflow: 'scroll', maxHeight: '300px'}}>
        <button type='button' onClick={() => {setShow(false); setLogin(true); setDesc(true)}}>Close</button>
        <p>(Click to order by)</p>
        <table>
          <thead>
            <th><button onClick={orderDescription}>Expense</button></th>
            <th><button onClick={orderDate}>Date</button></th>
            <th><button onClick={orderAccount}>Account</button></th>
            <th><button onClick={orderAmount}>Amount</button></th>
          </thead>
          <tbody>
            {
              user.transactions ? user.transactions.map(rec => (
                <tr>
                  <td>{rec.description}</td>
                  <td>{new Date(rec.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                  <td>{rec.account_name}</td>
                  <td>${rec.amount}</td>
                </tr>
              )) : <></>
            }
            <tr>
              <td><b>TOTAL</b></td>
              <td></td>
              <td></td>
              <td><b>${getSum()}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  function Paychecks(){
    const user = JSON.parse(localStorage.getItem("user"));

    const getSum = () => {
      if (user.income && user.income.length > 0) {
        let total = 0;
        for (let i of user.income){
          total += i.amount;
        }
        return total;
      }
      return 0;
    };

    return(
      <div className='categories-container' style={{overflow: 'scroll', maxHeight: '300px'}}>
        <button type='button' onClick={() => {setShow(false); setLogin(true)}}>Close</button>
        {/* <p>(Click to order by)</p> */}
        <table>
          <thead>
            <th><button>Description</button></th>
            <th><button>Date</button></th>
            <th><button>Amount</button></th>
          </thead>
          <tbody>
            {
              user.income ? user.income.map(rec => (
                <tr>
                  <td>{rec.description}</td>
                  <td>{new Date(rec.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                  <td>${rec.amount}</td>
                </tr>
              )) : <></>
            }
            <tr>
              <td><b>TOTAL</b></td>
              <td></td>
              <td><b>${getSum()}</b></td>
            </tr>
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
