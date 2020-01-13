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
Now that we have our `RootQuery` and `CustomerType` set up to handle queries and to model our data respectively, we can... query our schema!

So we're using GraphiQL to handle querying and mutating our schema and in order to pull that up, we need to start our Express Server, and our JSON server(our JSON server pulls up some mock data real fast).

But before we do that, we actually need to add the query to `RootQuery`. You'll note that within our `RootQuery` the resolve function/ method is incomplete. This resolve function is the callback that GraphQL uses to query our Schema. So when we complete that it looks like the below:
```js
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',

  // Need fields here just like in the above
  fields: () => ({
    // QUERY query for one customer
    customer: {
      type: CustomerType,

      // Args is how you query the customer "DB"
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // Temporary since hardcoded
        return axios.get(customersJsonEnd + args.id)
          .then(res => res.data);
      },
    },
    // QUERY query for all customers
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return HARD CODED customers
        return axios.get(customersJsonEnd)
        .then(res => res.data);
      }
    }
  }),
});
```

You'll also note that we return an axios call to our JSON data. The way we're using GraphQL right now, we're mostly just using GraphQL to wrap database calls and presenting the result to Express.

Now that we have that, we can query our Schema for a specific doc like so:

```
{
  customers(id: "1") {
    id,
    name,
    age,
    email
  }
}
```

And for all of the data we can do:

```
{
  customer{
    id,
    name,
    age,
    email
  }
}
```

## Mutations/ CRUD ops
Mutations have a similar struction to Queries, but we add them to our schema slightly differently. It still holds the same shape as our Queries. First, it needs a fields prop, but it's not an arrow function this time. In addition, every field resolves differently, and may take multiple args. See below for more.
```js
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        // GraphQLNonNull is for required types
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios.post(customersJsonEnd, args)
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete(customersJsonEnd + args.id)
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        // pass entire args param since it's an object
        return axios.patch(customersJsonEnd + args.id, args).then(res => res.data);
      }
    }
  }
})
```

Then when we go into GraphiQL, we execute mutations like so:
```
mutation {
  addCustomer(name:"William Harrison", email: "wharrison@email.com", age:42){
    id,
    name,
    email,
    age
  }
}

mutation {
  updateCustomer(id: "pi61xPt", email: "wharrison123@email.com"){
    id,
    name,
    email,
    age
  }
}
```

## Final Stuff
And that's it, note that we've only used GraphQL to update a `data.json` file and we've only interacted with it via GraphiQL. We obviously won't be doing this in a live app, but this is more or less just a start to what you can do with GraphQL.