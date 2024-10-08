import axios from 'axios';
import AddCategory from './AddCategory';
import Payday from '../income/Payday';
import Expense from '../transactions/Expense';
import Transactions from '../transactions/Transactions';
import Paychecks from '../income/Paychecks';
import Login from '../users/Login';
import { useState } from 'react';
import TransferFunds from '../transactions/TransferFunds';
import AddBalance from '../income/AddBalance';

export default function Categories({api, setFunc, setShow, setLogin}){
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [isLoading, setLoading] = useState(false);


    const newCategory = () => {
      setFunc(<AddCategory api={api} setShow={setShow} setLogin={setLogin}/>);
      setShow(true);
      //console.log(show);
  }

    const addFunds = () => {
      setFunc(<Payday api={api} setShow={setShow} setLogin={setLogin}/>);
      setShow(true);
    }

    const logout = () => {
      localStorage.clear();
      setFunc(<Login api={api} setShow={setShow} setFunc={setFunc} setLogin={setLogin}/>);
      setLogin(false);
      setShow(true);
    }

    const viewTransactions = () => {
      setFunc(<Transactions setShow={setShow} setLogin={setLogin}/>);
      setShow(true);
    }

    const viewIncome = () => {
      setFunc(<Paychecks setShow={setShow} setLogin={setLogin}/>);
      setShow(true);
    }

    function addExpense(rec) {
      const name = rec.account_name;
      setFunc(<Expense api={api} setShow={setShow} setLogin={setLogin} account={name}/>);
      setShow(true);
    }

    function transferFunds(rec) {
      const name = rec.account_name;
      setFunc(<TransferFunds api={api} setShow={setShow} setLogin={setLogin} account={name}/>);
      setShow(true);
    }

    function addBalance(rec){
      const name = rec.account_name;
      setFunc(<AddBalance api={api} setShow={setShow} setLogin={setLogin} category={name}/>)
      setShow(true);
    }

    function del(rec){
      setLoading(true);
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
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {user.accounts ? user.accounts.reverse().map(rec => (
                <tr>
                  <td>{rec.account_name}</td>
                  <td>{(rec.weight * 100).toFixed(1)}%</td>
                  <td>${(rec.balance * 1.0).toFixed(2)}</td>
                  <td><button type='button' onClick={() => addExpense(rec)}>Add expense</button></td>
                  <td><button type='button' onClick={() => transferFunds(rec)}>Transfer</button></td>
                  <td><button type='button' onClick={() => addBalance(rec)}>ADD</button></td>
                  {rec.account_name !== 'Unallocated funds' ? <td><button type='button' onClick={() => del(rec)} style={{display: isLoading ? 'none' : 'block'}}>DELETE</button></td> : <td></td>}
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
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : !localStorage.getItem('user') ? <h1>Loading Data...</h1> : <></>
    );
  }