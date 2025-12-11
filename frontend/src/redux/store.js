// import { configureStore } from "@reduxjs/toolkit";
// import userSlice from "./userSlice.js";
// import ownerSlice from "./ownerSlice.js";
// import mapSlice from "./mapSlice.js";

// export const store= configureStore({
//     reducer:{
//         user:userSlice,
//         owner:ownerSlice,
//         map:mapSlice
        
//     }
// })


import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import ownerSlice from "./ownerSlice.js";
import mapSlice from "./mapSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
    map: mapSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore the action that sets the socket instance
        ignoredActions: ["user/setSocket"],
        // ignore the state path where the socket instance is stored
        ignoredPaths: ["user.socket"]
      }
    })
});
