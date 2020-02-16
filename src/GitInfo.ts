import {spawnSync} from "child_process";

export default class GitInfo {

    /**
     * Last commit author name
     */
    public readonly lastCommitAuthor: string;

    /**
     * Last commit email
     */
    public readonly lastCommitEmail: string;

    /**
     * Branch or tag name (if isTag = true)
     */
    public readonly branchOrTagName: string;

    /**
     * Is branchOrTagName value a tag?
     */
    public readonly isTag: boolean;

    /**
     * Path where to execute git commands
     */
    protected cwd: string;

    /**
     * Constructor
     */
    constructor(cwd: string) {
        this.cwd = cwd;
        this.lastCommitEmail = this.execGitShowCommand("%ae");
        this.lastCommitAuthor = this.execGitShowCommand("%an");

        let branch = spawnSync(
            'git',
            [
                'rev-parse',
                '--abbrev-ref',
                'HEAD'
            ],
            {
                stdio: 'pipe',
                cwd: this.cwd
            }
        ).output.toString();
        if (branch === 'HEAD') {
            this.isTag = true;
            this.branchOrTagName = spawnSync(
                'git',
                [
                    'describe',
                    '--tags',
                    '--abbrev=0'
                ],
                {
                    stdio: 'pipe',
                    cwd: this.cwd
                }
            ).output.toString();
        } else {
            this.branchOrTagName = branch;
            this.isTag = false;
        }
    }

    /**
     * Execute git show command and returns output
     *
     * @param string format What return as git show command format
     */
    private execGitShowCommand(format: string): string {
        return spawnSync(
            'git',
            [
                'show',
                '-s',
                "--format='"+format+"'",
                'HEAD'
            ],
            {
                stdio: 'pipe',
                cwd: this.cwd
            }
        ).output.toString();
    }

    /**
     * Gets current repository name
     */
    public getCurrentRepositoryName(): string {
        // @ts-ignore
        return process.env["GITHUB_REPOSITORY"].toString();
    }

    /**
     * Get last commit SHA hash from last main branch commit
     */
    public getCurrentLastCommitSHA(): string {
        // @ts-ignore
        return process.env["GITHUB_SHA"].toString();
    }

}