import React from 'react'
import axios from 'axios';
import GlobalContext from '../../provider/GlobalProvider';
import {
    Container
} from '@mui/material/';
import VerifyStaffTable from '../tables/VerifyStaffTable';
export default function VerifyStaff() {
    const { change } = React.useContext(GlobalContext);
    const [staffs, setStaffs] = React.useState(null);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`api/staffs`);
                if (res) {
                    setStaffs({ ...res.data, success: true });
                }
                return true;
            } catch (err) {
                console.log(err);
                if (err.response) {
                    setStaffs({ ...err.response.data, success: false });
                }
            }
        }
        fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change]);
    return (
        <>
            <Container>
                <VerifyStaffTable staffs={staffs} />
            </Container>
        </>
    )
}
