import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changebase64Front, changeLinkFaceMatch, changeLiveness1, changeMessage, changeResult, changeResultColor, changeStatus } from "../../userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpiner from "../loading/LoadingSpiner";
import LoadingPage from "../loading/LoadingPage";

function FaceMatch() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData);

    const [imageFront, setImageFront] = useState(null);// preview
    const [loadingFront, setLoadingFront] = useState(false);

    const [image1, setImage1] = useState(null);// preview
    const [loading1, setLoading1] = useState(false);

    const [loadingFaceMatch, setLoadingFaceMatch] = useState(false);

    useEffect(() => {
        if (userData.base64Front) {
            setImageFront(`data:image/png;base64,${userData.base64Front}`);
        }
        if (userData.liveness1) {
            setImage1(`data:image/png;base64,${userData.liveness1}`);
        }
    }, [userData.liveness1, userData.base64Front]);

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
    const handleImageChange1 = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading1(true);
            const base64 = await convertToBase64(file);
            setImage1(URL.createObjectURL(file)); // just for preview
            dispatch(changeLiveness1(base64));
            setLoading1(false); // stop loading
        }
    };

    // drag & drop support
    const handleDropImage1 = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLoading1(true);
            const base64 = await convertToBase64(file);
            setImage1(URL.createObjectURL(file)); // ✅ correct preview
            dispatch(changeLiveness1(base64));      // ✅ save to Redux
            setLoading1(false); // stop loading
        }
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

    const handleDragOver = (event) => {
        event.preventDefault(); // allow drop
    };

    const clearImage = (direction) => {
        if (direction === 'front') {
            dispatch(changebase64Front(''))
            setImageFront(null)
        } else if (direction === 'image1') {
            dispatch(changeLiveness1(''))
            setImage1(null)
        }
    }

    const createRequestBody = () => {
        const body = JSON.stringify({
            frontsideCaptured: userData.base64Front,
            videoCaptured: userData.liveness1,
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
            videoCaptured: userData.liveness1,
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

    const faceMatch = () => {
        setLoadingFaceMatch(true); // start loading
        axios.post(
            userData.hostbase + userData.linkFaceMatch,
            {
                frontsideCaptured: userData.base64Front,
                videoCaptured: userData.liveness1,
                requestId: userData.requestId,
            },
            {
                headers: {
                    Authorization: `Bearer ${userData.authToken}`, // 👈 Add your token here
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
                setLoadingFaceMatch(false); // stop loading always
            });
    };

    return (
        <div>
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
                {/* img 1 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onDrop={handleDropImage1}
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
                    <Typography variant="h6">Image 1</Typography>

                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-1"
                        type="file"
                        onChange={handleImageChange1}
                    />

                    <Box mt={2} display="flex" justifyContent="center" gap={'10px'}>
                        <label htmlFor="upload-1">
                            <Button variant="contained" component="span">
                                {image1 ? "Change Image" : "Choose Image"}
                            </Button>
                        </label>
                        <Button onClick={() => clearImage('image1')} variant="contained" component="span">
                            Clear image
                        </Button>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                        or drag & drop an image here
                    </Typography>

                    {loading1 ? (
                        <LoadingSpiner />
                    ) : (
                        image1 && (
                            <Box mt={2}>
                                <img
                                    src={image1}
                                    alt="1 Preview"
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
                        label="Base64 image 1"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={userData.liveness1 || ""}
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
                <TextField InputLabelProps={{ shrink: true }} value={userData.linkFaceMatch || ""} onChange={(e) => dispatch(changeLinkFaceMatch(e.target.value))} label="FACE-MATCH URL" variant="outlined" />
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        component="span"
                        onClick={faceMatch}
                        disabled={loadingFaceMatch}  // disable while loading
                    >
                        {loadingFaceMatch ? <LoadingPage /> : "FACE-MATCH"}
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

export default FaceMatch;
