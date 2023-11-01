import { EnvSettings, GraphQL } from "./context";

interface Repository {
  id: string
  name: string
}
export const fetchRepositories = async (env: EnvSettings, requestGraphql: GraphQL): Promise<Repository[]> => {
  const query = createRepositoriesInPrjQuery(env.organization!, env.projectNumber)
  const projectQueryResult: any = await requestGraphql(query)
  const repositories: Repository[] = projectQueryResult.organization.projectV2.repositories.nodes
  return repositories
};

const createRepositoriesInPrjQuery = (organization: string, projectNumber: number) => {
  return `
    query {
      organization(login: "${organization}") {
        name,
        projectV2(number: ${projectNumber}) {
          repositories(first: 100) {
            nodes {
              name
              id
            }
          }
        }
      }
    }
  `
}
