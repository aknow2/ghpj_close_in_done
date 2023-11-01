import * as dotenv from 'dotenv';
import {shouldBeClosedIssuesObservable } from './lib/issue_collector';
import { contextObservable } from './lib/context';
import { closeIssueAndLog } from './lib/issue_closer';
import { map, mergeMap } from 'rxjs';
import { Issue } from './lib/issue';
import { graphql } from '@octokit/graphql/dist-types/types';

dotenv.config();
contextObservable
  .pipe(
    mergeMap(([env, requestGraphQL]) => 
      shouldBeClosedIssuesObservable([env, requestGraphQL]).pipe(
        map<Issue, [Issue, graphql]>((issue) => {
          return [issue, requestGraphQL]
        })
      )
    ),
    mergeMap(([issue, requestGraphQL]) => {
      return closeIssueAndLog(issue, requestGraphQL)
    }),
  ).subscribe()
