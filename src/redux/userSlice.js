import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: undefined, // undefined = not checked yet, null = no user, object = user data
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
    },
    updateTemplate: (state, action) => {
      // action.payload: { id, name, subject, body }
      if (!state.userData?.templates) return;
      const idx = state.userData.templates.findIndex(
        (t) => t._id === action.payload.id || t.id === action.payload.id
      );
      if (idx !== -1) {
        state.userData.templates[idx] = {
          ...state.userData.templates[idx],
          name: action.payload.name,
          subject: action.payload.subject,
          body: action.payload.body,
        };
      }
    },
    deleteTemplate: (state, action) => {
      // action.payload: id
      if (!state.userData?.templates) return;
      state.userData.templates = state.userData.templates.filter(
        (t) => t._id !== action.payload && t.id !== action.payload
      );
    },
    addFile: (state, action) => {
      // action.payload: file object
      console.log("userSlice: addFile action received", action.payload);
      if (!state.userData) return;
      if (!state.userData.files) {
        state.userData.files = [];
      }
      state.userData.files.push(action.payload);
      console.log(
        "userSlice: file added, total files:",
        state.userData.files.length
      );
    },
    deleteFile: (state, action) => {
      // action.payload: fileId
      console.log("userSlice: deleteFile action received", action.payload);
      if (!state.userData?.files) return;
      const initialLength = state.userData.files.length;
      state.userData.files = state.userData.files.filter(
        (f) => f.fileId !== action.payload
      );
      console.log(
        "userSlice: file deleted, files remaining:",
        state.userData.files.length,
        "deleted:",
        initialLength - state.userData.files.length
      );
    },
  },
});

export const {
  setUserData,
  setLoading,
  clearUserData,
  updateTemplate,
  deleteTemplate,
  addFile,
  deleteFile,
} = userSlice.actions;
export default userSlice.reducer;
