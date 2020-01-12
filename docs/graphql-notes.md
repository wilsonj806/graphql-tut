# GraphQL Notes
## Setting up
So before we use GraphQL, we need to do some setup. Setting up the Express server is very straightforwards and to access the GraphIQL, we're defining a `/graphql` route.

Setting up the schema is also fairly straight-forwards, it's similar to setting up a Mongoose model, but with some differences.

First, we need to have a schema file where our export is a `GraphQLSchema` with a `RootQuery`. The root query is how we build out the rest of our GraphQL Schema and how we query our different "models". Our export looks like the below:

```js
  module.exports = new GraphQLSchema({ query: RootQuery })
```

And our `RootQuery` looks like:

```js
  const RootQuery = new GraphQLObjectType({
    name       : 'RootQueryType,
    fields     : () => ({
      customer : { type: CustomerType },
      args     : {
        id : { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // resolution function to be called
      }
    })
  })
```

We'll also need a CustomerType and that looks like a User document in Mongoose:

```js
const CustomerType = new GraphQLObjectType({
  name: 'CustomerType',

  // Fields returns an object with your schema
  fields: () => ({
    id : { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
});
```

## Making Queries