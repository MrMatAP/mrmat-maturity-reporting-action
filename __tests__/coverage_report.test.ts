/**
 * Unit tests for coverage_report.ts
 */

import { parse_coverage_report } from '../src/coverage.js'

describe('Coverage Reporting', () => {
    it('States no coverage is present without a report', () => {
        expect(
            parse_coverage_report('Cobertura', '/foo/bar.xml').markdown()
        ).toContain('No coverage report present')
    })
    test.each([
        {
            coverage_format: 'cobertura',
            coverage_report: '__tests__/samples/python/coverage.xml',
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
        },
        {
            coverage_format: 'json',
            coverage_report: '__tests__/samples/typescript/coverage-summary.json',
            expected: {
                tool: 'json',
                total_lines: 86,
                total_lines_covered: 82,
                total_lines_pct: 95.34,
                total_branches: 20,
                total_branches_covered: 16,
                total_branches_pct: 80
            }
        }
    ])(
        'Returns $expected',
        ({ coverage_format, coverage_report, expected }) => {
            expect(
                parse_coverage_report(coverage_format, coverage_report)
            ).toMatchObject(expected)
        }
    )
})
