/**
 * Unit tests for coverage_report.ts
 */

import { parse_coverage_report } from '../src/coverage.js'

describe('Coverage Reporting', () => {
    it('States no coverage is present without a report', () => {
        expect(parse_coverage_report('/foo/bar.xml').markdown()).toContain(
            'No coverage report present'
        )
    })
    test.each([
        {
            lint_report: '__tests__/samples/python/coverage.xml',
            expected: {
                tool: 'cobertura',
                version: '7.10.6',
                timestamp: '1758450878994',
                total_lines: 970,
                total_lines_covered: 431,
                total_lines_pct: 0.4443,
                total_branches: 102,
                total_branches_covered: 34,
                total_branches_pct: 0.3333,
                complexity: 0
            }
        }
    ])(`Returns $expected`, ({ lint_report, expected }) => {
        expect(parse_coverage_report(lint_report)).toMatchObject(expected)
    })
})
