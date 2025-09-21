import * as core from '@actions/core'
import { XMLParser } from 'fast-xml-parser'
import * as fs from 'node:fs'
import * as path from 'path'

import { Report } from './report.js'

export class CoverageReport implements Report {
    tool: string = 'Unknown'
    version?: string
    timestamp?: string
    total_lines?: number
    total_lines_covered?: number
    total_lines_pct?: number
    total_branches?: number
    total_branches_covered?: number
    total_branches_pct?: number
    complexity?: number

    constructor(
        tool: string,
        version?: string,
        timestamp?: string,
        total_lines?: number,
        total_lines_covered?: number,
        total_lines_pct?: number,
        total_branches?: number,
        total_branches_covered?: number,
        total_branches_valid?: number,
        complexity?: number
    ) {
        this.tool = tool ?? this.tool
        this.version = version ?? this.version
        this.timestamp = timestamp ?? this.timestamp
        this.total_lines = total_lines ?? this.total_lines
        this.total_lines_covered =
            total_lines_covered ?? this.total_lines_covered
        this.total_lines_pct = total_lines_pct ?? this.total_lines_pct
        this.total_branches = total_branches ?? this.total_branches
        this.total_branches_covered =
            total_branches_covered ?? this.total_branches_covered
        this.total_branches_pct =
            total_branches_valid ?? this.total_branches_pct
        this.complexity = complexity ?? this.complexity
    }

    markdown(): string {
        let report = '## Coverage Report\n\n'
        if (this.tool === 'missing') {
            report += 'No coverage report present\n\n'
            return report
        }
        report += `Tool: ${this.tool}\n`
        report += `Version: ${this.version}\n`
        report += `Timestamp: ${this.timestamp}\n\n`
        report += `Complexity: ${this.complexity}\n\n`
        report += '| Lines | Covered | Percentage |\n'
        report += '| --- | --- | --- |\n'
        report += `| ${this.total_lines} | ${this.total_lines_covered} | ${this.total_lines_pct} |\n\n`
        report += '| Branches | Covered | Percentage |\n'
        report += '| --- | --- | --- |\n'
        report += `| ${this.total_branches} | ${this.total_branches_covered} | ${this.total_branches_pct} |\n\n`
        report += '\n'
        return report
    }
}

function cobertura_report(report_path: string): CoverageReport {
    const xml = fs.readFileSync(report_path, { encoding: 'utf8' })
    const parser = new XMLParser({ ignoreAttributes: false })
    const doc = parser.parse(xml)
    const report = new CoverageReport('cobertura')
    report.version = doc.coverage['@_version']
    report.timestamp = doc.coverage['@_timestamp']
    report.total_lines = parseInt(doc.coverage['@_lines-valid'])
    report.total_lines_covered = parseInt(doc.coverage['@_lines-covered'])
    report.total_lines_pct = parseFloat(doc.coverage['@_line-rate'])
    report.total_branches = parseInt(doc.coverage['@_branches-valid'])
    report.total_branches_covered = parseInt(doc.coverage['@_branches-covered'])
    report.total_branches_pct = parseFloat(doc.coverage['@_branch-rate'])
    report.complexity = parseInt(doc.coverage['@_complexity'])
    return report
}

function json_report(report_path: string): CoverageReport {
    const raw = fs.readFileSync(report_path, { encoding: 'utf8' })
    const doc = JSON.parse(raw)
    const report = new CoverageReport('json')
    report.total_lines = doc.total.lines.total
    report.total_lines_covered = doc.total.lines.covered
    report.total_lines_pct = doc.total.lines.pct
    report.total_branches = doc.total.branches.total
    report.total_branches_covered = doc.total.branches.covered
    report.total_branches_pct = doc.total.branches.pct
    return report
}

export function parse_coverage_report(
    coverage_format: string,
    coverage_report: string
): Report {
    const report_path = path.resolve(coverage_report)
    if (!fs.existsSync(report_path)) return new CoverageReport('missing')
    core.info('Parsing coverage report: ' + report_path)
    switch (coverage_format.toLowerCase()) {
        case 'cobertura':
            return cobertura_report(report_path)
        case 'json':
            return json_report(report_path)
        default:
            throw new Error(`Unknown coverage format: ${coverage_format}`)
    }
}
