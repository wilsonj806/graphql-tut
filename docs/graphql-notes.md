# GraphQL Notes
## Setting up
So before we use GraphQL, we need to do some setup. Setting up the Express server is very straightforwards.

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
