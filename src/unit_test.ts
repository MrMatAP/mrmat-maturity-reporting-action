import * as core from '@actions/core'

import { Report } from './report.js'
import * as fs from 'node:fs'
import path from 'node:path'
import { XMLParser } from 'fast-xml-parser'

export class UnitTestReport implements Report {
    tool: string = 'Unknown'
    errors?: number
    failures?: number
    skipped?: number
    tests?: number
    time?: number

    constructor(
        tool: string,
        errors?: number,
        failures?: number,
        skipped?: number,
        tests?: number,
        time?: number
    ) {
        this.tool = tool ?? this.tool
        this.errors = errors ?? this.errors
        this.failures = failures ?? this.failures
        this.skipped = skipped ?? this.skipped
        this.tests = tests ?? this.tests
        this.time = time ?? this.time
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

function junit_report(report_path: string): UnitTestReport {
    const xml = fs.readFileSync(report_path, { encoding: 'utf8' })
    const parser = new XMLParser({ ignoreAttributes: false })
    const doc = parser.parse(xml)
    const report = new UnitTestReport('junit')
    report.errors = parseInt(doc.testsuites.testsuite['@_errors'])
    report.failures = parseInt(doc.testsuites.testsuite['@_failures'])
    report.skipped = parseInt(doc.testsuites.testsuite['@_skipped'])
    report.tests = parseInt(doc.testsuites.testsuite['@_tests'])
    report.time = parseFloat(doc.testsuites.testsuite['@_time'])
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
