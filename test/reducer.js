/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import keyBy from 'lodash/keyBy';

/**
 * Internal dependencies
 */
import {
	// action-types
	COMMENTS_REQUEST,
	COMMENTS_REQUEST_SUCCESS,
	COMMENTS_REQUEST_FAILURE,
	COMMENT_SUBMIT_REQUEST,
	COMMENT_SUBMIT_REQUEST_SUCCESS,
	COMMENT_SUBMIT_REQUEST_FAILURE,
	// reducers
	items,
	itemsOnPost,
	requests,
	totals,
	isSubmitting
} from '../src/state';

import commentsOn1 from './fixtures/forPost1';
import commentsOn149 from './fixtures/forPost149';
import comment from './fixtures/single';

describe( 'Comment reducer', () => {
	describe( 'items', () => {
		it( 'should have no change by default', () => {
			const newState = items( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should store the new comments in state', () => {
			const newState = items( undefined, { type: COMMENTS_REQUEST_SUCCESS, comments: commentsOn1 } );
			const commentsById = keyBy( commentsOn1, 'id' );
			expect( newState ).to.eql( commentsById );
		} );

		it( 'should add new comments to the existing comment array', () => {
			const originalState = deepFreeze( keyBy( commentsOn1, 'id' ) );
			const newState = items( originalState, { type: COMMENTS_REQUEST_SUCCESS, comments: commentsOn149 } );
			const commentsById = keyBy( commentsOn149, 'id' );
			expect( newState ).to.eql( { ...originalState, ...commentsById } );
		} );

		it( 'should add submitted comments onto the existing comment array', () => {
			const originalState = deepFreeze( keyBy( commentsOn1, 'id' ) );
			const newState = items( originalState, { type: COMMENT_SUBMIT_REQUEST_SUCCESS, comment } );
			expect( newState ).to.eql( { ...originalState, 39: comment } );
		} );
	} );

	describe( 'itemsOnPost', () => {
		it( 'should have no change by default', () => {
			const newState = itemsOnPost( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should store the new post-comment relationships in empty state', () => {
			const newState = itemsOnPost( undefined, { type: COMMENTS_REQUEST_SUCCESS, comments: commentsOn1, postId: 1 } );
			const commentIds = commentsOn1.map( ( c ) => c.id );
			expect( newState ).to.eql( { 1: commentIds } );
		} );

		it( 'should store the new post-comment relationships, not overwriting exiting state', () => {
			let commentIds = commentsOn1.map( ( c ) => c.id );
			const originalState = deepFreeze( { 1: commentIds } );
			const newState = itemsOnPost( originalState, { type: COMMENTS_REQUEST_SUCCESS, comments: commentsOn149, postId: 149 } );
			commentIds = commentsOn149.map( ( c ) => c.id );
			expect( newState ).to.eql( { ...originalState, 149: commentIds } );
		} );

		it( 'should add submitted comments into the correct post array', () => {
			const commentIds = commentsOn149.map( ( c ) => c.id );
			const originalState = deepFreeze( { 149: commentIds } );
			const newState = itemsOnPost( originalState, { type: COMMENT_SUBMIT_REQUEST_SUCCESS, comment, postId: 149 } );
			expect( newState ).to.eql( { 149: [ ...originalState[ 149 ], 39 ] } );
		} );
	} );

	describe( 'requests', () => {
		it( 'should have no change by default', () => {
			const newState = requests( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the requesting state of a new comment', () => {
			const newState = requests( undefined, { type: COMMENTS_REQUEST, postId: 149 } );
			expect( newState ).to.eql( { 149: true } );
		} );

		it( 'should track the requesting state of successful comment requests', () => {
			const originalState = deepFreeze( { 149: true } );
			const newState = requests( originalState, { type: COMMENTS_REQUEST_SUCCESS, postId: 149 } );
			expect( newState ).to.eql( { 149: false } );
		} );

		it( 'should track the requesting state of failed comment requests', () => {
			const originalState = deepFreeze( { 149: true } );
			const newState = requests( originalState, { type: COMMENTS_REQUEST_FAILURE, postId: 149 } );
			expect( newState ).to.eql( { 149: false } );
		} );

		it( 'should track the requesting state of additional comment requests', () => {
			const originalState = deepFreeze( { 149: false } );
			const newState = requests( originalState, { type: COMMENTS_REQUEST, postId: 1 } );
			expect( newState ).to.eql( { ...originalState, 1: true } );
		} );
	} );

	describe( 'totals', () => {
		it( 'should have no change by default', () => {
			const newState = totals( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track the total comment count for requested posts', () => {
			const action = {
				type: COMMENTS_REQUEST_SUCCESS,
				count: 3,
				postId: 1,
			};
			const newState = totals( undefined, action );
			expect( newState ).to.eql( { 1: 3 } );
		} );

		it( 'should track the total comment count for additional requested posts', () => {
			const originalState = deepFreeze( { 1: 3 } );
			const action = {
				type: COMMENTS_REQUEST_SUCCESS,
				count: 10,
				postId: 149,
			};
			const newState = totals( originalState, action );
			expect( newState ).to.eql( {
				1: 3,
				149: 10
			} );
		} );

		it( 'should track the total comment count including submitted comments', () => {
			const originalState = deepFreeze( { 1: 3 } );
			const action = {
				type: COMMENT_SUBMIT_REQUEST_SUCCESS,
				postId: 2,
			};
			const newState = totals( originalState, action );
			expect( newState ).to.eql( {
				1: 3,
				2: 1
			} );
		} );
	} );

	describe( 'isSubmitting', () => {
		it( 'should have no change by default', () => {
			const newState = isSubmitting( undefined, {} );
			expect( newState ).to.eql( {} );
		} );

		it( 'should track that a comment is being submitted', () => {
			const action = {
				type: COMMENT_SUBMIT_REQUEST,
				postId: 1,
			};
			const newState = isSubmitting( undefined, action );
			expect( newState ).to.eql( { 1: true } );
		} );

		it( 'should track that a comment has been successfully submitted', () => {
			const originalState = deepFreeze( { 1: true } );
			const action = {
				type: COMMENT_SUBMIT_REQUEST_SUCCESS,
				postId: 1,
			};
			const newState = isSubmitting( originalState, action );
			expect( newState ).to.eql( { 1: false } );
		} );

		it( 'should track that a comment has failed to submit', () => {
			const originalState = deepFreeze( { 1: true } );
			const action = {
				type: COMMENT_SUBMIT_REQUEST_FAILURE,
				postId: 1
			};
			const newState = isSubmitting( originalState, action );
			expect( newState ).to.eql( { 1: false } );
		} );

		it( 'should track that a second comment is being submitted', () => {
			const originalState = deepFreeze( { 1: true } );
			const action = {
				type: COMMENT_SUBMIT_REQUEST,
				postId: 2,
			};
			const newState = isSubmitting( originalState, action );
			expect( newState ).to.eql( { ...originalState, 2: true } );
		} );
	} );
} );
