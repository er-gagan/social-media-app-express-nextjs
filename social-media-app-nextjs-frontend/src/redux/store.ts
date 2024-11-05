
import { configureStore } from '@reduxjs/toolkit'
import Auth from "./actions-reducers/auth/auth"
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        Auth,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger, sagaMiddleware)

})

// then run the saga
sagaMiddleware.run(rootSaga)