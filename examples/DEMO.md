# Repository Health MCP Server Demo

This demo shows the capabilities of the Repository Health MCP Server.

## What This Server Does

The Repository Health MCP Server enables GitHub Copilot and other MCP clients to:

1. **Audit repositories** - Check compliance against 10 enterprise paved-road standards
2. **Explain gaps** - Provide natural language explanations of what's missing
3. **Generate actionable content** - Create GitHub issue content to track improvements

## Available Tools

### 1. audit_repository

Audits a repository against enterprise standards and provides:
- Compliance percentage
- List of met and unmet standards
- Natural language summary
- Specific recommendations for each gap

**Input:** `{ "repository_path": "/path/to/repo" }`

### 2. generate_issue_content

Creates GitHub issue content to track repository health improvements:
- Issue title with compliance percentage
- Detailed action items for each gap
- List of already-met standards
- Ready to copy/paste into GitHub

**Input:** `{ "repository_path": "/path/to/repo" }`

### 3. list_standards

Lists all 10 enterprise paved-road standards:
- README file
- LICENSE file
- .gitignore file
- CONTRIBUTING guidelines
- Code of Conduct
- Security Policy
- CI/CD Configuration
- Package Manifest
- Test Files
- CHANGELOG file

**Input:** None required

## Example: Auditing This Repository

Here's the actual audit output when running on this repository itself:

```
Repository Health Audit Summary:

Overall Compliance: 40% (4/10 standards met)

⚠️  Fair. This repository meets some standards but needs significant improvements.

✅ Standards Met:
  • README file
  • LICENSE file
  • .gitignore file
  • Package Manifest

❌ Gaps Found (6):
  • CONTRIBUTING guidelines: Add a CONTRIBUTING.md file to guide contributors on how to participate in the project.
  • Code of Conduct: Add a CODE_OF_CONDUCT.md file to establish community guidelines and expectations.
  • Security Policy: Add a SECURITY.md file to explain how to report security vulnerabilities.
  • CI/CD Configuration: Add CI/CD configuration (e.g., GitHub Actions workflows) to automate testing and deployment.
  • Test Files: Add test files to ensure code quality and prevent regressions.
  • CHANGELOG file: Add a CHANGELOG.md file to document version history and notable changes.
```

**Actual Compliance:** 40% (4/10 standards met)

## Integration with GitHub Copilot

Once configured in Claude Desktop or another MCP client, you can:

1. **Ask Copilot to audit a repository:**
   ```
   "Can you check the health of my repository at /path/to/my-project?"
   ```

2. **Get natural language explanations:**
   ```
   "What's missing from my repository according to paved-road standards?"
   ```

3. **Take action:**
   ```
   "Create an issue to track the gaps you found"
   ```

## Benefits

- **Automated Compliance** - No manual checklist needed
- **Natural Language** - Easy to understand explanations
- **Actionable** - Direct integration with GitHub issues
- **Consistent** - Same standards across all repositories
- **Extensible** - Easy to add custom standards

## Next Steps

1. Install and build the server: `npm install && npm run build`
2. Configure in your MCP client (see examples/USAGE.md)
3. Start auditing your repositories!
