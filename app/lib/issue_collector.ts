import { concatMap, from, map, mergeAll, mergeMap, of } from "rxjs"
import { Context, EnvSettings, GraphQL } from "./context"
import { fetchRepositories } from "./repository"
import { Issue } from "./issue"
export const fetchShouldBeClosedIssues = async (env: EnvSettings, repoName: string, requestGraphql: GraphQL) => {
  const projectItemsQuery = `query {
    organization(login: "${env.organization}") {
      repository(name: "${repoName}") {
        issues(first: 100, states: OPEN) {
          totalCount
          nodes {
            id
            title
            number
            projectItems(first: 100) {
              nodes {
                project {
                  number
                  title
                }
                status: fieldValueByName(name: "${env.status}") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                  }
                }
              }
          }
        }
      }
      }
    }
  }`
  const result: any = await requestGraphql(projectItemsQuery)
  const issues = result.organization.repository.issues

  const filteredIssues: Issue[] = issues.nodes.flatMap((issue: any) => {
    return issue.projectItems.nodes.flatMap((item: any) => {
      if (item.status?.name === env.closeStatus) {
        return [issue]
      }
      return []
    })
  })

  console.log('Target issues count', filteredIssues.length, 'in', repoName);
  return filteredIssues;
}


export const shouldBeClosedIssuesObservable = ([env, requestGraphql]: Context) =>
  from(fetchRepositories(env, requestGraphql))
    .pipe(
      mergeMap(repos => repos),
      mergeMap((repo) => fetchShouldBeClosedIssues(env, repo.name, requestGraphql)),
      mergeMap((issues) => issues)
    )
