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
import { fullname } from '../../utils/Utilities';
import StaffContext from '../../provider/StaffProvider';
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

function CardStaff({ props }) {
    const navigate = useNavigate();
    const {
        setOpen,
    } = React.useContext(GlobalContext);
    const { staffForm, setStaffForm } = React.useContext(StaffContext);
    const { loggedInUser } = React.useContext(AuthContext)

    const cardOptions = [
        {
            path: `./${props.staff._id}`,
            icon: <AssignmentIcon fontSize="large"/>
        }
    ];
    const viewUser = async (user) => {
        // console.log(user)
        if (!user) return false;
        let whiteList = [
            'department_id',
            '_id',
            'user_id',
            'email',
            'department',
            'birthday',
            'log_id',
            'photo',
            '__v'
        ];
        staffForm.selectedID = user._id;
        staffForm.department_id = user.department_id._id;
        staffForm.user_id = user.user_id._id;

        staffForm.department = user.department_id.department;
        staffForm.email = user.user_id.email;
        staffForm.birthday = formatDate(user.birthday);
        copyFields(staffForm, user, whiteList);
        setStaffForm({ ...staffForm });
        setOpen(true);

    }
    if (!loggedInUser) {
        return 'Authenticating....';
    }
    return (
        <Card sx={{ maxWidth: 250, boxShadow: 3 }}>
            <CardActionArea onClick={() => viewUser(props.staff)}>
                <Box sx={{ display: "flex", justifyContent: 'center', paddingTop: 2 }}>
                {props.staff.user_id.active?(
                    <StyledBadge //active icon
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar
                            alt={fullname(props.staff.name).toUpperCase()}
                            src={`/api/images/${props.staff.photo}`}//TODO:Image link
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                    </StyledBadge>
                ):(
                     <Avatar
                            alt={fullname(props.staff.name).toUpperCase()}
                            src={`/api/images/${props.staff.photo}`}//TODO:Image link
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                )}
                    
                </Box>
                <CardContent sx={{ padding: 1 }}>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{ textTransform: 'capitalize' }} align="center" color="text.secondary" className="staffName">
                        {fullname(props.staff.name)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" align="center" className="staffDepartment">
                        {props.staff.department_id.department}
                    </Typography>
                    <input type="hidden" className="staffType" value={props.staff.user_id.role==='faculty'?'faculty members':'staff'}/>
                    <input type="hidden" className="staffActive" value={props.staff.user_id.active?'Active':'Archived'}/>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', paddingTop: 0 }}>
            {/* href={`./staffs/${item.path}`}  */}
                {cardOptions.map((item, i) => (
                    <Button size="medium" key={i} color="primary" onClick={() => navigate(item.path)} >
                        {item.icon}
                    </Button>
                ))}
            </CardActions>
        </Card>
    );
}

export default function CardUserStaff() {
    const { staffs } = React.useContext(StaffContext);
    const searchStaff = (e) => {
        let key = e?.target?.value.toLowerCase()||e.toLowerCase();//if string is passed as "e" and not "object"
        let staffGrid = document.querySelectorAll('.staffCard');
        
        staffGrid.forEach((card) => {
            card.style.display='';
            let staffName = card.querySelectorAll('.staffName')[0];
            let staffDepartment = card.querySelectorAll('.staffDepartment')[0];
            let staffType = card.querySelectorAll('.staffType')[0];
            let staffActive = card.querySelectorAll('.staffActive')[0];
            let nameText =staffName.innerHTML.toLowerCase().trim();
            let departmentText =staffDepartment.innerHTML.toLowerCase().trim();
            let staffTypeText =staffType.value.toLowerCase().trim();
            let staffActiveText =staffActive.value.toLowerCase().trim();
            
            let keyExist = nameText.indexOf(key) !==-1 || departmentText.indexOf(key) !==-1 || staffTypeText.indexOf(key) !==-1 || staffActiveText.indexOf(key) !==-1
            if(keyExist){
                card.style.display='block';
            }else{
                card.style.display='none';
            }
        });
    }
    // const filterStaffOptions=[];
    const handleChange=(e, child)=>{
        if(!child)return false;
        searchStaff(child.toLowerCase());
    }
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        id="search"
                        fullWidth
                        label="Search Staffs"
                        variant="standard"
                        onChange={searchStaff}

                    />
                </Grid>
                <Grid item xs={12}>
                <Box sx={{flex:1}}>
                <Autocomplete
                  sx={{ marginTop: 2 }}
                  clearOnEscape
                  options={['Faculty Members', 'Staff', 'Archived']}
                  fullWidth
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField {...params}
                      name="filterStaff"
                      onChange={handleChange}
                      label={`Filter`}
                       />
                  )}
                />
    </Box>
                </Grid>
                {staffs?.doc?.map(staff => (
                    <Grid item xs={3} key={staff._id} className="staffCard">
                        <CardStaff props={{ staff }} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
