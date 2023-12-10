# CSRF Example

This repository has a POC (proof of concept) on how a graphql server can be vulnerable to a CSRF attack when implementing file upload by itself.

## Getting started

This project requires node and npm to run.
I recommend installing node using the [nvm](https://github.com/nvm-sh/nvm).

## Installing dependencies

    npm run install-both

## Running the project

    npm run start

the graphql playground will be available on [http://localhost:3000/graphql](http://localhost:3000/graphql)
the client will be available on [http://localhost:3001](http://localhost:3001)

## Testing the vunerability

access the server: [http://localhost:3000/graphql](http://localhost:3000/graphql)

Run the following mutation in the graphql playground

    mutation {
      login(email: "limberg8572@uorak.com", password: "s=69r]2Lf(n{")
    }

After that an authentication cookie will be set in the browser, run the following query to get the user data:

    query {
      getUserData {
        email
      }
    }

now access the client code [http://localhost:3001](http://localhost:3001), the client code is very simple, it only has one button that makes a post request to the graphql endpoint with a hidden query that changes the user's email.

After clicking the button, go back to the graphql playground [http://localhost:3000/graphql](http://localhost:3000/graphql) and run the query to get the user data:

     query {
          getUserData {
            email
          }
        }

you will see that the email has changed to malicious_email@email.com, basically, this is the vulnerability, the cookie defined in the login method does not have the correct security flags, so it can cross domains, and because this graphql has a mutation that accepts multipart /form-data, it is possible to perform any mutation on the server because the server does not check whether the mutation that comes from multipart/form-data is a mutation to upload a file for example, so it accepts any mutation.
