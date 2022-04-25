import React from 'react'
import ChatContext from '../../provider/ChatProvider';
import {
    Dialog,
    DialogTitle,
    DialogContent,

} from '@mui/material';

const ChatImageForm = () => {
    const { openImageModal, setOpenImageModal } = React.useContext(ChatContext);
    const handleClose=()=>{
        openImageModal.open=false;
        setOpenImageModal({...openImageModal});
    }
    return (
        <Dialog
            open={openImageModal.open}
             onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"lg"}
        >
            <DialogTitle id="form-dialog-title">Image Preview</DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                flexWrap: 'wrap',
                overflow:'visible !important'
            }}>
                <img
                style={{width:'100%'}}
                    src={`${openImageModal?.img || "lab.png"}`}
                    srcSet={`${openImageModal?.img || "lab.png"}`}
                    alt='img'
                    loading="lazy"
                />
            </DialogContent>
        </Dialog>
    );
}

export default React.memo(ChatImageForm)