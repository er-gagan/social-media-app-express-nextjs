
import { put, takeEvery, all, call } from 'redux-saga/effects'
import { AuthSaga } from './saga/auth/authSaga'



export default function* rootSaga() {
    yield all([
        AuthSaga(),
    ])
}