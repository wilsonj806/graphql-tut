# GraphQL Tutorial
## Overview
A quick GraphQL server based on Traversy Media's tutorial video. Runs on Express, and GraphQL. This repo *DOES NOT* cover how to interact with GraphQL on the frontend or even the backend, it just shows how to set up a schema, queries, and mutations along with how to interact with the GraphiQL.

Notes can be found in the [GraphQL Notes](./docs/graphql-notes.md) document.

This tutorial repo is based on Traversy Media's [GraphQL intro video series](https://www.youtube.com/playlist?list=PLillGF-RfqbYZty73_PHBqKRDnv7ikh68)

## Why GraphQL?
GraphQL's enjoyed a recent explosion of popularity due to the way it works in contrast with REST APIs and other API formats. You still have the request, response cycle, but rather than including a whole bunch of stuff and the kitchen sink in the response, GraphQL lets you specify what exactly you want to return from your Schema and only that.

It's super slick and getting it running feels like writing a webpack config, but significantly more straight-forwards.