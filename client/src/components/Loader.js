import React from 'react';
import { SyncLoader } from 'react-spinners';
import { Box } from 'gestalt';

const Loader = () => (
    <Box  position="fixed"
        dangerouslySetInlineStyle={{
        __style:{
            bottom:300,
            left:"50%",
            transform: "translateX(-50%)"
        }
    }}
    >
         <SyncLoader color="#6a36d7" size={15} margin="3px"/>
    </Box>
   
)

export default Loader;