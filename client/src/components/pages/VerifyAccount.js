import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Grid,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Link
} from '@mui/material/';
import { green, red } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
function VerifyAccount() {
    const { id } = useParams();
    const [verify, setVerify] = useState({ success: false });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`api/account/signup/verify/${id}`);
                if (res) {
                    setVerify({ ...res.data, success: true });
                }
                return true;
            } catch (err) {
                console.log(err);
                if (err.response) {
                    setVerify({ ...err.response.data, success: false });
                }
            }
        }
        if (id) {
            fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }, [id]);
    return (
        <Container>
            <Grid container >
                <Grid item xs={12} sx={{ display: "flex", justifyContent: 'center' }}>
                    <Card elevation={6} sx={{ display: "flex", justifyContent: "center" }}>
                        {verify.success ? (
                            <CardContent sx={{ bgcolor: green[500] }} >
                                <Avatar
                                    sx={{
                                        height: 70,
                                        width: 70,
                                        color: green[500],
                                        bgcolor: 'white',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}
                                >
                                    <CheckIcon sx={{ fontSize: 50 }} />
                                </Avatar>
                                <Typography variant="body1" gutterBottom component="div" sx={{ color: 'white' }}>
                                    {verify.message}
                                </Typography>
                            </CardContent>

                        ) : (

                            <CardContent sx={{ bgcolor: red[500] }} >
                                <Avatar
                                    sx={{
                                        height: 70,
                                        width: 70,
                                        color: red[500],
                                        bgcolor: 'white',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 50 }} />
                                </Avatar>
                                <Typography variant="body1" gutterBottom component="div" sx={{ color: 'white' }}>
                                    {verify.message}
                                </Typography>
                                <Link href="/" variant="body2" 
                                    sx={{
                                        color: 'white',
                                        marginTop: 3,
                                        textDecorationColor:'white',
                                        display:'flex',
                                        justifyContent:'center'
                                    }}
                                    >
                                    Resend Verification Link Here
                                </Link>
                            </CardContent>
                        )}

                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default VerifyAccount