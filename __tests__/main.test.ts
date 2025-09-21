import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as github from '../__fixtures__/github.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/github', () => github)

const { run } = await import('../src/main.js')

describe('GitHub Actions Interface', () => {
    test.each([
        {
            lint_format: 'mypy',
            lint_report: '__tests__/samples/python/lint.xml',
            unit_test_format: 'junit',
            unit_test_report: '__tests__/samples/python/unit.xml',
            coverage_format: 'cobertura',
            coverage_report: '__tests__/samples/python/coverage.xml'
        },
        {
            lint_format: 'eslint',
            lint_report: '__tests__/samples/typescript/lint.json',
            unit_test_format: 'junit',
            unit_test_report: '__tests__/samples/typescript/unit.xml',
            coverage_format: 'cobertura',
            coverage_report: '__tests__/samples/typescript/coverage.xml'
        }
    ])(
        'Returns $expected',
        ({
            lint_format,
            lint_report,
            unit_test_format,
            unit_test_report,
            coverage_format,
            coverage_report
        }) => {
            core.getInput.mockImplementation((input: string) => {
                switch (input) {
                    case 'lint_format':
                        return lint_format
                    case 'lint_report':
                        return lint_report
                    case 'unit_test_format':
                        return unit_test_format
                    case 'unit_test_report':
                        return unit_test_report
                    case 'coverage_format':
                        return coverage_format
                    case 'coverage_report':
                        return coverage_report
                    default:
                        throw new Error(`Unexpected input: ${input}`)
                }
            })

            run()
            expect(core.setOutput).toHaveBeenCalled()
            jest.resetAllMocks()
        }
    )
})
