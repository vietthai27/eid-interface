import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'userData',
  initialState: {
    username: 'supper_admin',
    password: 'abcD1234',
    authToken: '',
    hostbase: 'http://localhost:8080/ekycapi',
    base64Front: '',
    base64Back: '',
    linkOcr: '',
    requestId: '',
    docType: '',
    result: '',
    status: 0,
    message: 'No data',
    resultColor: '#3d5afe',
    liveness1: '',
    liveness2: '',
    liveness3: '',
    linkLiveness: '',
    linkFaceMatch: '',
    showPassword: false
  },
  reducers: {
    changeUsername: (state, action) => {
      state.username = action.payload
    },
    changePassword: (state, action) => {
      state.password = action.payload
    },
    changeAuthToken: (state, action) => {
      state.authToken = action.payload
    },
    changeHostbase: (state, action) => {
      state.hostbase = action.payload
    },
    changebase64Front: (state, action) => {
      state.base64Front = action.payload
    },
    changebase64Back: (state, action) => {
      state.base64Back = action.payload
    },
    changeLinkOcr: (state, action) => {
      state.linkOcr = action.payload
    },
    changeRequestId: (state, action) => {
      state.requestId = action.payload
    },
    changeDocType: (state, action) => {
      state.docType = action.payload
    },
    changeResult: (state, action) => {
      state.result = action.payload
    },
    changeStatus: (state, action) => {
      state.status = action.payload
    },
    changeMessage: (state, action) => {
      state.message = action.payload
    },
    changeResultColor: (state, action) => {
      state.resultColor = action.payload
    },
    changeLiveness1: (state, action) => {
      state.liveness1 = action.payload
    },
    changeLiveness2: (state, action) => {
      state.liveness2 = action.payload
    },
    changeLiveness3: (state, action) => {
      state.liveness3 = action.payload
    },
    changeLinkLiveness: (state, action) => {
      state.linkLiveness = action.payload
    },
    changeLinkFaceMatch: (state, action) => {
      state.linkFaceMatch = action.payload
    },
    changeShowPassword: (state, action) => {
      state.showPassword = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const {
  changeUsername,
  changePassword,
  changeAuthToken,
  changeHostbase,
  changebase64Front,
  changebase64Back,
  changeLinkOcr,
  changeRequestId,
  changeDocType,
  changeResult,
  changeMessage,
  changeStatus,
  changeResultColor,
  changeLiveness1,
  changeLiveness2,
  changeLiveness3,
  changeLinkLiveness,
  changeLinkFaceMatch,
  changeShowPassword
} = userSlice.actions

export default userSlice.reducer