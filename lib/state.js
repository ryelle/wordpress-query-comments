'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.COMMENT_SUBMIT_REQUEST_FAILURE = exports.COMMENT_SUBMIT_REQUEST_SUCCESS = exports.COMMENT_SUBMIT_REQUEST = exports.COMMENTS_REQUEST_FAILURE = exports.COMMENTS_REQUEST_SUCCESS = exports.COMMENTS_REQUEST = undefined;
exports.items = items;
exports.itemsOnPost = itemsOnPost;
exports.requests = requests;
exports.totals = totals;
exports.isSubmitting = isSubmitting;
exports.requestComments = requestComments;
exports.submitComment = submitComment;

var _redux = require('redux');

var _keyBy = require('lodash/keyBy');

var _keyBy2 = _interopRequireDefault(_keyBy);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _wordpressRestApiOauth = require('wordpress-rest-api-oauth-1');

var _wordpressRestApiOauth2 = _interopRequireDefault(_wordpressRestApiOauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*global SiteSettings */
/**
 * External dependencies
 */


var api = new _wordpressRestApiOauth2.default({
	url: SiteSettings.endpoint
});

/**
 * Comment actions
 */
var COMMENTS_REQUEST = exports.COMMENTS_REQUEST = 'wordpress-redux/comments/REQUEST';
var COMMENTS_REQUEST_SUCCESS = exports.COMMENTS_REQUEST_SUCCESS = 'wordpress-redux/comments/REQUEST_SUCCESS';
var COMMENTS_REQUEST_FAILURE = exports.COMMENTS_REQUEST_FAILURE = 'wordpress-redux/comments/REQUEST_FAILURE';
var COMMENT_SUBMIT_REQUEST = exports.COMMENT_SUBMIT_REQUEST = 'wordpress-redux/comment-submit/REQUEST';
var COMMENT_SUBMIT_REQUEST_SUCCESS = exports.COMMENT_SUBMIT_REQUEST_SUCCESS = 'wordpress-redux/comment-submit/REQUEST_SUCCESS';
var COMMENT_SUBMIT_REQUEST_FAILURE = exports.COMMENT_SUBMIT_REQUEST_FAILURE = 'wordpress-redux/comment-submit/REQUEST_FAILURE';

/**
 * Tracks all known comment objects, indexed by comment ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case COMMENTS_REQUEST_SUCCESS:
			var comments = (0, _keyBy2.default)(action.comments, 'id');
			return Object.assign({}, state, comments);
		case COMMENT_SUBMIT_REQUEST_SUCCESS:
			return Object.assign({}, state, _defineProperty({}, action.comment.id, action.comment));
		default:
			return state;
	}
}

/**
 * Tracks comments IDs for each post.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function itemsOnPost() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case COMMENTS_REQUEST_SUCCESS:
			return Object.assign({}, state, _defineProperty({}, action.postId, action.comments.map(function (comment) {
				return comment.id;
			})));
		case COMMENT_SUBMIT_REQUEST_SUCCESS:
			if (!state[action.postId]) {
				return Object.assign({}, state, _defineProperty({}, action.postId, [action.comment.id]));
			}
			return Object.assign({}, state, _defineProperty({}, action.postId, [].concat(_toConsumableArray(state[action.postId]), [action.comment.id])));
		default:
			return state;
	}
}

/**
 * Returns the updated comment requests state after an action has been
 * dispatched. The state reflects a mapping of post ID to a
 * boolean reflecting whether a request for the comments is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function requests() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case COMMENTS_REQUEST:
		case COMMENTS_REQUEST_SUCCESS:
		case COMMENTS_REQUEST_FAILURE:
			return Object.assign({}, state, _defineProperty({}, action.postId, COMMENTS_REQUEST === action.type));
		default:
			return state;
	}
}

/**
 * Returns the updated comment count state after an action has been
 * dispatched. The state reflects a mapping of post ID to a total count
 * of comments attached to that post.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function totals() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case COMMENTS_REQUEST_SUCCESS:
			return Object.assign({}, state, _defineProperty({}, action.postId, action.count));
		case COMMENT_SUBMIT_REQUEST_SUCCESS:
			if (!state[action.postId]) {
				return Object.assign({}, state, _defineProperty({}, action.postId, 1));
			}
			return Object.assign({}, state, _defineProperty({}, action.postId, parseInt(state[action.postId], 10) + 1));
		default:
			return state;
	}
}

/**
 * Returns the updated comment requests state after an action has been
 * dispatched. The state reflects a mapping of post ID to a
 * boolean reflecting whether a request for the comments is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
function isSubmitting() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case COMMENT_SUBMIT_REQUEST:
		case COMMENT_SUBMIT_REQUEST_SUCCESS:
		case COMMENT_SUBMIT_REQUEST_FAILURE:
			return Object.assign({}, state, _defineProperty({}, action.postId, COMMENT_SUBMIT_REQUEST === action.type));
		default:
			return state;
	}
}

exports.default = (0, _redux.combineReducers)({
	items: items,
	itemsOnPost: itemsOnPost,
	requests: requests,
	totals: totals,
	isSubmitting: isSubmitting
});

/**
 * Triggers a network request to fetch the comments for a given post.
 *
 * @param  {int}       postId  Post ID of post to get comments for
 * @return {Function}          Action thunk
 */

function requestComments(postId) {
	return function (dispatch) {
		dispatch({
			type: COMMENTS_REQUEST,
			postId: postId
		});

		var query = {
			order: 'asc',
			post: postId
		};

		api.get('/wp/v2/comments', query).then(function (comments) {
			requestCommentCount('/wp/v2/comments', query).then(function (count) {
				dispatch({
					type: COMMENTS_REQUEST_SUCCESS,
					comments: comments,
					count: count,
					postId: postId
				});
			});
			return null;
		}).catch(function (error) {
			dispatch({
				type: COMMENTS_REQUEST_FAILURE,
				postId: postId,
				error: error
			});
		});
	};
}

/**
 * Triggers a network request to submit a new comment
 *
 * @param  {object}    comment  The comment object to be submitted
 * @return {Function}           Action thunk
 */
function submitComment(comment) {
	return function (dispatch) {
		dispatch({
			type: COMMENT_SUBMIT_REQUEST,
			postId: comment.post
		});

		return submitCommentRequest(comment).then(function (data) {
			dispatch({
				type: COMMENT_SUBMIT_REQUEST_SUCCESS,
				comment: data,
				postId: comment.post
			});
			return data;
		}).catch(function (error) {
			dispatch({
				type: COMMENT_SUBMIT_REQUEST_FAILURE,
				postId: comment.post,
				error: error
			});
			return error;
		});
	};
}

// Helper to grab the total comment count off the header
function requestCommentCount(url) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	if (url.indexOf('http') !== 0) {
		url = api.config.url + 'wp-json' + url;
	}

	if (data) {
		// must be decoded before being passed to ouath
		url += '?' + decodeURIComponent(_qs2.default.stringify(data));
		data = null;
	}

	var headers = {
		Accept: 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch(url, {
		method: 'HEAD',
		headers: headers,
		mode: 'cors',
		body: null
	}).then(function (response) {
		return parseInt(response.headers.get('X-WP-Total'), 10);
	});
}

// Helper to submit the comment with nonce header
function submitCommentRequest(data) {
	var url = api.config.url + 'wp-json/wp/v2/comments';

	var headers = {
		Accept: 'application/json',
		'X-WP-Nonce': SiteSettings.nonce,
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	return fetch(url, {
		method: 'POST',
		headers: headers,
		body: _qs2.default.stringify(data),
		mode: 'same-origin',
		credentials: 'include'
	}).then(function (response) {
		return response.text().then(function (text) {
			var json = void 0;
			try {
				json = JSON.parse(text);
			} catch (e) {
				throw { message: text, code: response.status };
			}

			if (response.status >= 300) {
				throw json;
			} else {
				return json;
			}
		});
	});
}