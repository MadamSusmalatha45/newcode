import React, { useEffect, useState } from "react";
import {
  Box, Link, Button, Dialog, Skeleton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  TextField
} from "@mui/material";
import PageTitle from "../../common/PageTitle";
import TablePagination from "@mui/material/TablePagination";
import Table from '@mui/material/Table';
import InputLabel from '@mui/material/InputLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import { useDispatch, useSelector } from "react-redux";
import { selectSiteInspection } from "../../../features/sites/sitesSlice";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Controller, useForm } from "react-hook-form";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { getAPI, postAPI } from "../../network";
import Loader from "../../common/Loader";
import { checkAuthority, tableHeader, tableData, formatDate } from "../../utils";
import { BASE_URL } from "../../../constant";

export default function RiskAssessment() {
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = useState(false)
  const [report, setReport] = useState([])
  const [assessment, setAssessment] = useState([])
  const [all, setAll] = useState([])
  const [category, setCategory] = useState([])
  const [siteId, setSiteId] = useState('')
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10)
  const [categoryId, setCategoryId] = useState('')
  const [question, setQuestion] = useState('')
  const [questionError, setQuestionError] = useState(false)
  const [categoryIdError, setCategoryIdError] = useState(false)
  const [options, setOptions] = useState({
    category: '',
    subcategory: '',
    riskIdentified: '',
    likelihood: '',
    impact: '',
    riskRating: '',
    notes: '',
    categoryError: false,
    subcategoryError: false,
    riskIdentifiedError: false,
    likelihoodError: false,
    impactError: false,
    riskRatingError: false
  })

  useEffect(() => {
    getAssessmentCategory()
    getCategoryQuestions()
    getAssessmentReport()
    getCategoryOtion()
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    setOptions(prevState => ({
      ...prevState,
      categoryError: false,
      subcategoryError: false,
      riskIdentifiedError: false,
      likelihoodError: false,
      impactError: false,
      riskRatingError: false,
      questionError: false,
      categoryIdError: false
    }))

    const payload = {
      'riskAssementCategoryId': categoryId,
      'questions': question,
      'options': {
        'Category': options.category,
        'Sub-Category': options.subcategory,
        'Risk Identified': options.riskIdentified,
        'Likelihood': options.likelihood,
        'Impact': options.impact,
        'Risk Rating': options.riskRating,
      }
    }

    setLoader(true)
    let data = await postAPI(`/risk-assessment/category-question`, payload)
    console.log("data post-----------///////", data)
    if (data) {
      handleClose();
      ;
    }
    setLoader(false)

  };



  const getAssessmentCategory = async () => {
    setLoader(true)

    let process = await getAPI('/risk-assessment/category');

    if (process) {
      var categories = [];
      for (var i = 0; i < process.length; i++) {
        categories.push({ label: process[i].name, id: process[i].id })
        setCategoryId(process[0].id)
      }

      setCategory(categories);
    }
  }

  const getCategoryQuestions = async () => {

    setLoader(true)
    let data = await getAPI('/risk-assessment/category-question');
    // console.log('URL LINK','/user/reports' + generateUrl(dSId, dSDate, dEDate))

    if (data) {
     
      setAssessment(data)
      console.log("DATA+++++++++++++",data)
    }
    setLoader(false)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };





  const getAssessmentReport = async (id) => {
    setLoader(true)
    let data = await getAPI(`/risk-assessment-report`)
    if (data) {
    setReport(data)
    // console.log("data from report APi*******************", data)
    }
    setLoader(false)

  }
  const getCategoryOtion = async () => {
    setLoader(true)

    let data = await getAPI(`/risk-assessment/category-question/640881950cad11228cffcbb9`)
    console.log("All get DATA-------------", data)
    if (data) {

    }
    setLoader(false)
  }

  // const handleNavigateForm = (id, repId, inspId) => {
  //   console.log("-----------------------------------------", id, repId.inspId)
  //   navigate(`${window.location.pathname}/form/${id}/${repId}/${inspId}`);
  // }




  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="Risk Assessment Forms" subTitle="Physical Security Risk Assessment 
"/>
      <FormControl sx={{ m: 1, width: "30%" }}>
        <InputLabel id="site-label">Please Select Assessment Category</InputLabel>
        <Select
          labelId="site-label"
          value={categoryId}
          onChange={(data) => {
            setCategoryId(data.target.value)
          }}
          label="Please Select Site"
          displayEmpty
          style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderColor: "#707070" }}
        >

          {
            category.map((item, index) => (
              <MenuItem value={item.id} key={index}>{item.label}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <Box display="flex" sx={{ my: "4rem" }}>


        <TableContainer component={Paper} sx={{ mx: "0.8rem" }} >
          <Table sx={{ minWidth: 'auto' }} aria-label="custom pagination table" className="responsive-table">
            <TableHead >
              <TableRow className="table-header">
                <TableCell align="left" component="th" sx={{ width: '30px' }}>Sr No.</TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>Question</TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>Risk Category</TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>Risk Sub-Category</TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>Inherent Risk</TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>Likelihood</TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>Impact Type</TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>Rating</TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log("assessment+++++++++",assessment)}

              {
                assessment.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={tableData}>
                      {index}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.question}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.choices.map((data,i)=>(
                        <>
                        {data.name}
                        </>
                      ))}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.description}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.description}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.description}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.description}
                    </TableCell>
                    <TableCell align="left" sx={tableData}>
                      {item?.description}
                    </TableCell>

                  </TableRow>
                ))
              }
            </TableBody>
            {
              checkAuthority('ADD_SITE_INSPECTION') &&
              <TableFooter>
                <TableRow>
                  <TableCell colspan={2} sx={tableData} direction="column" justifyContent="left" onClick={handleClickOpen}>
                    <Link href="#" underline="none" >
                      <div className="custom-table-cell">
                        <span className="add-title">Add Questions</span>
                        <AddCircleIcon className="add-icon" fontSize="medium" />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableFooter>
            }

          </Table>
        </TableContainer>


        
        
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle align="center">Add Risk Assessment Question</DialogTitle>
          <DialogContent height={"500px"}>
            <Grid
              container
              spacing={2}
              mt={3}
              component="form">
              <Grid item xs={12} display="flex">

                <TextField
                  fullWidth
                  label="Question"
                  variant="outlined"
                  type="text"
                  required
                  onChange={(e) => {
                    setQuestion(e.target.value)
                    // console.log(e.target.value,"value")
                  }}
                  value={question}
                  sx={{ borderColor: red[100] }}
                  error={questionError}

                />
              </Grid>
              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Risk Category</InputLabel>


                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.category(e.target.value)
                  }}
                  value={options.categoryError}
                  error={options.categoryError}
                // helperText={errors.category ? errors.category?.message : null}
                >

                  {/* {allreports.map((item, index) => (
                        <MenuItem value={item?.id} key={index}>
                          {item?.name}
                        </MenuItem>
                      ))} */}
                </Select>


              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Risk Sub-Category</InputLabel>

                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.subcategory(e.target.value)
                  }}
                  value={options.subcategory}
                  error={options.subcategoryError}
                // helperText={errors.category ? errors.category?.message : null}
                >

                  {/* {allreports.map((item, index) => (
                        <MenuItem value={item?.id} key={index}>
                          {item?.name}
                        </MenuItem>
                      ))} */}
                </Select>

              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Inherent Risk</InputLabel>

                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.riskIdentified(e.target.value)
                  }}
                  value={options.riskIdentified}
                  error={options.riskIdentifiedError}
                // helperText={errors.category ? errors.category?.message : null}
                >

                  {/* {allreports.map((item, index) => (
                        <MenuItem value={item?.id} key={index}>
                          {item?.name}
                        </MenuItem>
                      ))} */}
                </Select>

              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Likelihood</InputLabel>

                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.likelihood(e.target.value)
                  }}
                  value={options.likelihood}
                  error={options.likelihoodError}
                // helperText={errors.category ? errors.category?.message : null}
                >

                  {/* {allreports.map((item, index) => (
                        <MenuItem value={item?.id} key={index}>
                          {item?.name}
                        </MenuItem>
                      ))} */}
                </Select>

              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Impact Type</InputLabel>

                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.impact(e.target.value)
                  }}
                  value={options.impact}
                  error={options.impactError}
                // helperText={errors.category ? errors.category?.message : null}
                >

                  {/* {allreports.map((item, index) => (
                        <MenuItem value={item?.id} key={index}>
                          {item?.name}
                        </MenuItem>
                      ))} */}
                </Select>

              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" m={0}>

                <InputLabel id="gender-label">Rating</InputLabel>

                <Select
                  fullWidth
                  labelId="gender-label"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    options.riskRating(e.target.value)
                  }}
                  value={options.riskRating}
                  error={options.riskRatingError}
                // helperText={errors.category ? errors.category?.message : null}
                >


                  <MenuItem value={'High'}>High</MenuItem>
                  <MenuItem value={'Low'}>Low</MenuItem>

                </Select>

              </Grid>




              <Grid item xs={12} display="flex">
                <InputLabel id="gender-label">Note</InputLabel>
                <TextField
                  fullWidth
                  label="Notes"
                  variant="outlined"
                  type="text"
                  required
                  onChange={(data) => {
                    options.notes(data.target.value)
                  }}
                  value={options.notes}
                  error={options.notesError}
                // helperText={errors.description ? errors.description?.message : null}
                />

              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              <Grid item xs={7} justifyContent="space-around" display="flex">
                <Button
                  disabled={false}
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button disabled={false} onClick={handleSubmit}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Box>
      {/* 
      <Box>
        <PageTitle title="Custom Reports" />

        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={tableHeader}>
                  Report Type
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Site
                </TableCell>
                <TableCell align="center" component="th" sx={tableHeader}>
                  Report Date
                </TableCell>

                <TableCell align="center" component="th" sx={tableHeader}>
                  Notes
                </TableCell>

                <TableCell align="center" component="th" sx={tableHeader}>
                  Export
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {console.log("Alll Data Of Report----", all)}
              {all.slice(page * perPage, page * perPage + perPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={tableData}>
                    {item?.reportTypeId?.name}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.siteId?.name}
                  </TableCell>

                  <TableCell align="center" sx={tableData} className="no-wrap">
                    {formatDate(item.createdAt)}
                  </TableCell>

                  <TableCell align="center" sx={tableData} className="wrap">
                    {item?.note}
                  </TableCell>
                 
                  <TableCell align="center" sx={tableData}>
                    <div className="pointer" >
                      <Link onClick={() => exportQue(item?.reportTypeId?._id, item?.siteId?._id, item?.userId?._id)}> Export File</Link>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={6}
                  count={all.length}
                  rowsPerPage={perPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
 */}


    </Box>

  );
}


