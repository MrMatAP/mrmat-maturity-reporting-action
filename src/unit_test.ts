import * as core from '@actions/core'

import { Report } from './report.js'
import * as fs from 'node:fs'
import path from 'node:path'

export class UnitTestReport implements Report {
        tool: string = 'Unknown'

    constructor(tool: string) {
        this.tool = tool ?? this.tool
    }

    markdown(): string {
        let report = '## Unit Test Report\n\n'
        if (this.tool === 'missing') {
            report += 'No unit test report present\n\n'
            return report
        }
        report += `Tool: ${this.tool}\n`
        return report
    }
}

function junit_report(report_path: string) {
    const report = new UnitTestReport('junit')
    return report
}

export function parse_unit_test_report(
    unit_test_format: string,
    unit_test_report: string
): Report {
    const report_path = path.resolve(unit_test_report)
    if (!fs.existsSync(report_path)) return new UnitTestReport('missing')
    core.info(`Parsing unit test report: ${report_path}`)
    switch (unit_test_format.toLowerCase()) {
        case 'junit':
            return junit_report(report_path)
        default:
            throw new Error(`Unknown unit test format: ${unit_test_format}`)
    }
}
