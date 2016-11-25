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

describe( 'Post reducer', () => {
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
	} );

	describe( 'isSubmitting', () => {
		it( 'should have no change by default', () => {
			const newState = isSubmitting( undefined, {} );
			expect( newState ).to.eql( {} );
		} );
	} );
} );
