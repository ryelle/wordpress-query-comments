WordPress Query Comments
========================

This package contains a query component, along with redux state & selectors for posts pulled from a WordPress site. This uses the [`node-wpapi`](https://github.com/WP-API/node-wpapi) package to get your site's data via Query Components ([inspired by calypso](https://github.com/Automattic/wp-calypso/blob/master/docs/our-approach-to-data.md#query-components)). The Query Components call the API, which via actions set your site's data into the state.

Query Comments
==============

Query Comments is a React component used in managing the fetching of comments on a post or page.

## Usage

Render the component, passing in the `postId`. It does not accept any children, nor does it render any elements to the page. You can use it adjacent to other sibling components which make use of the fetched data made available through the global application state.

```jsx
import React from 'react';
import QueryComments from 'wordpress-query-comments';
import MyCommentsListItem from './list-item';

export default function MyCommentsList( { comments } ) {
	return (
		<div>
			<QueryComments postId={ 27 } />
			{ comments.map( ( comment ) => {
				return (
					<MyCommentsListItem
						key={ comment.id }
						comment={ comment } />
				);
			} }
		</div>
	);
}
```

## Props

### `postId`

<table>
	<tr><th>Type</th><td>Integer</td></tr>
	<tr><th>Required</th><td>Yes</td></tr>
	<tr><th>Default</th><td><code>null</code></td></tr>
</table>

The post (or page) to grab comments from.

Comment Selectors
=================

You can import these into your project by grabbing them from the `selectors` file:

```jsx
import { getCommentsForPost, isRequestingCommentsForPost } from 'wordpress-query-comments/lib/selectors';
```

#### `getComment( state, globalId )`

#### `getCommentsForPost( state, postId )`

#### `isRequestingCommentsForPost( state, postId )`

#### `getTotalCommentsForPost( state, postId )`

#### `isSubmittingCommentOnPost( state, postId )`

Comment State
=============

If you need access to the reducers, action types, or action creators, you can import these from the `state` file. For example, to use this in your global redux state, mix it into your reducer tree like this:

```jsx
import comments from 'wordpress-query-comments/lib/state';

let reducer = combineReducers( { ...otherReducers, comments } );
```

If you need to call an action (the query component should take care of this most of the time), you can pull the action out specifically:

```jsx
import { submitComment } from 'wordpress-query-comments/lib/state';
```

[View the file itself](src/state.js) to see what else is available.
