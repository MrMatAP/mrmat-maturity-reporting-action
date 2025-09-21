import * as core from '@actions/core'
import { XMLParser } from 'fast-xml-parser'
import * as fs from 'node:fs'
import * as path from 'path'

import { Report } from './report.js'

export class LinterReport implements Report {
    linter: string = 'Unknown'
    errors?: number
    failures?: number
    skips?: number
    tests?: number
    duration?: string
    messages?: string[]

    constructor(
        linter?: string,
        errors?: number,
        failures?: number,
        skips?: number,
        tests?: number,
        duration?: string,
        messages?: string[]
    ) {
        this.linter = linter ?? this.linter
        this.errors = errors ?? this.errors
        this.failures = failures ?? this.failures
        this.skips = skips ?? this.skips
        this.tests = tests ?? this.tests
        this.duration = duration ?? this.duration
        this.messages = messages ?? this.messages
    }

    markdown(): string {
        let report = '## Linter Report\n'
        report += `Linter: ${this.linter}\n\n`
        report += '| Errors | Failures | Skips | Tests | Duration |\n'
        report += '| --- | --- | --- | --- | --- |\n'
        report += `| ${this.errors} | ${this.failures} | ${this.skips} | ${this.tests} | ${this.duration} |\n`
        return report
    }
}

function mypy_report(xml): LinterReport {
    const report = new LinterReport()
    report.linter = 'mypy'
    report.errors = parseInt(xml.testsuite['@_errors'])
    report.failures = parseInt(xml.testsuite['@_failures'])
    report.skips = parseInt(xml.testsuite['@_skips'])
    report.tests = parseInt(xml.testsuite['@_tests'])
    report.duration = xml.testsuite['@_time']
    report.messages = xml.testsuite.testcase.failure['#text'].split('\n')
    return report
}

export function parse_lint_report(lint_report: string): Report {
    const report_path = path.resolve(lint_report)
    core.info(`Parsing lint report: ${report_path}`)
    const xml = fs.readFileSync(report_path, { encoding: 'utf8' })
    const parser = new XMLParser({ ignoreAttributes: false })
    const doc = parser.parse(xml)
    switch (doc.testsuite['@_name']) {
        case 'mypy':
            return mypy_report(doc)
        default:
            throw new Error(`Unknown linter: ${doc.testsuite['@_name']}`)
    }
}
