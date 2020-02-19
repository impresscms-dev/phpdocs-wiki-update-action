"use strict";
const child_process_1 = require("child_process");
module.exports = class GitInfo {
    /**
     * Constructor
     */
    constructor(cwd) {
        this.cwd = cwd;
        this.lastCommitEmail = this.execGitShowCommand('%ae');
        this.lastCommitAuthor = this.execGitShowCommand('%an');
        const branch = child_process_1.spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
            stdio: 'pipe',
            cwd: this.cwd
        }).output.toString();
        if (branch === 'HEAD') {
            this.isTag = true;
            this.branchOrTagName = child_process_1.spawnSync('git', ['describe', '--tags', '--abbrev=0'], {
                stdio: 'pipe',
                cwd: this.cwd
            }).output.toString();
        }
        else {
            this.branchOrTagName = branch;
            this.isTag = false;
        }
    }
    /**
     * Gets current repository name
     */
    getCurrentRepositoryName() {
        return typeof process.env['GITHUB_REPOSITORY'] == 'undefined'
            ? ''
            : process.env['GITHUB_REPOSITORY'];
    }
    /**
     * Get last commit SHA hash from last main branch commit
     */
    getCurrentLastCommitSHA() {
        return typeof process.env['GITHUB_SHA'] == 'undefined'
            ? ''
            : process.env['GITHUB_SHA'];
    }
    /**
     * Execute git show command and returns output
     *
     * @param string format What return as git show command format
     */
    execGitShowCommand(format) {
        return child_process_1.spawnSync('git', ['show', '-s', `--format='${format}'`, 'HEAD'], {
            stdio: 'pipe',
            cwd: this.cwd
        }).output.toString();
    }
    /**
     * Creates GitInfo for current process
     */
    static createInstance() {
        return new GitInfo(process.cwd());
    }
};
