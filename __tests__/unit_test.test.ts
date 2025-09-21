/**
 * Unit tests for unit_test.ts
 */

import { parse_unit_test_report } from '../src/unit_test.js'

describe('Unit Test Reporting', () => {
    it('States no unit tests are present without a report', () => {
        expect(
            parse_unit_test_report('junit', '/foo/bar.xml').markdown()
        ).toContain('No unit test report present')
    })
    test.each([
        {
            unit_test_format: 'junit',
            unit_test_report: '__tests__/samples/python/junit.xml',
            expected: {
                tool: 'junit',
                errors: 0,
                failures: 0,
                skipped: 0,
                tests: 29,
                time: 8.467
            }
        }
    ])(
        'Returns $expected',
        ({ unit_test_format, unit_test_report, expected }) => {
            expect(
                parse_unit_test_report(unit_test_format, unit_test_report)
            ).toMatchObject(expected)
        }
    )
})
