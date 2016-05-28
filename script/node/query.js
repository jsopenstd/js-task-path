#!/usr/bin/env node

const jsonQuery = require("json-query"),
      yaml      = require("yamljs");

const JSON = "/vagrant/package.json",
      YAML = "/vagrant/.env.yml";

function exists(object) {
    return object !== null
        && typeof object !== "undefined";
}

function echo(value) {
    console.log("{@" + value + "@}");
}

function get(fileType) {
    switch (fileType) {
        case JSON:
            return require("/vagrant/package.json");

        case YAML:
            return yaml.load("/vagrant/.env.yml");

        default:
            throw new Error("Unknown fileType: \"" + fileType + "\"");
    }
}

function query(fileType) {
    return jsonQuery(
            queryArg,
            {
                data : get(fileType)
            }
        )
        .value;
}

const typeArg  = process.argv[2],
      fileArg  = process.argv[3],
      queryArg = process.argv[4];

switch (typeArg) {
    case "exists":
    case "has":
        switch (fileArg) {
            case "package":
            case "package.json":
                echo(exists(query(JSON)));
                break;

            case ".env":
            case ".env.yml":
                echo(exists(query(YAML)));
                break;
        }
        break;

    case "query":
    case "get":
        switch (fileArg) {
            case "package":
            case "package.json":
                echo(query(JSON));
                break;

            case ".env":
            case ".env.yml":
                echo(query(YAML));
                break;
        }
        break;
}
