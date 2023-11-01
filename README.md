# issue_closer
This is a tool of GithubProject Kanban to close issues that are in Done but remain OPEN.


## requirement
[Bun](https://bun.sh/) or [Docker](https://www.docker.com/get-started/) 

## Usage
#### To install dependencies:

```bash
cd app
bun install
```
or 

```bash
docker-compose run issue_closer bun install
```

#### To set up .env
1. Move to app `cd app`
1. Touch `.env`
2. Set up `.env`
  
The following is an example of closing an issue in a particular Github Project with an item name of `Status` and a value of `Done`
``` .env
GITHUB_TOKEN=xxxxxxxx # github api token
ORGANIZATION=SomeOrganization # organization name
ITEM_FIELD_KEY=Status # Item field Key.
ITEM_FIELD_VALUE=Done # Item field value.
PROJECT_NUMBER=3 # project number
```

#### To run:

``` bash
cd app
bun run index.ts
```
Run with Docker-compose
``` bash
docker-compose run  issue_closer bun run index.ts
```

