/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { keyBy } from 'lodash';

/**
 * Internal dependencies
 */
import * as selectors from '../src/selectors';
import commentsOn1 from './fixtures/forPost1';

const commentsById = keyBy( commentsOn1, 'id' );

const state = deepFreeze( {
	comments: {
		items: commentsById,
		requests: {
			1: false,
			149: true,
		},
		totals: {
			1: 2,
		},
		itemsOnPost: {
			1: [ 2, 1 ],
		},
		isSubmitting: {
			1: false,
			3: true,
		}
	}
} );

describe( 'Comment selectors', function() {
	it( 'should contain isRequestingCommentsForPost method', function() {
		expect( selectors.isRequestingCommentsForPost ).to.be.a( 'function' );
	} );

	it( 'should contain getCommentsForPost method', function() {
		expect( selectors.getCommentsForPost ).to.be.a( 'function' );
	} );

	it( 'should contain getComment method', function() {
		expect( selectors.getComment ).to.be.a( 'function' );
	} );

	it( 'should contain getTotalCommentsForPost method', function() {
		expect( selectors.getTotalCommentsForPost ).to.be.a( 'function' );
	} );

	it( 'should contain isSubmittingCommentOnPost method', function() {
		expect( selectors.isSubmittingCommentOnPost ).to.be.a( 'function' );
	} );

	describe( 'isRequestingCommentsForPost', function() {
		it( 'Should get `false` if the post has not been requested yet', function() {
			expect( selectors.isRequestingCommentsForPost( state, 3 ) ).to.be.false;
		} );

		it( 'Should get `false` if this post has already been fetched', function() {
			expect( selectors.isRequestingCommentsForPost( state, 1 ) ).to.be.false;
		} );

		it( 'Should get `true` if this post is being fetched', function() {
			expect( selectors.isRequestingCommentsForPost( state, 149 ) ).to.be.true;
		} );
	} );

	describe( 'getCommentsForPost', function() {
		it( 'Should get `null` if the post has not been requested yet', function() {
			expect( selectors.getCommentsForPost( state, 3 ) ).to.be.null;
		} );

		it( 'Should get the comment objects if this post is in our state', function() {
			expect( selectors.getCommentsForPost( state, 1 ) ).to.eql( [ commentsById[ 2 ], commentsById[ 1 ] ] );
		} );
	} );

	describe( 'getComment', function() {
		it( 'Should get `undefined` if the post for this comment has not been requested yet', function() {
			expect( selectors.getComment( state, 20 ) ).to.be.undefined;
		} );

		it( 'Should get the comment object if this comment is in our state', function() {
			expect( selectors.getComment( state, 1 ) ).to.eql( commentsById[ 1 ] );
		} );
	} );

	describe( 'getTotalCommentsForPost', function() {
		it( 'Should get zero if the post has not been requested yet', function() {
			expect( selectors.getTotalCommentsForPost( state, 20 ) ).to.eql( 0 );
		} );

		it( 'Should get the comment count if this post is in our state', function() {
			expect( selectors.getTotalCommentsForPost( state, 1 ) ).to.eql( 2 );
		} );
	} );

	describe( 'isSubmittingCommentOnPost', function() {
		it( 'Should get `false` if no comment has been submitted on this post', function() {
			expect( selectors.isSubmittingCommentOnPost( state, 2 ) ).to.be.false;
		} );

		it( 'Should get `false` if the comment on this post has already been submitted', function() {
			expect( selectors.isSubmittingCommentOnPost( state, 1 ) ).to.be.false;
		} );

		it( 'Should get `true` if the comment on this post is being submitted', function() {
			expect( selectors.isSubmittingCommentOnPost( state, 3 ) ).to.be.true;
		} );
	} );
} );
