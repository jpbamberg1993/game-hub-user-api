<!--
title: TODO
description: Started code for an AWS Lambda function with TypeScript and DynamoDB.
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorLink: 'https://github.com/jpbamberg1993'
authorName: Paul Bamberg
authorAvatar: 'https://avatars.githubusercontent.com/u/11944078?v=4'
-->

# Introduction

This is based on a mashup of existing templates from [serverless examples](https://github.com/serverless/examples).

# Set Up

```shell
npx sls create -u https://github.com/jpbamberg1993/ts-express-dynamodb-local \
-p <project-name>
```

```shell
cd <project-name> && npm install
```

## Run locally

```shell
serverless dynamodb install (or to use a persistent docker dynamodb: cd ./dynamodb && docker-compose up -d)
serverless offline start
serverless dynamodb migrate (this imports schema)
```

You may need to explicitly install the plugin before running the migration:
```shell
serverless plugin install --name serverless-dynamodb-local
```

# Deploy

Change the serverless.yml service name to something appropriate to your project name.

# Usage

You can create, retrieve, update, or delete todos with the following commands:

## Create a Todo

```bash
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos \
--data '{ "text": "Learn Serverless" }'
```

Example Result:
```json
{
  "text": "Learn Serverless",
  "id": "ee6490d0-aa11e6-9ede-afdfa051af86",
  "createdAt": 1479138570824,
  "checked": false,
  "updatedAt": 1479138570824
}
```

## List all Todos

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos
```

Example output:
```json
[
    {
        "createdAt": 1685389638743,
        "checked": false,
        "id": "2ee59d62-2d6c-4ccc-9741-d5613cd733e0",
        "text": "Copy into project template",
        "updatedAt": 1685394074752
    },
    {
        "checked": false,
        "createdAt": 1685389514822,
        "id": "6891f4e7-9467-418c-b652-ece676a29997",
        "text": "Get Brenda's present",
        "updatedAt": 1685389514822
    },
    {
        "checked": false,
        "createdAt": 1683651295371,
        "id": "395df5b0-ee8a-11ed-922d-eda87f5bf095",
        "text": "Learn Serverless",
        "updatedAt": 1683651295371
    }
]
```

## Get one Todo

```bash
# Replace the <id> part with a real id from your todos table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos/<id>
```

Example Result:
```json
{
    "createdAt": 1685389638743,
    "checked": false,
    "id": "2ee59d62-2d6c-4ccc-9741-d5613cd733e0",
    "text": "Copy into project template",
    "updatedAt": 1685394074752
}
```

## Update a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos/<id> \
--data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:
```json
{
    "createdAt": 1685389638743,
    "checked": false,
    "id": "2ee59d62-2d6c-4ccc-9741-d5613cd733e0",
    "text": "Copy into project template",
    "updatedAt": 1685394074752
}
```
