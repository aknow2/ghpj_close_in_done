import { graphql } from "@octokit/graphql";
import { map, of } from "rxjs";

const getEnv = () => {
  const organization = process.env.ORGANIZATION as string;
  const githubToken = process.env.GITHUB_TOKEN as string;
  const projectNumber = parseInt(process.env.PROJECT_NUMBER as string);
  const status = process.env.ITEM_FIELD_KEY as string;
  const closeStatus = process.env.ITEM_FIELD_VALUE;

  return {
    organization,
    status,
    githubToken,
    projectNumber,
    closeStatus,
  }
}
export type EnvSettings = ReturnType<typeof getEnv>;
export type GraphQL = typeof graphql;
export type Context = [EnvSettings, GraphQL]

const mergeGHGraphqlClient = map((env: EnvSettings): Context => {
  const requestGraphql = graphql.defaults({
    headers: {
      authorization: `token ${env.githubToken}`,
    },
  });
  return [env, requestGraphql]
})

export const contextObservable =  of(getEnv())
  .pipe(
    mergeGHGraphqlClient,
  )
