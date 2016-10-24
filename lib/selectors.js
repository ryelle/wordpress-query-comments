"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComment = getComment;
exports.getCommentsForPost = getCommentsForPost;
exports.isRequestingCommentsForPost = isRequestingCommentsForPost;
exports.getTotalCommentsForPost = getTotalCommentsForPost;
exports.isSubmittingCommentOnPost = isSubmittingCommentOnPost;
/**
 * Returns a comment object by its global ID.
 *
 * @param  {Object} state    Global state tree
 * @param  {String} globalId Comment global ID
 * @return {Object}          Comment object
 */
function getComment(state, globalId) {
  return state.comments.items[globalId];
}

/**
 * Returns an array of comments for a given post, or null if no comments have
 * been received.
 *
 * @param  {Object}  state   Global state tree
 * @param  {int}     postId  Post ID for the queried post
 * @return {?Array}          Comments for the given post
 */
function getCommentsForPost(state, postId) {
  if (!state.comments.itemsOnPost[postId]) {
    return null;
  }

  return state.comments.itemsOnPost[postId].map(function (globalId) {
    return getComment(state, globalId);
  }).filter(Boolean);
}

/**
 * Returns true if currently requesting comments for a post ID, or false
 * otherwise.
 *
 * @param  {Object}  state   Global state tree
 * @param  {int}     postId  Post ID for the queried post
 * @return {Boolean}         Whether comments are being requested
 */
function isRequestingCommentsForPost(state, postId) {
  return !!state.comments.requests[postId];
}

/**
 * Returns the number of total comments available for a given post
 *
 * @param  {Object}  state   Global state tree
 * @param  {int}     postId  Post ID for the queried post
 * @return {int}             Number of comments
 */
function getTotalCommentsForPost(state, postId) {
  if (!state.comments.totals[postId]) {
    return 0;
  }

  return parseInt(state.comments.totals[postId], 10);
}

/**
 * Returns true if currently submitting a comment on a given post ID, or
 * false otherwise.
 *
 * @param  {Object}  state   Global state tree
 * @param  {int}     postId  Post ID for the queried post
 * @return {Boolean}         Whether a comment is being submitted
 */
function isSubmittingCommentOnPost(state, postId) {
  return !!state.comments.isSubmitting[postId];
}