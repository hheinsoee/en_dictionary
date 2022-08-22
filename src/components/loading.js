import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
function Loading(props) {
    return (
        <div style={{height:"20vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
          <CircularProgress />
        </div >
      );
}

export default Loading;