# MrMat Maturity Reporting Action

This action reports on project maturity in the form of a comment on a PR.

## Inputs

### lint_format

Format of the lint report (one of 'mypy', 'eslint'). Defaults to 'eslint'.

### lint_report

Path to the lint report.

### unit_test_format

Format of the unit test report (one of 'junit'). Defaults to 'junit'.

### unit_test_report

Path to the unit test report.

### coverage_format

Format of the coverage report (one of 'cobertura', 'json'). Defaults to 'cobertura'.

### coverage_report

Path to the coverage reprort.

## Outputs

### report

The output report in Markdown format.

## Example usage

```yaml
uses: actions/mrmat-maturity-reporting-action@v1.0.0
with:
  lint_format: eslint
  lint_report: lint-report.json
  unit_test_format: junit
  unit_test_report: unit-test-report.xml
  coverage_format: cobertura
  coverage_report: coverage-report.xml
```

## How to build this

Run `npm install` and then `npm run bundle`.

## How to test this

### Running the action locally

Create `.env` based on `.env.example`, but do not commit it to your repo. Set
values in that file to simulate execution within a GitHub Workflow and execute
`npx @github/local-action . src/main.ts .env`.
