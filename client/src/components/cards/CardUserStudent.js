import * as React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    CardActionArea,
    CardActions,
    Avatar,
    styled,
    Badge,
    Grid,
    TextField,
    Autocomplete
} from '@mui/material/';
import { blue } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { fullname, getYearSection } from '../../utils/Utilities';
import StudentContext from '../../provider/StudentProvider';
import GlobalContext from '../../provider/GlobalProvider';
import AuthContext from '../../provider/AuthProvider';
import { useNavigate } from "react-router-dom";
import { copyFields, formatDate } from '../../utils/Utilities';
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        height: "8px",
        width: "8px",
        borderRadius: '100%',
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(1)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2)',
            opacity: 0,
        },
    },
}));

function CardStudent({ props }) {
    const navigate = useNavigate();
    const {
        setOpen,
    } = React.useContext(GlobalContext);
    const { studentForm, setStudentForm } = React.useContext(StudentContext);
    const { loggedInUser } = React.useContext(AuthContext)

    const cardOptions = [
        {
            path: `./${props.student._id}`,
            icon: <AssignmentIcon fontSize="large"/>
        }
    ];
    const viewUser = async (user) => {
        if (!user) return false;
        let whiteList = [
            'course_id',
            '_id',
            'year_id',
            'section_id',
            'user_id',
            'email',
            'year',
            'section',
            'course',
            'birthday',
            'log_id',
            'photo',
            '__v'
        ];
        studentForm.selectedID = user._id;
        // studentForm.year_id = user?.year_id?._id;
        studentForm.course_id = user.course_id._id;
        // studentForm.section_id = user?.section_id?._id;
        studentForm.user_id = user.user_id._id;

        // studentForm.year = user.year_id.year;
        studentForm.course = user.course_id.course;
        // studentForm.section = user.section_id.section;
        studentForm.email = user.user_id.email;
        studentForm.birthday = formatDate(user.birthday);
        copyFields(studentForm, user, whiteList);
        setStudentForm({ ...studentForm });
        setOpen(true);

    }
    if (!loggedInUser) {
        return 'Authenticating....';
    }
    return (
        <Card sx={{ maxWidth: 250, boxShadow: 3 }}>
            <CardActionArea onClick={() => viewUser(props.student)}>
                <Box sx={{ display: "flex", justifyContent: 'center', paddingTop: 2 }}>
                {props.student.user_id.active?(
                     <StyledBadge //active icon
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar
                            alt={fullname(props.student.name).toUpperCase()}
                            src={`/api/images/${props.student.photo}`}//TODO:Image link
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                    </StyledBadge>
                ):(
                     <Avatar
                            alt={fullname(props.student.name).toUpperCase()}
                            src={`/api/images/${props.student.photo}`}//TODO:Image link
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                )}
                   
                </Box>
                <CardContent sx={{ padding: 1 }}>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{ textTransform: 'capitalize' }} align="center" color="text.secondary" className="studentName">
                        {fullname(props.student.name)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" align="center" className="studentYearSection">
                        {getYearSection(props.student)}
                    </Typography>
                    <input type="hidden" className="studentActive" value={props.student.user_id.active?'Active':'Archived'}/>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', paddingTop: 0 }}>

                {cardOptions.map((item, i) => (
                    <Button size="medium" key={i} color="primary" onClick={() => navigate(item.path)} >
                        {item.icon}
                    </Button>
                ))}
            </CardActions>
        </Card>
    );
}

export default function CardUserStudent() {
    const { students } = React.useContext(StudentContext);
    const searchStudent = (e) => {
        let key = e?.target?.value.toLowerCase()||e.toLowerCase();//if string is passed as "e" and not "object"
        let studentGrid = document.querySelectorAll('.studentCard');

        studentGrid.forEach((card) => {
            card.style.display='';
            let studentName = card.querySelectorAll('.studentName')[0];
            let studentYearSection = card.querySelectorAll('.studentYearSection')[0];
            let studentActive = card.querySelectorAll('.studentActive')[0];
            let nameText =studentName.innerHTML.toLowerCase().trim();
            let yearSectionText =studentYearSection.innerHTML.toLowerCase().trim();
            let studentActiveText =studentActive.value.toLowerCase().trim();
            
            if(nameText.indexOf(key) !==-1 || yearSectionText.indexOf(key) !==-1 || studentActiveText.indexOf(key) !==-1){
                card.style.display='block';
            }else{
                card.style.display='none';
            }
        });
    }
     const handleChange=(e, child)=>{
        if(!child)return false;
        searchStudent(child.toLowerCase());
    }
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        id="search"
                        fullWidth
                        label="Search Students"
                        variant="standard"
                        onChange={searchStudent}

                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{flex:1}}>
                        <Autocomplete
                        sx={{ marginTop: 2 }}
                        clearOnEscape
                        options={['Active', 'Archived']}
                        fullWidth
                        onChange={handleChange}
                        renderInput={(params) => (
                            <TextField {...params}
                            name="filterStudent"
                            onChange={handleChange}
                            label={`Filter`}
                            />
                        )}
                        />
                    </Box>
                </Grid>
                {students?.doc?.map(student => (
                    <Grid item xs={3} key={student._id} className="studentCard">
                        <CardStudent props={{ student }} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
