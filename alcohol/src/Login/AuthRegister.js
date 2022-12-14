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
import useScriptRef from './useScriptRef';
import AnimateButton from '../ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from './password-strength';
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

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
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
                    console.log("1 " + res[i].id);
                    console.log("2 " + res[i].category);
                    console.log("alcho " + alcho.id);
                    console.log("alcho " + alcho.category);
                    setItemList(itemList => [...itemList, alcho]);
                }

            })
    }, [])

    return (
        <div>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">????????? ????????? ????????????</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    fname: '',
                    ename: '',
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
                    fname: Yup.string().required('?????? ???????????????'),
                    ename: Yup.string().required('????????? ???????????????'),
                    email: Yup.string().email('????????? ????????? ????????????.').max(255).required('???????????? ???????????????.'),
                    password: Yup.string().max(255).required('??????????????? ???????????????.'),
                    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], '??????????????? ?????? ?????? ????????????.').required('??????????????? ?????? ??????????????????.'),
                    nickname: Yup.string().min(2, "2?????? ?????? ???????????????").max(8, "8?????? ????????? ???????????????.").matches(/^[???-???a-zA-z0-9]*$/, { message: "????????? ????????? ???????????? ????????????." }).required('???????????? ???????????????'),
                    age: Yup.number({ message: '????????? ???????????????.' }).max(100, "100????????? ???????????????.").required('????????? ???????????????'),
                    birth: Yup.date().max(new Date(), 'You can\'t be born in the future!').required('????????? ???????????????'),
                    maxPrice: Yup.number().min(1000, '1000??? ?????? ???????????????').max(99999999, '1?????? ???????????? ???????????????').required('?????? ?????? ????????? ???????????????'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);

                            fetch(addr + '/user/insert', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    name: values.fname + values.ename,
                                    email: values.email,
                                    loginType: values.loginType,
                                    age: values.age,
                                    birth: values.birth,
                                    nickname: values.nickname,
                                    sex: values.sex,
                                    job: values.job,
                                    userId: values.email,
                                    price: values.maxPrice,
                                    favorite: values.FavorList,
                                    password: values.password
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
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    fullWidth
                                    label="???"
                                    margin="normal"
                                    name="fname"
                                    type="text"
                                    value={values.fname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.fname && errors.fname && (
                                    <FormHelperText error id="standard-weight-helper-text-fname-register">
                                        {errors.fname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    fullWidth
                                    label="??????"
                                    margin="normal"
                                    name="ename"
                                    type="text"
                                    value={values.ename}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.ename && errors.ename && (
                                    <FormHelperText error id="standard-weight-helper-text-ename-register">
                                        {errors.ename}
                                    </FormHelperText>
                                )}
                            </Grid>




                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">?????????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                label="?????????"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                            margin='normal'
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">????????????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="????????????"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                            margin='normal'
                        >
                            <InputLabel htmlFor="outlined-adornment-passwordConfirm-register">???????????? ??????</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-passwordConfirm-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.passwordConfirm}
                                name="passwordConfirm"
                                label="???????????? ??????"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePasswordConfirm(values.password, e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle passwordConfirm visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {passwordConfirm ? <ThemeProvider theme={finalTheme}>
                                <Chip
                                    color="success"
                                    label={
                                        <span>
                                            <b>Status:</b> Completed
                                        </span>
                                    }
                                    icon={<Check fontSize="small" />}
                                />
                            </ThemeProvider> : null}
                            {touched.passwordConfirm && errors.passwordConfirm && (
                                <FormHelperText error id="standard-weight-helper-text-passwordConfirm-register">
                                    {errors.passwordConfirm}
                                </FormHelperText>
                            )}
                        </FormControl>

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
                                defaultValue="2000-01-01"
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

export default FirebaseRegister;
