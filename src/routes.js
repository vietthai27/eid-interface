import Body from "./Body"

export const routes = [
    {
        path: "/",
        element: <Body page="ocr" />   
    },
    {
        path: "/ocr",
        element: <Body page="ocr" />
    },
    {
        path: "/liveness",
        element: <Body page="liveness" />   // passing "liveness"
    },
    {
        path: "/face-match",
        element: <Body page="face-match" />   // passing "liveness"
    }
]

export default routes