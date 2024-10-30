import React, { useState } from "react";
import { useRef } from "react";
import "./styles.css";

function Main() {
  const [names, setNames] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inputs, setInputs] = useState({
    amount: "",
    paidBy: "",
    participants: [],
  });
  const [transactions, setTransactions] = useState([]); // New state to hold detailed transactions
  const amtRef = useRef(null);
  const pdRef = useRef(null);

  const handleAddPerson = () => {
    const name = document.getElementById("name").value;
    if (name.trim() !== "") {
      setNames([...names, name]);
    }
    document.getElementById("name").value = "";
  };

  const handleInputChange = (event) => {
    const { id, value, type } = event.target;
    if (type === "checkbox") {
      const participants = [...inputs.participants];
      if (event.target.checked) {
        participants.push(id);
      } else {
        participants.splice(participants.indexOf(id), 1);
      }
      setInputs({ ...inputs, participants });
    } else {
      setInputs({ ...inputs, [id]: value });
    }
  };

  const handleAddExpense = () => {
    const { amount, paidBy, participants } = inputs;
    if (
      amount &&
      paidBy &&
      participants.length > 0 &&
      participants.includes(paidBy)
    ) {
      const amountValue = parseFloat(amount);
      const share = (amountValue / participants.length).toFixed(2);
      const newExpenses = [...expenses];
      participants.forEach((participant) => {
        const index = names.indexOf(participant);
        if (participant === paidBy) {
          newExpenses[index] =
            (newExpenses[index] || 0) + share * (participants.length - 1);
        } else {
          newExpenses[index] = (newExpenses[index] || 0) - share;
        }
      });
      setExpenses(newExpenses);
      generateTransactions(newExpenses); // Call function to create detailed transactions
      clr();
    } else {
      alert("Please enter valid values first");
    }
  };

  // Function to generate detailed transactions
  const generateTransactions = (balances) => {
    const transactionList = [];
    const creditors = []; // People who are owed money
    const debtors = []; // People who owe money

    balances.forEach((balance, index) => {
      if (balance > 0) creditors.push({ name: names[index], amount: balance });
      if (balance < 0) debtors.push({ name: names[index], amount: -balance });
    });

    // Match debtors with creditors
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      transactionList.push({
        payer: debtor.name,
        payee: creditor.name,
        amount: amount.toFixed(2),
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    setTransactions(transactionList);
  };

  const clr = () => {
    setInputs({ amount: "", paidBy: "", participants: [] });
    amtRef.current.value = "";
    pdRef.current.value = "";
  };

  const isAddExpenseDisabled = !(
    inputs.amount &&
    inputs.paidBy &&
    inputs.participants.length > 0 &&
    inputs.participants.includes(inputs.paidBy)
  );

  const [activeDiv, setActiveDiv] = useState("adperson");

  const handleButtonClick = (id) => {
    setActiveDiv(id);
  };

  return (
    <div className="main">
      <div className="btnm">
        <button className="btns" onClick={() => handleButtonClick("adperson")}>
          People
        </button>
        <button className="btns" onClick={() => handleButtonClick("expenses")}>
          Expenses
        </button>
        <button className="btns" onClick={() => handleButtonClick("summary")}>
          Summary
        </button>
      </div>
      <div className={`divs ${activeDiv === "adperson" ? "active" : ""}`}>
        <h1>Bills</h1>
        <h2>Add Persons</h2>
        <div>
          <h3>Enter person's name:</h3>
          <input type="text" id="name" placeholder="Enter Person Name" />
          <br />
          <br />
          <button className="btns" onClick={handleAddPerson}>
            Add Person
          </button>
        </div>
        <ol>
          {names.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ol>
      </div>
      <div className={`divs ${activeDiv === "expenses" ? "active" : ""}`}>
        <h2>Expenses</h2>
        <div>
          <h3>Enter expense amount:</h3>
          <input
            type="number"
            id="amount"
            value={inputs.amount}
            onChange={handleInputChange}
            ref={amtRef}
          />
        </div>
        <div>
          <h3>Paid by:</h3>
          <select
            id="paidBy"
            value={inputs.paidBy}
            onChange={handleInputChange}
            ref={pdRef}
          >
            <option value="">-- Select --</option>
            {names.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Participating persons:</h3>
          {names.map((name, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={name}
                checked={inputs.participants.includes(name)}
                onChange={handleInputChange}
              />
              <label htmlFor={name}>{name}</label>
            </div>
          ))}
        </div>
        <button onClick={handleAddExpense} disabled={isAddExpenseDisabled}>
          Add Expense
        </button>
      </div>
      <div className={`divs ${activeDiv === "summary" ? "active" : ""}`}>
        <h2>Summary</h2>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.payer} owes {transaction.payee} ${transaction.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;