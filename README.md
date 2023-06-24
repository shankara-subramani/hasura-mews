# Hasura x MEWS

[Hasura](https://hasura.io/) gives you instant GraphQL / Rest API on top of SQL databases like Postgres and MySQL. You can also use Hasura Remote Joins to join data from your Postgres database with MEWS API in GraphQL. 

## Step 1: Setup Hasura Instance
* Signup to [Hasura Cloud](https://cloud.hasura.io/signup)
* Create a free tier project

## Step 2: Configure & Deploy Custom Resolver
* I've created a project in Glitch so you can remix and spin up your own project. 
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button-v2.svg)](https://glitch.com/edit/#!/remix/hasura-mews)
* MEWS has a demo environment which you can use to test the integration. Get the environment's credentials [here](https://mews-systems.gitbook.io/connector-api/getting-started#quick-start)
* Now head over to `.env` file in Glitch and add these
   * `MEWS_BASE_URL`
   * `MEWS_CLIENT_TOKEN`
   * `MEWS_ACCESS_TOKEN`
   * `MEWS_CLIENT`
* Click on **Share** at the top of the Glitch UI and copy the 'Live Site' URL.

## Step 3: Add Remote Schema
In Hasura Console, go to the **Remote Schemas** tab.
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l04mn1naprkmbzd19lmn.png)
## Step 4: Start querying reservations
```
query getReservationsFromMEWS($startUTC: String!, $endUTC: String!) {
  getReservations(startUTC: $startUTC, endUTC: $endUTC) {
    Reservations {
      Id
      CustomerId
      AssignedResourceId
      Customer {
        Id
        FirstName
      }
      Room {
        Id
        State
      }
    }
  }
}
```

Add variables to the query
```
{
  "startUTC": "2023-06-01T00:00:00Z",
  "endUTC": "2023-06-02T00:00:00Z"
}
```
Voila!
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ldlivfcqp92ws5xgrhdb.png)

