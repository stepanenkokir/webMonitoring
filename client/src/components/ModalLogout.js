import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from 'react-router';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalLogout() {
    const [open, setOpen] = React.useState(true);       
    const [count, setCount] = React.useState(true);           
    const myTm = React.useRef();
    const timeoutLogout = React.useRef()

    const countDown = () =>{       
        setCount(myTm.current)    
        myTm.current--;
        if (myTm.current<0)
            handleClose();
    }

    React.useEffect(()=>{               
        myTm.current=3;        
        timeoutLogout.current = setInterval( async ()=>{ await countDown()},1000);
        return ()=> clearInterval(timeoutLogout.current)    
    },[])
    
    
    
    const auth = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleClose = (event) => {        
            console.log("Выход!!!");
            setOpen(false);
            if (event) event.preventDefault();
            auth.logout();
            navigate('/');
        }  
    return (
    <div>        
        <Modal           
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography  id="modal-modal-title" variant="h6" component="h2">
                    ПРЕДУПРЕЖДЕНИЕ
                </Typography>
                <Typography  id="modal-modal-description" sx={{ mt: 2 }}>
                    Время сеанса истекло...{count}
                </Typography>
            </Box>
        </Modal>
    </div>
    );
}