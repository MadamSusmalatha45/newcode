import React, { useEffect, useState } from "react";
import { Box, FormControl, Grid, Link, FormLabel, Modal, Typography, Button } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Controller, useForm } from "react-hook-form";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import { getAPI, postAPI, patchAPI, deleteAPI } from "../../network";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';
import BasicSelector from "../../common/Selector";

import { checkAuthority, formatDate, validation, tableHeader, tableData, tablebtn } from "../../utils";
import Loader from "../../common/Loader";
import EmptyTable from "../../common/EmptyTable";
import { Security } from "@material-ui/icons";

export default function RiskCategory() {
  const [open, setOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [opencat, setOpencat] = useState(false);
  const [editId, setEditId] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);
  const [showcat, setShowcat] = useState(false);
  const [loader, setLoader] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [optionCategory, setOptioncategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [option, setOptions] = useState([])
  const [person, setPerson] = useState({
    name: '',
    nameError: false,
  })
  const [optionval, setOptionval] = useState({
    name: '',
    option: [],
    nameError: false,
    optionError: false,

  })
  const [catOption,setCatOption]=useState({
    name: '',
    nameError: false,
  })



  useEffect(() => {
    getRiskAssesmentCategory();
    getRiskCategory()
    getOptions()
    getCategoryOptions()
  }, []);

  const getRiskAssesmentCategory = async () => {
    setLoader(true)
    let data = await getAPI('/risk-assessment/category');
    if (data) {
      setCategory(data)
    }
    setLoader(false)
  }



  const handleChangePage = () => { };

  const handleChangeRowsPerPage = () => { };

  const TablePaginationActions = () => { };


  const addLicense = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOpen(true)
  }

  const editlicense = (e, id) => {

    e.preventDefault();
    setEditId(id)
    clearAll();
    let data = category.filter(item => item.id === id)[0];
    setPerson(prevState => ({
      ...prevState,
      name: data?.name,
      nameError: false,
    }))

    // console.log(person)

    // getCities(data.country)
    setAction('edit');
    setOpen(true)

  }

  const deleteCompany = (id) => {

    setEditId(id);
    clearAll();
    setShow(true);
  }

  const clearAll = () => {
    setPerson({
      name: '',
      nameError: false,
    })
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleShowClose = () => {
    setShow(false);
    setShowcat(false);
    setShowOption(false);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setPerson(prevState => ({
      ...prevState,
      nameError: false,
    }))

    if (validation(null, 'Name', person.name)) {
      setPerson(prevState => ({
        nameError: true,
      }))
      return;
    }

    let payload = {
      name: person.name,
    }


    if (action === 'add') {
      setLoader(true)
      let data = await postAPI('/risk-assessment/category', payload)
      //  console.log(data,"data")
      if (data) {
        getRiskAssesmentCategory()
        setOpen(false)
      }
      setLoader(false)
    }
    else {
      setLoader(true)
      let data = await patchAPI(`/risk-assessment/category/${editId}`, payload)
      if (data) {
        getRiskAssesmentCategory()
        setOpen(false)
      }
      setLoader(false)
    }
  }

  const handleDelete = async () => {
    setLoader(true);
    let process = await deleteAPI(`/risk-assessment/category/${editId}`);
    setLoader(false);
    if (process) {
      getRiskAssesmentCategory();
      setShow(false)
    }
  }



  // -----Add delete update Category---------------------------------------------------------------
  const getOptions = async () => {
    setLoader()
    let data = await getAPI('/risk-assessment-choice-option')
    if (data) {
      let outputs = data.map((item) => ({
        id: item.id,
        label: item.name,
        value: item.id

      }))
      setOptions(outputs)


    }
    setLoader()
  }
  const getRiskCategory = async () => {
    setLoader(true)
    let data = await getAPI('/risk-assessment-question-choice');
    if (data) {
      setCategoryOption(data)
    }
    setLoader(false)
  }

  const editCat = (e, id) => {
    e.preventDefault();
    setEditId(id)
    clearAll();
    let data = optionCategory.filter(item => item.id === id)[0];
    console.log("DATA-----", data)
    setOptionval(prevState => ({
      ...prevState,
      name: data?.name,
      option: data?.options._id,
      nameError: false,
      optionError: false
    }))

    // console.log(person)

    // getCities(data.country)
    setAction('edit');
    setOpencat(true)
  }

  const clearAllcat = () => {
    setOptionval({
      name: '',
      option: [],
      nameError: false,
      optionError: false,
    })
  }

  const deleteCat = (id) => {
    setEditId(id);
    clearAllcat();
    setShowcat(true);
  }
  const Closecat = () => {
    setOpencat(false)
  }
  const addCat = (e) => {
    e.preventDefault();
    setAction('add');
    clearAllcat();
    setOpencat(true)
  }

  const SubmitCat = async (e) => {
    e.preventDefault();
    setOptionval(prevState => ({
      ...prevState,
      nameError: false,
      optionError: false
    }))

    if (validation(null, 'Name', optionval.name)) {
      setOptionval(prevState => ({
        nameError: true,
      }))
      return;
    }
    else if (validation('array', 'Option', optionval.option)) {
      setOptionval(prevState => ({
        ...prevState,
        optionError: true,
      }))
      return;
    }
    var ids = optionval.option.map((item) => {
      return item.value
    });

    let payload = {
      name: optionval.name,
      options: ids,
    }
    console.log(payload, "++++++++Payload for choices")


    if (action === 'add') {
      setLoader(true)
      let data = await postAPI('/risk-assessment-question-choice', payload)
      //  console.log(data,"data")
      if (data) {
        getRiskCategory()
        setOpencat(false)
      }
      setLoader(false)
    }
    else {
      setLoader(true)
      let data = await patchAPI(`/risk-assessment-question-choice/${editId}`, payload)
      if (data) {
        getRiskCategory()
        setOpencat(false)
      }
      setLoader(false)
    }
  }

  const handleDeletecat = async () => {
    setLoader(true);
    let process = await deleteAPI(`/risk-assessment-question-choice/${editId}`);
    setLoader(false);
    if (process) {
      getRiskCategory();
      setShowcat(false)
    }
  }

  // -----Add delete update Category Options---------------------------------------------------------------
  const getCategoryOptions = async () => {
    setLoader(true)
    let data = await getAPI('/risk-assessment-choice-option');
    if (data) {
      setOptioncategory(data)
    }
    setLoader(false)
  }


  const addOption = (e) => {
    e.preventDefault();
    setAction('add');
    clearAll();
    setOptionOpen(true)
  }

  const editOption = (e, id) => {

    e.preventDefault();
    setEditId(id)
    clearAll();
    let data = optionCategory.filter(item => item.id === id)[0];
    setCatOption(prevState => ({
      ...prevState,
      name: data?.name,
      nameError: false,
    }))

    // console.log(person)

    // getCities(data.country)
    setAction('edit');
    setOptionOpen(true)

  }

  const deleteOption = (id) => {
    setEditId(id);
    clearAll();
    setShowOption(true);
  }


  const CloseOption = () => {
    setOptionOpen(false)
  }
 


  const SubmitOption = async (e) => {
    e.preventDefault();
    setCatOption(prevState => ({
      ...prevState,
      nameError: false,
    }))

    if (validation(null, 'Name', catOption.name)) {
      setCatOption(prevState => ({
        ...prevState,
        nameError: true,
      }))
      return;
    }

    let payload = {
      name: catOption.name,
    }


    if (action === 'add') {
      setLoader(true)
      let data = await postAPI('/risk-assessment-choice-option', payload)
      //  console.log(data,"data")
      if (data) {
        getCategoryOptions()
        setOptionOpen(false)
      }
      setLoader(false)
    }
    else {
      setLoader(true)
      let data = await patchAPI(`/risk-assessment-choice-option/${editId}`, payload)
      if (data) {
        getCategoryOptions()
        setOptionOpen(false)
      }
      setLoader(false)
    }
  }

  const DeleteOption = async () => {
    setLoader(true);
    let process = await deleteAPI(`/risk-assessment-choice-option/${editId}`);
    setLoader(false);
    if (process) {
      getCategoryOptions();
      setShowOption(false)
    }
  }







  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Secuber" subTitle="Risk Assessment Type" />
      {
        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ mx: 2 }}
        >
          <Button variant="contained" style={{ backgroundColor: "grey" }} sx={{ height: 50 }} onClick={addLicense}>
            <AddCircleIcon /> &nbsp; &nbsp;
            Add Risk Assessment Type
          </Button>
        </Box>
      }
      {
        checkAuthority('ADD_ASSESMENT') &&
        <Box display="flex" sx={{ my: "2rem" }}>
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header" align="center">
                  <TableCell align="left" component="th" sx={{ tableHeader, width: '25rem' }}>
                    Risk Assessment Type
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader} >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={tableData}>
                      <Link to="#" underline="none" className="link-hover">
                        {item.name}
                      </Link>
                    </TableCell>


                    <TableCell align="center" sx={tablebtn}>
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="info" sx={{ mx: 1 }} onClick={(e) => editlicense(e, item?.id)}>
                          <EditIcon className="btn" />
                        </Button>
                      }
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="error" onClick={() => deleteCompany(item?.id)}>
                          <DeleteIcon className="btn" />
                        </Button>
                      }
                    </TableCell>

                  </TableRow>
                ))}
                {
                  category.length === 0 &&
                  <EmptyTable colSpan={7} />
                }


              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={5}
                    count={category.length}
                    rowsPerPage={10}
                    page={0}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      }

      <PageTitle subTitle="Risk Assessment Options" />
      {
        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ mx: 2 }}
        >
          <Button variant="contained" style={{ backgroundColor: "grey" }} sx={{ height: 50 }} onClick={addCat}>
            <AddCircleIcon /> &nbsp; &nbsp;
            Add Risk Assessment Options
          </Button>
        </Box>
      }

      {
        checkAuthority('ADD_ASSESMENT_CATEGORY') &&

        <Box display="flex" sx={{ my: "2rem" }}>
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header" align="center">
                  <TableCell align="left" component="th" sx={{ tableHeader, width: '25rem' }}>
                    Risk Assessment
                  </TableCell>
                  <TableCell align="left" component="th" sx={{ tableHeader, width: '25rem' }}>
                    Options
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader} >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryOption.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={tableData}>
                      <Link to="#" underline="none" className="link-hover">
                        {item?.name}
                      </Link>
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {

                        item?.options.map((ele, i) => (

                          <span style={{ border: "1px solid gray", padding: "2px", margin: "2px" }}>{ele?.name}</span>

                        ))

                      }
                    </TableCell>
                    <TableCell align="center" sx={tablebtn}>
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="info" sx={{ mx: 1 }} onClick={(e) => editCat(e, item?.id)}>
                          <EditIcon className="btn" />
                        </Button>
                      }
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="error" onClick={() => deleteCat(item?.id)}>
                          <DeleteIcon className="btn" />
                        </Button>
                      }
                    </TableCell>

                  </TableRow>
                ))}
                {
                  category.length === 0 &&
                  <EmptyTable colSpan={7} />
                }


              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={5}
                    count={category.length}
                    rowsPerPage={10}
                    page={0}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>

      }



      <PageTitle subTitle="Risk Assessment Options" />
      {
        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ mx: 2 }}
        >
          <Button variant="contained" style={{ backgroundColor: "grey" }} sx={{ height: 50 }} onClick={addOption}>
            <AddCircleIcon /> &nbsp; &nbsp;
            Add Category Options
          </Button>
        </Box>
      }

      {
        checkAuthority('ADD_ASSESMENT_CATEGORY') &&

        <Box display="flex" sx={{ my: "2rem" }}>
          <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
            <Table
              sx={{ minWidth: "auto" }}
              aria-label="custom pagination table"
              className="responsive-table"
            >
              <TableHead>
                <TableRow className="table-header" align="center">
                  <TableCell align="left" component="th" sx={{ tableHeader, width: '25rem' }}>
                    Options
                  </TableCell>
                  <TableCell align="center" component="th" sx={tableHeader} >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log("optionCategory",optionCategory)} */}
                {optionCategory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={tableData}>
                      <Link to="#" underline="none" className="link-hover">
                        {item?.name}
                      </Link>
                    </TableCell>
                    <TableCell align="center" sx={tablebtn}>
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="info" sx={{ mx: 1 }} onClick={(e) => editOption(e, item?.id)}>
                          <EditIcon className="btn" />
                        </Button>
                      }
                      {
                        checkAuthority('ADD_ASSESMENT_CATEGORY') &&
                        <Button variant="outlined" className="btn-div" color="error" onClick={() => deleteOption(item?.id)}>
                          <DeleteIcon className="btn" />
                        </Button>
                      }
                    </TableCell>

                  </TableRow>
                ))}
                {
                  category.length === 0 &&
                  <EmptyTable colSpan={7} />
                }


              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    align="right"
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={5}
                    count={category.length}
                    rowsPerPage={10}
                    page={0}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>

      }

      <Dialog open={optionOpen} onClose={CloseOption} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>{action === 'add' ? 'Add' : 'Edit'} Option</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >


            <FormControl sx={{ minWidth: '97%', mx: 0, px: 0 }}>
              <TextField
                id="name"
                label="Option Name"
                variant="outlined"
                type="text"
                value={catOption.name}
                error={catOption.nameError}
                onChange={(data) => {
                  setCatOption(prevState => ({
                    ...prevState,
                    name: data.target.value,
                  }))
                }}
                fullWidth
                sx={{ m: 0 }}
              />
            </FormControl>
            
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={SubmitOption} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={CloseOption} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showOption} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Risk Assessment Option</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this  Option</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={DeleteOption} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>



      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>{action === 'add' ? 'Add' : 'Edit'} Risk Assessment Type</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >


            <FormControl sx={{ minWidth: '97%', mx: 0, px: 0 }}>
              <TextField
                id="name"
                label="Risk Category Name"
                variant="outlined"
                type="text"
                value={person.name}
                error={person.nameError}
                onChange={(data) => {
                  setPerson(prevState => ({
                    ...prevState,
                    name: data.target.value,
                  }))
                }}
                fullWidth
                sx={{ m: 0 }}
              />
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={handleSubmit} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* delete Modal */}
      <Dialog open={show} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Risk Assessment Type</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this Risk Category </h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={opencat} onClose={Closecat} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>{action === 'add' ? 'Add' : 'Edit'} Risk Assessment Option</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >


            <FormControl sx={{ minWidth: '97%', mx: 0, px: 0 }}>
              <TextField
                id="name"
                label="Risk Category Name"
                variant="outlined"
                type="text"
                value={optionval.name}
                error={optionval.nameError}
                onChange={(data) => {
                  setOptionval(prevState => ({
                    ...prevState,
                    name: data.target.value,
                  }))
                }}
                fullWidth
                sx={{ m: 0 }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: '97%', mt: 2 }}>
              <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>Options</span>

              <Select
                value={optionval.option}
                onChange={(data) => {
                  setOptionval(prevState => ({
                    ...prevState,
                    option: data,
                  }))
                }}
                isMulti
                name="permissions"
                className="basic-multi-select"
                classNamePrefix="select"
                error={optionval.optionError}
                options={option}
                style={{ zIndex: 900 }}
              />
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={SubmitCat} variant="contained">{action === 'add' ? 'Submit' : 'Update'}</Button>
          <Button onClick={Closecat} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showcat} onClose={handleShowClose} fullWidth={true}>
        <DialogTitle sx={{ mb: 4, textAlign: "center" }}>Delete Risk Assessment Option</DialogTitle>

        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <h3 style={{ textAlign: 'left', fontWeight: 'bold' }}>Do you want's to delete this Risk Assessment Option</h3>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mx: 4 }}>
          <Button onClick={handleDeletecat} variant="contained" color="error">Delete</Button>
          <Button onClick={handleShowClose} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
