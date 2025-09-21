import * as core from '@actions/core'

import { parse_lint_report } from './lint.js'
import { parse_coverage_report } from './coverage.js'

export function run() {
    try {
        const lint_report: string = core.getInput('lint_report')
        const unit_test_report: string = core.getInput('unit_test_report')
        const coverage_report: string = core.getInput('coverage_report')

        core.info(`Reading unit test report from ${unit_test_report}}`)
        core.info(`Reading coverage report from ${coverage_report}}`)

        let report: string = '# Maturity Report'
        report += parse_lint_report(lint_report).markdown()
        report += parse_coverage_report(coverage_report).markdown()
        core.info(report)
        core.setOutput('report', report)
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}
