export default class AccountIssue {
    constructor(db) {
        this.db = db
    }

    async createIssue(issueType) {
        return await this.db("issue_maps").insert(
            {
                issue_type: issueType,
                created_at: new Date().toUTCString(),
                updated_at: new Date().toUTCString(),
            },
            ["id", "issue_type", "created_at", "updated_at"]
        )
    }

    async findIssue(issueId) {
        const issues = await this.db("issue_maps")
            .select()
            .where({id: issueId})
        console.log("Response from Model: Issue - ", issues)

        if (issues.length < 1) {
            throw new Error(`Issue list not found.`)
        } else {
            const issue = issues[0]
            return {
                id: issue.id,
                issue_type: issue.issue_type,
                created_at: issue.created_at,
                updated_at: issue.updated_at,
            }
        }
    }

    async updateIssue(id, issueType) {
        const updatedIssue = await this.db("issue_maps")
            .where({id: id})
            .update(
                {
                    issue_type: issueType,
                    updated_at: new Date().toUTCString(),
                },
                ["id", "issue_type", "updated_at"]
            )

        if (updatedIssue.length !== 1) {
            throw new Error("Failed to update issue_type.")
        }

        return updatedIssue[0]
    }
}
