# Example MCP Client Usage

This document shows how to use the Repository Health MCP server with various MCP clients.

## Using with Claude Desktop

1. Add the server to your Claude Desktop configuration:

**Location:** 
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "repository-health": {
      "command": "node",
      "args": [
        "/absolute/path/to/repository-health-mcp/dist/index.js"
      ]
    }
  }
}
```

2. Restart Claude Desktop

3. Ask Claude to audit a repository:
```
Can you audit the repository at /path/to/my-repo for compliance with paved-road standards?
```

## Example Conversations

### Audit a Repository

**User:**
```
Use the audit_repository tool to check the repository at /home/user/projects/my-app
```

**Expected Output:**
```json
{
  "repoPath": "/home/user/projects/my-app",
  "totalStandards": 10,
  "compliantStandards": 7,
  "nonCompliantStandards": 3,
  "compliancePercentage": 70,
  "results": [
    {
      "standard": "README file",
      "compliant": true,
      "description": "Repository should have a README.md file"
    },
    {
      "standard": "LICENSE file",
      "compliant": false,
      "description": "Repository should have a LICENSE file",
      "recommendation": "Add a LICENSE file to clarify how others can use your code."
    }
    // ... more results
  ],
  "naturalLanguageSummary": "Repository Health Audit Summary:\n\nOverall Compliance: 70% (7/10 standards met)\n\n⚠️  Fair. This repository meets some standards but needs significant improvements.\n\n✅ Standards Met:\n  • README file\n  • .gitignore file\n  • Package Manifest\n  • Test Files\n  • CHANGELOG file\n  • CI/CD Configuration\n  • Security Policy\n\n❌ Gaps Found (3):\n  • LICENSE file: Add a LICENSE file to clarify how others can use your code.\n  • CONTRIBUTING guidelines: Add a CONTRIBUTING.md file to guide contributors on how to participate in the project.\n  • Code of Conduct: Add a CODE_OF_CONDUCT.md file to establish community guidelines and expectations."
}
```

### Generate Issue Content

**User:**
```
Use the generate_issue_content tool to create an issue for repository /home/user/projects/my-app
```

**Expected Output:**
```json
{
  "title": "Repository Health: 70% compliance with paved-road standards",
  "body": "## Repository Health Audit\n\nThis repository was audited against enterprise paved-road standards.\n\n**Overall Compliance:** 70% (7/10 standards met)\n\n### 🔧 Action Items\n\n#### 1. LICENSE file\nRepository should have a LICENSE file\n\n**Recommendation:** Add a LICENSE file to clarify how others can use your code.\n\n#### 2. CONTRIBUTING guidelines\nRepository should have CONTRIBUTING guidelines\n\n**Recommendation:** Add a CONTRIBUTING.md file to guide contributors on how to participate in the project.\n\n#### 3. Code of Conduct\nRepository should have a Code of Conduct\n\n**Recommendation:** Add a CODE_OF_CONDUCT.md file to establish community guidelines and expectations.\n\n### ✅ Standards Already Met\n\n- README file\n- .gitignore file\n- Package Manifest\n- Test Files\n- CHANGELOG file\n- CI/CD Configuration\n- Security Policy\n\n---\n*This issue was created by the Repository Health MCP server to track compliance with enterprise standards.*"
}
```

### Create GitHub Issue via API

**User:**
```
Use the create_github_issue tool to create an issue for repository /home/user/projects/my-app in the GitHub repo my-org/my-app using my GitHub token
```

**Parameters:**
```json
{
  "repository_path": "/home/user/projects/my-app",
  "owner": "my-org",
  "repo": "my-app",
  "github_token": "ghp_your_github_personal_access_token"
}
```

**Expected Output:**
```json
{
  "success": true,
  "issue_number": 42,
  "issue_url": "https://github.com/my-org/my-app/issues/42",
  "title": "Repository Health: 70% compliance with paved-road standards"
}
```

**Note:** You need a GitHub personal access token with `repo` scope. Create one at https://github.com/settings/tokens

### List Standards

**User:**
```
Use the list_standards tool to see all available standards
```

**Expected Output:**
```json
[
  {
    "id": "readme",
    "name": "README file",
    "description": "Repository should have a README.md file",
    "recommendation": "Add a README.md file to explain what the project does, how to install and use it."
  },
  {
    "id": "license",
    "name": "LICENSE file",
    "description": "Repository should have a LICENSE file",
    "recommendation": "Add a LICENSE file to clarify how others can use your code."
  }
  // ... more standards
]
```

## Using Programmatically

You can also use the MCP SDK to interact with the server programmatically:

```javascript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["/path/to/repository-health-mcp/dist/index.js"]
});

const client = new Client({
  name: "example-client",
  version: "1.0.0"
}, {
  capabilities: {}
});

await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log(tools);

// Call audit_repository tool
const result = await client.callTool({
  name: "audit_repository",
  arguments: {
    repository_path: "/path/to/repo"
  }
});

console.log(result);
```

## Workflow Example

### Option 1: Automatic Issue Creation (Recommended)

1. **Audit and create issue in one step:**
   ```
   Create a GitHub issue for the repository at /home/user/projects/my-app in GitHub repo my-org/my-app
   ```

2. **The tool will:**
   - Audit the repository
   - Generate issue content
   - Create the issue via GitHub API
   - Return the issue URL

3. **Re-audit after improvements:**
   ```
   Audit the repository again to see the updated compliance score
   ```

### Option 2: Manual Issue Creation

1. **Audit the repository:**
   ```
   Audit the repository at /home/user/projects/my-app
   ```

2. **Review the natural language summary:**
   - Claude will show you which standards are met
   - Identify specific gaps that need attention

3. **Generate issue content:**
   ```
   Generate GitHub issue content for the audit results
   ```

4. **Create the issue manually:**
   - Copy the generated content
   - Create a new issue in GitHub
   - Track progress on addressing gaps

5. **Re-audit after improvements:**
   ```
   Audit the repository again to see the updated compliance score
   ```

## Tips

- Run audits regularly to maintain compliance
- Use `create_github_issue` for automated issue creation with GitHub API integration
- Use `generate_issue_content` if you want to preview or customize content before creating the issue
- Store your GitHub token securely (e.g., in environment variables)
- Customize standards by modifying the source code if needed
- Integrate into CI/CD pipelines for automated compliance checks
