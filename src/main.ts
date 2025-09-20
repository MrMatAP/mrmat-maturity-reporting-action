import * as core from '@actions/core'
import * as github from '@actions/github'

import { get_version } from './version.js'

export function run() {
    try {
        const ecosystem: string = core.getInput('ecosystem')
        const release_branch_ref: string = core.getInput('release_branch_ref')
        const major: string = core.getInput('major')
        const minor: string = core.getInput('minor')

        const version = get_version(
            major,
            minor,
            github.context.runNumber,
            github.context.ref === release_branch_ref,
            ecosystem
        )
        core.info(`Version: ${version}`)
        core.setOutput('version', version)
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}
