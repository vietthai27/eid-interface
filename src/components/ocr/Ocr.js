import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changebase64Back, changebase64Front, changeDocType, changeLinkOcr, changeMessage, changeResult, changeResultColor, changeStatus } from "../../userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import LoadingSpiner from "../loading/LoadingSpiner";
import LoadingPage from "../loading/LoadingPage";

function Ocr() {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData);

    const [imageFront, setImageFront] = useState(null);// preview
    const [imageBack, setImageBack] = useState(null);// preview

    const [loadingFront, setLoadingFront] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);

    const [loadingOcr, setLoadingOcr] = useState(false);

    useEffect(() => {
        if (userData.base64Front) {
            setImageFront(`data:image/png;base64,${userData.base64Front}`);
        }
        if (userData.base64Back) {
            setImageBack(`data:image/png;base64,${userData.base64Back}`);
        }
    }, [userData.base64Front, userData.base64Back]);

    const ocr = () => {
        setLoadingOcr(true); // start loading
        axios.post(
            userData.hostbase + userData.linkOcr,
            {
                frontsideCaptured: userData.base64Front,
                backsideCaptured: userData.base64Back,
                documentType: userData.docType,
                requestId: userData.requestId,
            },
            {
                headers: {
                    Authorization: `Bearer ${userData.authToken}`,
                    "Content-Type": "application/json",
                },
            }
        )
            .then(response => {
                dispatch(changeResult(response.data));
                dispatch(changeStatus(response.data.exitCode));
                dispatch(changeMessage(response.data.exitCodeMessage));
                if (response.data.exitCode === 0) {
                    dispatch(changeResultColor('#28a745'));
                } else {
                    dispatch(changeResultColor('#ffc107'));
                }
            })
            .catch(error => {
                toast.error("error !!!");
                console.error('failed:', error);
            })
            .finally(() => {
                setLoadingOcr(false); // stop loading always
            });
    };

    // convert file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result;
                // remove "data:image/...;base64," prefix
                const base64String = result.split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };


    // file select from input
    const handleImageChangeFront = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoadingFront(true);
            const base64 = await convertToBase64(file);
            setImageFront(URL.createObjectURL(file)); // just for preview
            dispatch(changebase64Front(base64));
            setLoadingFront(false); // stop loading
        }
    };

    const handleImageChangeBack = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoadingBack(true)
            const base64 = await convertToBase64(file);
            setImageBack(URL.createObjectURL(file)); // just for preview
            dispatch(changebase64Back(base64));
            setLoadingBack(false);
        }
    };

    // drag & drop support
    const handleDropFront = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLoadingFront(true);
            const base64 = await convertToBase64(file);
            setImageFront(URL.createObjectURL(file)); // ✅ correct preview
            dispatch(changebase64Front(base64));      // ✅ save to Redux
            setLoadingFront(false); // stop loading
        }
    };

    const handleDropFrontBack = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLoadingBack(true)
            const base64 = await convertToBase64(file);
            setImageBack(URL.createObjectURL(file)); // ✅ correct preview
            dispatch(changebase64Back(base64));      // ✅ save to Redux
            setLoadingBack(false);
        }
    };


    const handleDragOver = (event) => {
        event.preventDefault(); // allow drop
    };

    const clearImage = (direction) => {
        if (direction === 'front') {
            dispatch(changebase64Front(''))
            setImageFront(null)
        } else if (direction === 'back') {
            dispatch(changebase64Back(''))
            setImageBack(null)
        }
    }

    const createRequestBody = () => {
        const body = JSON.stringify({
            frontsideCaptured: userData.base64Front,
            backsideCaptured: userData.base64Back,
            documentType: userData.docType,
            requestId: userData.requestId,
        });

        navigator.clipboard.writeText(body)
            .then(() => {
                toast.success("Request body copied to clipboard");
            })
            .catch(err => {
                toast.error("Failed to copy: ", err);
            });
    }

    const createCurl = () => {
        const curlString = `
curl -X POST "${userData.hostbase}${userData.linkOcr}" \
  -H "Authorization: Bearer ${userData.authToken}" \
  -H "Content-Type: application/json" \
  -d '${JSON.stringify({
            frontsideCaptured: userData.base64Front,
            backsideCaptured: userData.base64Back,
            documentType: userData.docType,
            requestId: userData.requestId,
        })}'
`;

        navigator.clipboard.writeText(curlString)
            .then(() => {
                toast.success("CURL copied to clipboard");
            })
            .catch(err => {
                toast.error("Failed to copy: ", err);
            });

    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel id="doc-type-label">Document type</InputLabel>
                <Select
                    labelId="doc-type-label"
                    id="doc-type"
                    value={userData.docType}
                    onChange={(e) => dispatch(changeDocType(e.target.value))}
                    input={<OutlinedInput label="Document type" />}
                >
                    <MenuItem value={"cccd"}>CCCD</MenuItem>
                    <MenuItem value={"hc"}>PASSPORT</MenuItem>
                </Select>
            </FormControl>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={4}
                justifyContent="center"
            >
                {/* Front side */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onDrop={handleDropFront}
                    onDragOver={handleDragOver}
                    sx={{
                        border: "2px dashed #aaa",
                        borderRadius: "8px",
                        p: 2,
                        width: "100%",
                        maxWidth: "400px",
                        cursor: "pointer",
                    }}
                >
                    <Typography variant="h6">Front side</Typography>

                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-front"
                        type="file"
                        onChange={handleImageChangeFront}
                    />

                    <Box mt={2} display="flex" justifyContent="center" gap={'10px'}>
                        <label htmlFor="upload-front">
                            <Button variant="contained" component="span">
                                {imageFront ? "Change Image" : "Choose Image"}
                            </Button>
                        </label>
                        <Button onClick={() => clearImage('front')} variant="contained" component="span">
                            Clear image
                        </Button>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                        or drag & drop an image here
                    </Typography>

                    {loadingFront ? (
                        <LoadingSpiner />
                    ) : (
                        imageFront && (
                            <Box mt={2}>
                                <img
                                    src={imageFront}
                                    alt="Front Preview"
                                    style={{
                                        maxWidth: "300px",
                                        maxHeight: "300px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                    }}
                                />
                            </Box>
                        )
                    )}

                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Base64 Front"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={userData.base64Front || ""}
                        sx={{
                            width: "300px",
                            "& .MuiInputBase-input": {
                                whiteSpace: "nowrap",   // prevent wrapping
                                overflow: "hidden",     // hide overflow
                                textOverflow: "ellipsis", // show "..." when overflowing
                            },
                        }}
                    />
                </Box>
                {/* Back side */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onDrop={handleDropFrontBack}
                    onDragOver={handleDragOver}
                    sx={{
                        border: "2px dashed #aaa",
                        borderRadius: "8px",
                        p: 2,
                        width: "100%",
                        maxWidth: "400px",
                        cursor: "pointer",
                    }}
                >
                    <Typography variant="h6">Back side</Typography>

                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-back"
                        type="file"
                        onChange={handleImageChangeBack}
                    />
                    <Box mt={2} display="flex" justifyContent="center" gap={'10px'}>
                        <label htmlFor="upload-back">
                            <Button variant="contained" component="span">
                                {imageBack ? "Change Image" : "Choose Image"}
                            </Button>
                        </label>
                        <Button onClick={() => clearImage('back')} variant="contained" component="span">
                            Clear image
                        </Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        or drag & drop an image here
                    </Typography>

                    {loadingBack ? (
                        <LoadingSpiner />
                    ) : (
                        imageBack && (
                            <Box mt={2}>
                                <img
                                    src={imageBack}
                                    alt="Back Preview"
                                    style={{
                                        maxWidth: "300px",
                                        maxHeight: "300px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                    }}
                                />
                            </Box>
                        )
                    )}

                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Base64 Back"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={userData.base64Back || ""}
                        sx={{
                            width: "300px",
                            "& .MuiInputBase-input": {
                                whiteSpace: "nowrap",   // prevent wrapping
                                overflow: "hidden",     // hide overflow
                                textOverflow: "ellipsis", // show "..." when overflowing
                            },
                        }}
                    />
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                margin={"20px"}
            >
                <TextField InputLabelProps={{ shrink: true }} value={userData.linkOcr || ""} onChange={(e) => dispatch(changeLinkOcr(e.target.value))} label="OCR URL" variant="outlined" />
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        component="span"
                        onClick={ocr}
                        disabled={loadingOcr}  // disable while loading
                    >
                        {loadingOcr ? <LoadingPage /> : "OCR"}
                    </Button>
                    <Button variant="contained" component="span" onClick={() => createRequestBody()}>
                        BODY
                    </Button>
                    <Button variant="contained" component="span" onClick={() => createCurl()}>
                        CURL
                    </Button>
                </Stack>
            </Box>
        </div>
    );
}

export default Ocr;
