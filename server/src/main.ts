import { createServer } from "http";
import { createYoga, createSchema, YogaInitialContext } from "graphql-yoga";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { useCookies } from "@whatwg-node/server-plugin-cookies";

const PORT = process.env.PORT ?? 3000;

const secret = "7AoG8^%5e!ih71b:LG78j[C`:y`%#o";

const mockUser = {
  email: "limberg8572@uorak.com",
  password: "s=69r]2Lf(n{",
};

const yoga = createYoga({
  graphiql: true,
  schema: createSchema({
    typeDefs: `
        scalar File

        type User {
            email: String
        }

        type Query {
            hello: String
            getUserData: User
        }

        type Mutation {
            login(email: String!, password: String!): Boolean
            changeEmail(newEmail: String!): Boolean
            saveFile(file: File!): Boolean
        }
    `,
    resolvers: {
      Query: {
        hello() {
          return "hello";
        },
        getUserData() {
          return { email: mockUser.email };
        },
      },
      Mutation: {
        async changeEmail(
          _: unknown,
          { newEmail }: { newEmail: string },
          { request }: YogaInitialContext
        ) {
          const sessionToken = await request.cookieStore?.get("session");

          if (sessionToken) {
            mockUser.email = newEmail;

            return true;
          }

          return false;
        },
        async login(
          _: unknown,
          { email, password }: { email: string; password: string },
          { request }: YogaInitialContext
        ) {
          const correctCredentials =
            email === mockUser.email && password === mockUser.password;

          if (correctCredentials) {
            const token = jwt.sign({ email: mockUser.email }, secret);

            await request.cookieStore?.set("session", token);

            return true;
          }

          return false;
        },
        async saveFile(_, { file }: { file: File }) {
          try {
            const fileArrayBuffer = await file.arrayBuffer();
            await fs.promises.writeFile(
              path.join(__dirname, file.name),
              Buffer.from(fileArrayBuffer)
            );
            return true;
          } catch {
            return false;
          }
        },
      },
    },
  }),
  plugins: [useCookies()],
});

createServer(yoga).listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}/graphql`);
});
