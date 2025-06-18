import { all, put, takeLatest } from "redux-saga/effects";
import * as t from "../types";

const apiUrl = process.env.BACKEND_URL? process.env.BACKEND_URL : "https://bookinfo-backend.onrender.com/api/v1";

function* fetchbookinfos() {
	try {

		const response = yield fetch(apiUrl + "/books/");
	
		const bookinfoList = yield response.json();


		yield put({
			type: t.bookinfo_FETCH_SUCCEEDED,
			payload: bookinfoList,
		});
	} catch (error) {
		yield put({
			
			type: t.bookinfo_FETCH_FAILED,
			payload: error.message,
		});
	}
}

function* watchFetchbookinfos() {
	yield takeLatest(t.bookinfo_FETCH_REQUESTED, fetchbookinfos);
}

function* addbookinfo(action) {
	try {
		const body = {
			title: action.payload?.title || "",
			isbn: action.payload?.isbn || "",
			qty: action.payload?.qty || "",
			author: {
			  name: action.payload?.author || "",
			},
		  };
		  
		  const response = yield fetch(apiUrl+"/books", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			  },
			body: JSON.stringify(body),
		  });

		const newbookinfo = yield response.json();

		yield put({
			type: t.bookinfo_ADD_SUCCEEDED,
			payload: newbookinfo,
		});
	} catch (error) {
		yield put({
			type: t.bookinfo_ADD_FAILED,
			payload: error.message,
		});
	}
}

function* watchAddbookinfo() {
	yield takeLatest(t.bookinfo_ADD_REQUESTED, addbookinfo);
}

function* deletebookinfo(action) {
	try {
		const response = yield fetch(apiUrl+"/books/" + action.payload, {
			method: "DELETE",
		});

		const deletedbookinfo = yield response.json({message:"Record was deleted"});
		

		yield put({
			type: t.bookinfo_DELETE_SUCCEEDED,
			payload: deletedbookinfo.id,
		});
	} catch (error) {
		yield put({
			type: t.bookinfo_DELETE_FAILED,
			payload: error.message,
		});
	}
}

function* watchRemovebookinfo() {
	yield takeLatest(t.bookinfo_DELETE_REQUESTED, deletebookinfo);
}

function* updatebookinfo(action) {
	try {
		const body = {
			title: action.payload?.title || "",
			isbn: action.payload?.isbn || "",
			qty: action.payload?.qty || "",
			author: {
			  name: action.payload?.author || "",
			},
		  };
		const response = yield fetch(apiUrl+"/books/" + action.payload._id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			  },
			body: JSON.stringify(body),
		});

		const updatedbookinfo = yield response.json({ message :"Record has been Updated"});

		yield put({
			type: t.bookinfo_UPDATE_SUCCEEDED,
			payload: updatedbookinfo,
		});
	} catch (error) {
		yield put({
			type: t.bookinfo_UPDATE_FAILED,
			payload: error.message,
		});
	}
}

function* watchUpdatebookinfo() {
	yield takeLatest(t.bookinfo_UPDATE_REQUESTED, updatebookinfo);
}

export default function* rootSaga() {
	yield all([
		watchFetchbookinfos(),
		watchAddbookinfo(),
		watchRemovebookinfo(),
		watchUpdatebookinfo(),
	]);
}
