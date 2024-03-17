import { useState } from "react";

export default function Paychecks({setShow, setLogin}){
    const user = JSON.parse(localStorage.getItem("user"));
    const [desc, setDesc] = useState(true);
    const [income, setIncome] = useState(user.income);

    const orderDescription = () => {
      setDesc(!desc);
      let orderedTransactions = income.sort(function(a, b) {
        if (desc)
          return a.description.localeCompare(b.description);
        else
          return b.description.localeCompare(a.description);
      });
      setIncome(orderedTransactions);
    };

    const orderDate = () => {
      setDesc(!desc);
      let orderedTransactions = income.sort(function(a, b) {
        if (desc)
          return new Date(a.date) - new Date(b.date)
        else
          return new Date(b.date)  - new Date(a.date)
      });
      setIncome(orderedTransactions);
    };

    const orderAmount = () => {
      setDesc(!desc);
      let orderedTransactions = income.sort(function(a, b) {
        if (desc)
          return a.amount - b.amount
        else
          return b.amount  -a.amount
      });
      setIncome(orderedTransactions);
    };

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
        <p>(Click to order by)</p>
        <table>
          <thead>
            <th><button onClick={orderDescription}>Description</button></th>
            <th><button onClick={orderDate}>Date</button></th>
            <th><button onClick={orderAmount}>Amount</button></th>
          </thead>
          <tbody>
            {
              income ? income.map(rec => (
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