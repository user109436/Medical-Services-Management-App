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
import PhysicianContext from '../../provider/PhysicianProvider';
import GlobalContext from '../../provider/GlobalProvider';
import AuthContext from '../../provider/AuthProvider';
import { useNavigate } from "react-router-dom";
import { copyFields } from '../../utils/Utilities';
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

function CardPhysician({ props }) {
    const navigate = useNavigate();
    const {
        setOpen,
    } = React.useContext(GlobalContext);
    const { physicianForm, setPhysicianForm } = React.useContext(PhysicianContext);
    const { loggedInUser } = React.useContext(AuthContext)

    const cardOptions = [
        {
            path: `./${props.physician._id}`,
            icon: <AssignmentIcon fontSize="large"/>
        }
    ];
    const viewUser = async (user) => {
        // console.log(user)
        if (!user) return false;
        let whiteList = [
            '_id',
            'user_id',
            'email',
            'log_id',
            'photo',
            '__v'
        ];
        physicianForm.selectedID = user._id;
        physicianForm.user_id = user.user_id._id;
        physicianForm.email = user.user_id.email;
        if (user.prc_license) physicianForm.hide_license_field = true; //to hide and show prc field if exist
        copyFields(physicianForm, user, whiteList);
        setPhysicianForm({ ...physicianForm });
        setOpen(true);

    }
    if (!loggedInUser) {
        return 'Authenticating....';
    }
    return (
        <Card sx={{ maxWidth: 250, boxShadow: 3 }}>
            <CardActionArea onClick={() => viewUser(props.physician)}>
                <Box sx={{ display: "flex", justifyContent: 'center', paddingTop: 2 }}>
                {props.physician.user_id.active ?(
                    <StyledBadge //active icon
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar
                            alt={fullname(props.physician.name).toUpperCase()}
                            src={`/api/images/${props.physician.photo}`}
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                    </StyledBadge>
                ):(
                     <Avatar
                            alt={fullname(props.physician.name).toUpperCase()}
                            src={`/api/images/${props.physician.photo}`}
                            sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 40, boxShadow: 3 }}
                        />
                )}
                </Box>
                <CardContent sx={{ padding: 1 }}>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{ textTransform: 'capitalize' }} align="center" color="text.secondary" className="physicianName">
                        {fullname(props.physician.name)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'capitalize' }} align="center" className="physicianRole">
                        {props.physician.user_id.role}
                    </Typography>
                    <input type="hidden" className="physicianActive" value={props.physician.user_id.active?'Active':'Archived'}/>
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

export default function CardUserPhysician() {
    const { physicians } = React.useContext(PhysicianContext);
    const searchPhysician = (e) => {
        let key = e?.target?.value.toLowerCase()||e.toLowerCase();//if string is passed as "e" and not "object"
        let physicianGrid = document.querySelectorAll('.physicianCard');

        physicianGrid.forEach((card) => {
            card.style.display = '';
            let physicianName = card.querySelectorAll('.physicianName')[0];
            let physicianRole = card.querySelectorAll('.physicianRole')[0];
            let physicianActive = card.querySelectorAll('.physicianActive')[0];
            let nameText = physicianName.innerHTML.toLowerCase().trim();
            let departmentText = physicianRole.innerHTML.toLowerCase().trim();
            let physicianActiveText =physicianActive.value.toLowerCase().trim();

            if (nameText.indexOf(key) !== -1 || departmentText.indexOf(key) !== -1 || physicianActiveText.indexOf(key) !== -1) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
     const handleChange=(e, child)=>{
        if(!child)return false;
        searchPhysician(child.toLowerCase());
    }
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        id="search"
                        fullWidth
                        label="Search Physicians"
                        variant="standard"
                        onChange={searchPhysician}

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
                            name="filterPhysician"
                            onChange={handleChange}
                            label={`Filter`}
                            />
                        )}
                        />
                    </Box>
                </Grid>
                {physicians?.doc?.map(physician => (
                    <Grid item xs={3} key={physician._id} className="physicianCard">
                        <CardPhysician props={{ physician }} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
