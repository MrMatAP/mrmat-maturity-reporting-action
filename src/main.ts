import * as core from '@actions/core'

import { parse_lint_report } from './lint.js'
import { parse_coverage_report } from './coverage.js'
import { parse_unit_test_report } from './unit_test.js'

export function run() {
    try {
        const lint_format: string = core.getInput('lint_format')
        const lint_report: string = core.getInput('lint_report')
        const unit_test_format: string = core.getInput('unit_test_format')
        const unit_test_report: string = core.getInput('unit_test_report')
        const coverage_format: string = core.getInput('coverage_format')
        const coverage_report: string = core.getInput('coverage_report')

        core.info(`Reading unit test report from ${unit_test_report}}`)
        core.info(`Reading coverage report from ${coverage_report}}`)

        let report: string = '# Maturity Report\n\n'
        report += parse_lint_report(lint_format, lint_report).markdown()
        report += parse_unit_test_report(
            unit_test_format,
            unit_test_report
        ).markdown()
        report += parse_coverage_report(
            coverage_format,
            coverage_report
        ).markdown()
        core.info(report)
        core.setOutput('report', report)
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}
