import { graphql } from "@octokit/graphql/dist-types/types"
import { GraphQL } from "./context"
import { Issue } from "./issue"
import { EMPTY, catchError, of, tap } from "rxjs"

const closeIssue = async (issue: Issue, requestGraphql: GraphQL) => {
  const closeIssueMutation = `
  mutation CloseIssue {
    updateIssue(input:{id:"${issue.id}", state:CLOSED}) {
      issue {
        id
        title
        state
        repository {
          nameWithOwner
        }
      }
    }
  }
  `
  await requestGraphql(closeIssueMutation)
}

export const closeIssueAndLog = (issue: Issue, requestGraphQL: graphql) => 
  of(closeIssue(issue, requestGraphQL)).pipe(
    tap(() => console.log('close', issue.title)),
    catchError(e => {
      console.log('failed to close', issue.title);
      console.trace(e);
      return EMPTY;
    })
  );
