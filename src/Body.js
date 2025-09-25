import Result from "./components/result/Result"
import Ocr from "./components/ocr/Ocr"
import Liveness from "./components/liveness/Liveness"
import FaceMatch from "./components/facematch/FaceMatch"

function Body({ page }) {
    return (
        <div className="body-container">
            <div className="body-left">
                {page === "ocr" ? <Ocr /> : page === "liveness" ? <Liveness /> : page === "face-match" ? <FaceMatch /> : null}
            </div>
            <div className="body-right">
                <Result />
            </div>
        </div>
    )
}

export default Body