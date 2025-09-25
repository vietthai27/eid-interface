import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeLinkLiveness, changeLiveness1, changeLiveness2, changeLiveness3, changeMessage, changeResult, changeResultColor, changeStatus } from "../../userSlice"
import { toast } from "react-toastify"
import axios from "axios"
import LoadingSpiner from "../loading/LoadingSpiner"
import LoadingPage from "../loading/LoadingPage"

function Liveness() {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData);

    const [image1, setImage1] = useState(null);// preview
    const [image2, setImage2] = useState(null);// preview
    const [image3, setImage3] = useState(null);// preview

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    useEffect(() => {
        if (userData.liveness1) {
            setImage1(`data:image/png;base64,${userData.liveness1}`);
        }
        if (userData.liveness2) {
            setImage2(`data:image/png;base64,${userData.liveness2}`);
        }
        if (userData.liveness3) {
            setImage3(`data:image/png;base64,${userData.liveness3}`);
        }
    }, [userData.liveness1, userData.liveness2, userData.liveness3]);

    const [loadingLiveness, setLoadingLiveness] = useState(false);

    const liveness = () => {
        setLoadingLiveness(true); // start loading
        axios.post(
            userData.hostbase + userData.linkLiveness,
            {
                requestId: userData.requestId,
                liveVideoCaptured: [
                    {
                        capture: userData.liveness1,
                        orderNo: "1"
                    },
                    {
                        capture: userData.liveness2,
                        orderNo: "2"
                    },
                    {
                        capture: userData.liveness3,
                        orderNo: "3"
                    }
                ]
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
                setLoadingLiveness(false); // stop loading always
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
    const handleImageChange2 = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading2(true);
            const base64 = await convertToBase64(file);
            setImage2(URL.createObjectURL(file)); // just for preview
            dispatch(changeLiveness2(base64));
            setLoading2(false); // stop loading
        }
    };

    // drag & drop support
    const handleDropImage2 = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLoading2(true);
            const base64 = await convertToBase64(file);
            setImage2(URL.createObjectURL(file)); // ✅ correct preview
            dispatch(changeLiveness2(base64));      // ✅ save to Redux
            setLoading2(false); // stop loading
        }
    };

    // file select from input
    const handleImageChange3 = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading3(true);
            const base64 = await convertToBase64(file);
            setImage3(URL.createObjectURL(file)); // just for preview
            dispatch(changeLiveness3(base64));
            setLoading3(false); // stop loading
        }
    };

    // drag & drop support
    const handleDropImage3 = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLoading3(true);
            const base64 = await convertToBase64(file);
            setImage3(URL.createObjectURL(file)); // ✅ correct preview
            dispatch(changeLiveness3(base64));      // ✅ save to Redux
            setLoading3(false); // stop loading
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // allow drop
    };

    const clearImage = (direction) => {
        if (direction === 'image1') {
            dispatch(changeLiveness1(''))
            setImage1(null)
        } else if (direction === 'image2') {
            dispatch(changeLiveness2(''))
            setImage2(null)
        } else if (direction === 'image3') {
            dispatch(changeLiveness3(''))
            setImage3(null)
        }
    }

    const createRequestBody = () => {
        const body = JSON.stringify({
            requestId: userData.requestId,
            liveVideoCaptured: [
                {
                    capture: userData.liveness1,
                    orderNo: "1"
                },
                {
                    capture: userData.liveness2,
                    orderNo: "2"
                },
                {
                    capture: userData.liveness3,
                    orderNo: "3"
                }
            ]
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
curl -X POST "${userData.hostbase}${userData.linkLiveness}" \
  -H "Authorization: Bearer ${userData.authToken}" \
  -H "Content-Type: application/json" \
  -d '${JSON.stringify({
            requestId: userData.requestId,
            liveVideoCaptured: [
                {
                    capture: userData.liveness1,
                    orderNo: "1"
                },
                {
                    capture: userData.liveness2,
                    orderNo: "2"
                },
                {
                    capture: userData.liveness3,
                    orderNo: "3"
                }
            ]
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
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={4}
                justifyContent="center"
            >
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
                {/* img 2 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onDrop={handleDropImage2}
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
                    <Typography variant="h6">Image 2</Typography>

                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-2"
                        type="file"
                        onChange={handleImageChange2}
                    />

                    <Box mt={2} display="flex" justifyContent="center" gap={'10px'}>
                        <label htmlFor="upload-2">
                            <Button variant="contained" component="span">
                                {image2 ? "Change Image" : "Choose Image"}
                            </Button>
                        </label>
                        <Button onClick={() => clearImage('image2')} variant="contained" component="span">
                            Clear image
                        </Button>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                        or drag & drop an image here
                    </Typography>

                    {loading2 ? (
                        <LoadingSpiner />
                    ) : (
                        image2 && (
                            <Box mt={2}>
                                <img
                                    src={image2}
                                    alt="2 Preview"
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
                        value={userData.liveness2 || ""}
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
                {/* img 3 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    onDrop={handleDropImage3}
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
                    <Typography variant="h6">Image 3</Typography>

                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-3"
                        type="file"
                        onChange={handleImageChange3}
                    />

                    <Box mt={2} display="flex" justifyContent="center" gap={'10px'}>
                        <label htmlFor="upload-3">
                            <Button variant="contained" component="span">
                                {image3 ? "Change Image" : "Choose Image"}
                            </Button>
                        </label>
                        <Button onClick={() => clearImage('image3')} variant="contained" component="span">
                            Clear image
                        </Button>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                        or drag & drop an image here
                    </Typography>

                    {loading3 ? (
                        <LoadingSpiner />
                    ) : (
                        image3 && (
                            <Box mt={2}>
                                <img
                                    src={image3}
                                    alt="3 Preview"
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
                        label="Base64 image 3"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={userData.liveness3 || ""}
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
                <TextField InputLabelProps={{ shrink: true }} value={userData.linkLiveness || ""} onChange={(e) => dispatch(changeLinkLiveness(e.target.value))} label="LIVENESS URL" variant="outlined" />
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        component="span"
                        onClick={liveness}
                        disabled={loadingLiveness}  // disable while loading
                    >
                        {loadingLiveness ? <LoadingPage /> : "LIVENESS"}
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
    )
}

export default Liveness