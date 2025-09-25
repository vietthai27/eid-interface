import Divider from "@mui/material/Divider"
import { useSelector } from "react-redux";

function ResultHeader() {

    const userData = useSelector((state) => state.userData);

    return(
        <div className="result-header-container" style={{backgroundColor:userData.resultColor}}>
            <div className="result-header-status"> {userData.status} </div>
            <Divider orientation="vertical" flexItem />
            <div className="result-header-message"> {userData.message} </div>
        </div>
    )
}

export default ResultHeader