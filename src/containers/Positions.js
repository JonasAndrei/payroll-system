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

const Position = () => {
  const classes = useStyles();
  const [positions, setPositions] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        setPositions(response.data);
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
      .post("https://tup-payroll-default-rtdb.firebaseio.com/positions.json", {
        title: jobTitle,
        rate: ratePerHour,
      })
      .then((response) => {
        setPositions({
          ...positions,
          [response.data.name]: {
            rate: ratePerHour,
            title: jobTitle,
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
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${key}.json`
      )
      .then(() => {
        let filteredPositions = { ...positions };
        delete filteredPositions[key];
        setPositions(filteredPositions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  let positionsList = [];
  if (positions) {
    positionsList = (
      <Table
        lists={positions}
        onDeleteRow={deleteHandler}
        columns={["Position Title", "Rate Per Hour", "Options"]}
        propertiesOrder={["title", "rate"]}
      />
    );
  }

  return (
    <main className={classes.content}>
      <div className={classes.toolbar}/>
        <Input
          type="text"
          name="title"
          value={jobTitle}
          placeholder="Job Title"
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <Input
          type="number"
          name="rate"
          value={ratePerHour}
          placeholder="Rate Per Hour"
          onChange={(e) => setRatePerHour(e.target.value)}
        />
        <Button variant="contained" onClick={submitHandler}>Add</Button>

        <div>
          {isLoading && <LinearProgress color="secondary" />}
          {positionsList}
        </div>
    </main>
  );
};

export default Position;
