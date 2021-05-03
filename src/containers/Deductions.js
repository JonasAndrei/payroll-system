import axios from "axios";
import React, { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";

import Table from "../components/Table";
import TransitionsModal from "../components/Modal";

function Deductions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deductions, setDeductions] = useState({});
  const [deductionTitle, setDeductionTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const columnHeads = [
    {
      id: "title",
      label: "Description",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "options",
      label: "Options",
      disableSorting: true,
    },
  ];

  // Get deductions in the database
  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json")
      .then((response) => {
        setDeductions(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error);
      });
  }, []);

  // Modal toggler.
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    // Reset to default values.
    setDeductionTitle("");
    setAmount(0);

    setIsModalOpen(false);
    setIsUpdating(null);
  };

  /* ----- HANDLES ----- */
  // Submit handle
  const handleSubmit = (e) => {
    setIsLoading(true);
    if (isUpdating === null) {
      //Submit new deduction
      axios
        .post(
          "https://tup-payroll-default-rtdb.firebaseio.com/deductions.json",
          {
            title: deductionTitle,
            amount: parseFloat(amount),
          }
        )
        .then((response) => {
          // Submit the deduction to the existings deductions list.
          setDeductions({
            ...deductions,
            [response.data.name]: {
              title: deductionTitle,
              amount: parseFloat(amount),
            },
          });
          setIsLoading(false);

          // Close modal
          handleClose();
        })
        .catch((error) => {
          // Log the error if found || catched.
          console.log(error);
          setIsLoading(false);

          // Close modal
          handleClose();
        });
      e.preventDefault();
    } else {
      //Edit existing deduction
      axios
        .put(
          `https://tup-payroll-default-rtdb.firebaseio.com/deductions/${isUpdating}.json`,
          {
            title: deductionTitle,
            amount: parseFloat(amount),
          }
        )
        .then(() => {
          // Update the deduction to the existings deductions list.
          setDeductions({
            ...deductions,
            [isUpdating]: {
              title: deductionTitle,
              amount: amount,
            },
          });
          setIsLoading(false);
          // Close modal
          handleClose();
        })
        .catch((error) => {
          // Log the error if found || catched.
          console.log(error);
          setIsLoading(false);

          // Close modal
          handleClose();
        });
    }
  };

  // Delete handle
  const handleDelete = (key) => {
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

  // Edit handle
  const handleEdit = (key) => {
    const oldDeductionTitle = deductions[key].title;
    const oldAmount = deductions[key].amount;
    setDeductionTitle(oldDeductionTitle);
    setAmount(oldAmount);
    setIsUpdating(key);
    handleOpen();
  };

  // Handles change in Search Bar
  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.title.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  return (
    <div>
      <h1>Deductions Screen</h1>
      <Paper>
        <Toolbar>
          <TextField
            label="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create New
          </Button>
        </Toolbar>

        <div>
          <Table
            lists={deductions}
            onDeleteRow={handleDelete}
            onEditRow={handleEdit}
            filterFn={filterFn}
            columns={columnHeads}
            propertiesOrder={columnHeads.slice(0, 2).map((item) => item.id)}
            isLoading={isFetching}
          />
        </div>
      </Paper>

      <TransitionsModal handleClose={handleClose} isModalOpen={isModalOpen}>
        {!isLoading ? (
          <>
            <TextField
              value={deductionTitle}
              label="Deduction"
              onChange={(e) => setDeductionTitle(e.target.value)}
            />
            <TextField
              value={amount}
              label="Amount"
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              {isUpdating ? "Update" : "Submit"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </TransitionsModal>
    </div>
  );
}

export default Deductions;
