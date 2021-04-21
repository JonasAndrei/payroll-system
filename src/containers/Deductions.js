import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from '@material-ui/core/styles';
import Table from "../components/Table";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Deductions() {
  const classes = useStyles();
  const [deductions, setDeductions] = useState([]);
  const [deductionTitle, setDeductionTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json")
      .then((response) => {
        setDeductions(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const submitHandler = (e) => {
    setIsLoading(true);
    axios
      .post("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json", {
        title: deductionTitle,
        amount: amount,
      })
      .then((response) => {
        setDeductions({
          ...deductions,
          [response.data.name]: {
            title: deductionTitle,
            amount: amount,
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    e.preventDefault();
  };

  const deleteHandler = (key) => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/deductions/${key}.json`
      )
      .then(() => {
        let filteredPositions = { ...deductions };
        delete filteredPositions[key];
        setDeductions(filteredPositions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  let deductionsList = [];
  if (deductions) {
    deductionsList = (
      <Table
        lists={deductions}
        onDeleteRow={deleteHandler}
        columns={["Description", "Amount", "Options"]}
        propertiesOrder={["title", "amount"]}
      />
    );
  }

  return (
    <main className={classes.content}>
      <div className={classes.toolbar}/>
      <Input
        type="text"
        name="title"
        value={deductionTitle}
        placeholder="Description"
        onChange={(e) => setDeductionTitle(e.target.value)}
      />
      <Input
        type="number"
        name="amount"
        value={amount}
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button variant="contained" onClick={submitHandler}>Add</Button>

      <div>
      {isLoading ? (
        <LinearProgress color="secondary" />
      ) : deductions === null ? (
        <p>No Data</p>
      ) : (
        deductionsList
      )}
      </div>
    </main>
  );
}

export default Deductions;
