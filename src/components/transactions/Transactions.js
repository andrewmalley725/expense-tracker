import { useState } from "react";

export default function Transactions({setShow, setLogin}){
    const [desc, setDesc] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const [transactions, setTransactions] = useState(user.transactions);

    const orderDescription = () => {
      setDesc(!desc);
      let orderedTransactions = transactions.sort(function(a, b) {
        if (desc)
          return a.description.localeCompare(b.description);
        else
          return b.description.localeCompare(a.description);
      });
      setTransactions(orderedTransactions);
    };

    const orderDate = () => {
      setDesc(!desc);
      let orderedTransactions = transactions.sort(function(a, b) {
        if (desc)
          return new Date(a.date) - new Date(b.date)
        else
          return new Date(b.date)  - new Date(a.date)
      });
      setTransactions(orderedTransactions);
    };

    const orderAccount = () => {
      setDesc(!desc);
      let orderedTransactions = transactions.sort(function(a, b) {
        if (desc)
          return a.account_name.localeCompare(b.account_name);
        else
          return b.account_name.localeCompare(a.account_name);
      });
      setTransactions(orderedTransactions);
    };

    const orderAmount = () => {
      setDesc(!desc);
      let orderedTransactions = transactions.sort(function(a, b) {
        if (desc)
          return a.amount - b.amount
        else
          return b.amount  -a.amount
      });
      setTransactions(orderedTransactions);
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
              transactions ? transactions.map(rec => (
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