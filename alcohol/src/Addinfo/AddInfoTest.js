import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Check from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// material-ui
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    useMediaQuery,
    Select,
    MenuItem,
    ThemeProvider,
    createTheme,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from '../Login/useScriptRef';
import AnimateButton from '../Login/AnimateButton';
import { strengthColor, strengthIndicator } from '../Login/password-strength';
import { setCookie } from '../Common/Cookies';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { addr } from '../Common/serverAddr';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const AddInfoTest = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const { state } = useLocation();

    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const classes = useStyles();
    const [passwordConfirm, setPasswordConfirm] = useState(false);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const changePasswordConfirm = (pw, pwconfirm) => {
        if (pw === pwconfirm) {
            setPasswordConfirm(true);
        } else {
            setPasswordConfirm(false);
        }
    };

    const navigate = useNavigate();

    const finalTheme = createTheme({
        components: {
            MuiChip: {
                styleOverrides: {
                    root: ({ theme }) =>
                        theme.unstable_sx({
                            // https://mui.com/system/getting-started/the-sx-prop/#spacing
                            px: 1,
                            py: 0.25,
                            // https://mui.com/system/borders/#border-radius
                            borderRadius: 1, // 4px as default.
                        }),
                    label: {
                        padding: 'initial',
                    },
                    icon: ({ theme }) =>
                        theme.unstable_sx({
                            mr: 0.5,
                            ml: '-2px',
                        }),
                },
            },
        },
    });

    useEffect(() => {
        changePassword('123456');
    }, []);





    const [checked, setChecked] = useState([]);

    const [full, setFull] = useState(false);

    useEffect(() => {
        console.log(checked);
    }, [checked])

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];



        if (checked.length > 2 && currentIndex === -1) {
            alert('3???????????? ?????????!');
            setFull(true);
        } else {
            setFull(false);
            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            setChecked(newChecked);
        }


    };

    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        fetch(addr + '/alcohol/category', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json())
            .then((res) => {
                let i = 0;
                for (i; i < res.length; i++) {
                    const alcho = { id: res[i].id, category: res[i].category };
                    setItemList(itemList => [...itemList, alcho]);
                }

            })
    }, [])

    return (
        <div>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">?????? ???????????? ?????? ????????????</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{                    
                    nickname: '',
                    age: '',
                    birth: '',
                    sex: 'M',
                    job: '',
                    maxPrice: '',
                    FavorList: new Array(),
                    loginType: 'd',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    nickname: Yup.string().min(2, "2?????? ?????? ???????????????").max(8, "8?????? ????????? ???????????????.").matches(/^[???-???a-zA-z0-9]*$/, { message: "????????? ????????? ???????????? ????????????." }).required('???????????? ???????????????'),
                    age: Yup.number({ message: '????????? ???????????????.' }).max(100, "100????????? ???????????????.").required('????????? ???????????????'),
                    birth: Yup.date().required('????????? ???????????????'),
                    maxPrice: Yup.number().min(1000, '1000??? ?????? ???????????????').max(99999999, '1?????? ???????????? ???????????????').required('?????? ?????? ????????? ???????????????'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        console.log("?");
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);

                            fetch(addr + '/user/insert', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    name: state.name,
                                    email: state.email,
                                    loginType: state.loginType,
                                    age: values.age,
                                    birth: values.birth,
                                    nickname: values.nickname,
                                    sex: values.sex,
                                    job: values.job,
                                    userId: state.id,
                                    price: values.maxPrice,
                                    favorite: values.FavorList,
                                    password: '-'
                                }),
                            }).then(res => res.json())
                                .then((res) => {
                                    console.log(res.success);
                                    if (res.success) {
                                        alert("????????????");
                                        setCookie('myToken', res.token, {
                                            path: "/",
                                            secure: true,
                                            sameSite: "none"
                                        })

                                        navigate("/LoginTest");
                                    } else {
                                        alert("???????????? ??? ?????? ??????");
                                        return;
                                    }
                                })
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.nickname && errors.nickname)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <InputLabel htmlFor="outlined-adornment-nickname-register">?????????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-nickname-register"
                                type="text"
                                label="?????????"
                                value={values.nickname}
                                name="nickname"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.nickname && errors.nickname && (
                                <FormHelperText error id="standard-weight-helper-text-nickname-register">
                                    {errors.nickname}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.age && errors.age)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <InputLabel htmlFor="outlined-adornment-age-register">??????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-age-register"
                                type="text"
                                label="??????"
                                value={values.age}
                                name="age"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.age && errors.age && (
                                <FormHelperText error id="standard-weight-helper-text-age-register">
                                    {errors.age}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.age && errors.age)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <TextField
                                id="date"
                                label="??????"
                                type="date"
                                name="birth"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {touched.bitrh && errors.birth && (
                                <FormHelperText error id="standard-weight-helper-text-birth-register">
                                    {errors.birth}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.sex && errors.sex)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <FormLabel htmlFor="outlined-adornment-sex-register">??????</FormLabel>
                            <RadioGroup row aria-label="sex" name="sex" onChange={handleChange} defaultValue="M">
                                <FormControlLabel value="M" control={<Radio />} label="Male" />
                                <FormControlLabel value="F" control={<Radio />} label="Female" />
                            </RadioGroup>
                            {touched.sex && errors.sex && (
                                <FormHelperText error id="standard-weight-helper-text-sex-register">
                                    {errors.sex}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.job && errors.job)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <InputLabel id="demo-simple-select-label">??????</InputLabel>
                            <Select
                                id="demo-simple-select"
                                label="??????"
                                value={values.job}
                                onChange={handleChange}
                                name="job"
                            >
                                <MenuItem value="">
                                    ????????? ???????????????.
                                </MenuItem>
                                <MenuItem value="IT??????">
                                    IT??????
                                </MenuItem>
                                <MenuItem value="????????????">
                                    ????????????
                                </MenuItem>
                                <MenuItem value="????????????">
                                    ????????????
                                </MenuItem>
                            </Select>

                            {touched.job && errors.job && (
                                <FormHelperText error id="standard-weight-helper-text-job-register">
                                    {errors.job}
                                </FormHelperText>
                            )}
                        </FormControl>


                        <FormControl variant='outlined' fullWidth error={Boolean(touched.maxPrice && errors.maxPrice)} sx={{ ...theme.typography.customInput }} margin='normal'>
                            <InputLabel htmlFor="outlined-adornment-maxPrice-register">??????????????????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-maxPrice-register"
                                type="text"
                                value={values.maxPrice}
                                name="maxPrice"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                                label="??????????????????"
                            />
                            {touched.maxPrice && errors.maxPrice && (
                                <FormHelperText error id="standard-weight-helper-text-maxPrice-register">
                                    {errors.maxPrice}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.FavorList && errors.FavorList)} sx={{ ...theme.typography.customInput }} margin='normal' onChange={() => {console.log(values)}}>
                            <Typography variant="subtitle1">(*????????????) ???????????? ??? ?????? (?????? 3???)</Typography>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} >
                                {itemList.map((value) => {
                                    const labelId = `checkbox-list-label-${value.id}`;

                                    return (
                                        <ListItem
                                            key={value.category}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="comments">
                                                    <CommentIcon />
                                                </IconButton>
                                            }
                                            disablePadding
                                            value={value.id}                                            
                                            onClick={() => {
                                                const alchoListElement = {id : value.id, category : value.category}
                                                if(checked.indexOf(value) === -1 && checked.length < 3) {
                                                    values.FavorList.push(alchoListElement)
                                                } else {
                                                    values.FavorList = values.FavorList.filter((element) => element.id !== value.id);
                                                }
                                            }}
                                        >
                                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.indexOf(value) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={`${value.category}`}/>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            {touched.FavorList && errors.FavorList && (
                                <FormHelperText error id="standard-weight-helper-text-FavorList-register">
                                    {errors.FavorList}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    ????????????
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default AddInfoTest;
