/**
 * Unit tests for lint_report.ts
 */

import { parse_lint_report, LinterReport } from '../src/lint.js'

describe('Linter Reporting', () => {
    it('States no linter is present without a report', () => {
        expect(parse_lint_report('/foo/bar.xml').markdown()).toContain(
            'No linting report present'
        )
    })
    test.each([
        {
            lint_report: '__tests__/samples/python/lint.xml',
            expected: {
                tool: 'mypy',
                errors: 0,
                failures: 1,
                skips: 0,
                tests: 1,
                duration: '8.987',
                messages: [
                    'src/mhpython/async_tasks/base.py:79: note: By default the bodies of untyped functions are not checked, consider using --check-untyped-defs  [annotation-unchecked]',
                    'src/mhpython/finance/csv_parser.py:86: error: Missing return statement  [return]',
                    'src/mhpython/ddd/base.py:290: error: "DDDEntity" gets multiple values for keyword argument "name"  [misc]',
                    'src/mhpython/finance/pdf_parser.py:155: error: Value of type "dict[Any, Any] | BaseModel" is not indexable  [index]',
                    'src/mhpython/finance/pdf_parser.py:156: error: Value of type "dict[Any, Any] | BaseModel" is not indexable  [index]',
                    'src/mhpython/finance/pdf_parser.py:158: error: Value of type "dict[Any, Any] | BaseModel" is not indexable  [index]'
                ]
            } as LinterReport
        }
    ])(`Returns $expected`, ({ lint_report, expected }) => {
        expect(parse_lint_report(lint_report)).toMatchObject(expected)
    })
})
