import "@andypf/json-viewer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux";
import ResultHeader from "./ResultHeader";

const Result = () => {

    const userData = useSelector((state) => state.userData);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>     
        <ResultHeader/>  
            <Typography variant="h6">Result</Typography>
            <andypf-json-viewer
                indent="2"
                expanded="true"
                theme="google-dark"
                show-data-types="false"
                show-toolbar="true"
                expand-icon-type="arrow"
                show-copy="false"
                show-size="false"
                data={userData.result}
                style={{maxHeight: '400px', overflowY: 'auto', maxWidth:'90%'}}
            ></andypf-json-viewer>
        </Box>
    )
}

export default Result