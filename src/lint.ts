import * as core from '@actions/core'
import { XMLParser } from 'fast-xml-parser'
import * as fs from 'node:fs'
import * as path from 'path'

import { Report } from './report.js'

export class LinterReport implements Report {
    tool: string = 'Unknown'
    errors?: number
    failures?: number
    skips?: number
    tests?: number
    duration?: string
    messages?: string[]

    constructor(
        tool: string,
        errors?: number,
        failures?: number,
        skips?: number,
        tests?: number,
        duration?: string,
        messages?: string[]
    ) {
        this.tool = tool ?? this.tool
        this.errors = errors ?? this.errors
        this.failures = failures ?? this.failures
        this.skips = skips ?? this.skips
        this.tests = tests ?? this.tests
        this.duration = duration ?? this.duration
        this.messages = messages ?? this.messages
    }

    markdown(): string {
        let report = '## Linter Report\n\n'
        if (this.tool === 'missing') {
            report += 'No linting report present\n\n'
            return report
        }
        report += `Linter: ${this.tool}\n\n`
        report += '| Errors | Failures | Skips | Tests | Duration |\n'
        report += '| --- | --- | --- | --- | --- |\n'
        report += `| ${this.errors} | ${this.failures} | ${this.skips} | ${this.tests} | ${this.duration} |\n`
        report += '\n'
        return report
    }
}

function mypy_report(report_path: string): LinterReport {
    const xml = fs.readFileSync(report_path, { encoding: 'utf8' })
    const parser = new XMLParser({ ignoreAttributes: false })
    const doc = parser.parse(xml)
    const report = new LinterReport('mypy')
    report.errors = parseInt(doc.testsuite['@_errors'])
    report.failures = parseInt(doc.testsuite['@_failures'])
    report.skips = parseInt(doc.testsuite['@_skips'])
    report.tests = parseInt(doc.testsuite['@_tests'])
    report.duration = doc.testsuite['@_time']
    report.messages = doc.testsuite.testcase.failure['#text'].split('\n')
    return report
}

function eslint_report(report_path: string): LinterReport {
    const raw = fs.readFileSync(report_path, { encoding: 'utf8' })
    const doc = JSON.parse(raw)
    const report = new LinterReport('eslint')
    report.errors = 0
    doc.forEach((e) => (report.errors += e.errorCount))
    report.failures = 0
    doc.forEach((e) => (report.failures += e.fatalErrorCount))
    report.tests = doc.length
    return report
}

function sarif_report(report_path: string): LinterReport {
    const raw = fs.readFileSync(report_path, { encoding: 'utf8' })
    const doc = JSON.parse(raw)
    const report = new LinterReport('sarif')
    report.errors = 0
    doc.runs[0].results.forEach((e) => (report.errors += e.level === 'error' ? 1 : 0))
    report.failures = 0
    doc.runs[0].results.forEach((e) => (report.failures += e.level === 'error' ? 0 : 1))
    report.tests = doc.runs[0].results.length
    return report
}

export function parse_lint_report(
    lint_format: string,
    lint_report: string
): Report {
    const report_path = path.resolve(lint_report)
    if (!fs.existsSync(report_path)) {
        const report = new LinterReport('missing')
        return report
    }
    core.info(`Parsing lint report: ${report_path}`)
    switch (lint_format.toLowerCase()) {
        case 'mypy':
            return mypy_report(report_path)
        case 'eslint':
            return eslint_report(report_path)
        case 'sarif':
            return sarif_report(report_path)
        default:
            throw new Error(`Unknown linter format: ${lint_format}`)
    }
}
