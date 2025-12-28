# Repository Health MCP Server

An MCP (Model Context Protocol) server that enables GitHub Copilot to audit repositories against enterprise paved-road standards, explain gaps in natural language, and take action by creating GitHub issues via the API.

## Features

- **Automated Audits**: Check repositories against 10 enterprise paved-road standards
- **Natural Language Explanations**: Get human-readable summaries of compliance gaps
- **GitHub API Integration**: Automatically create issues to track improvements using the GitHub API
- **Issue Content Generation**: Preview and customize issue content before creation
- **Comprehensive Standards**: Covers documentation, security, CI/CD, testing, and more

## Enterprise Paved-Road Standards

This server audits repositories against the following standards:

1. **README file** - Clear documentation of project purpose and usage
2. **LICENSE file** - Legal clarity on code usage
3. **.gitignore file** - Proper exclusion of build artifacts
4. **CONTRIBUTING guidelines** - Clear contribution process
5. **Code of Conduct** - Community guidelines and expectations
6. **Security Policy** - Vulnerability reporting process
7. **CI/CD Configuration** - Automated testing and deployment
8. **Package Manifest** - Dependency management
9. **Test Files** - Quality assurance and regression prevention
10. **CHANGELOG file** - Version history tracking

## Installation

```bash
npm install
npm run build
```

## Usage

### Quick Start Guides

- **[IntelliJ IDEA Setup](INTELLIJ_SETUP.md)** - Quick guide for IntelliJ IDEA users (uses Claude Desktop + IntelliJ Copilot)
- **[GitHub Copilot Chat Setup](GITHUB_COPILOT_SETUP.md)** - Step-by-step guide for VS Code with GitHub Copilot
- **[Claude Desktop Setup](#with-claude-desktop)** - Configuration for Claude Desktop standalone

### With IntelliJ IDEA

See the **[IntelliJ IDEA quick setup guide](INTELLIJ_SETUP.md)** for a streamlined workflow.

**Quick summary:**
1. Build this project: `npm install && npm run build`
2. Install and configure Claude Desktop with MCP server
3. Use Claude Desktop to audit your IntelliJ projects
4. Use IntelliJ Copilot Chat to create missing files

### With GitHub Copilot Chat (VS Code)

See the **[detailed GitHub Copilot setup guide](GITHUB_COPILOT_SETUP.md)** for complete step-by-step instructions.

**Quick summary:**
1. Build this project: `npm install && npm run build`
2. Add MCP server to your VS Code settings
3. Use Copilot Chat commands like: `Use the audit_repository tool to check my repository`

### With Claude Desktop

Add this to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "repository-health": {
      "command": "node",
      "args": ["/path/to/repository-health-mcp/dist/index.js"]
    }
  }
}
```

### Available Tools

#### 1. audit_repository

Audits a repository and provides a comprehensive compliance report with natural language explanations.

**Input:**
```json
{
  "repository_path": "/path/to/repository"
}
```

**Output:**
- Compliance percentage
- List of met standards
- List of gaps with recommendations
- Natural language summary

#### 2. generate_issue_content

Generates GitHub issue content that can be used to create an issue tracking repository health improvements.

**Input:**
```json
{
  "repository_path": "/path/to/repository"
}
```

**Output:**
- Issue title
- Issue body with action items and recommendations

#### 3. create_github_issue

Creates a GitHub issue using the GitHub API to track repository health improvements. This tool automatically audits the repository and creates an issue with the findings.

**Input:**
```json
{
  "repository_path": "/path/to/repository",
  "owner": "github-username-or-org",
  "repo": "repository-name",
  "github_token": "ghp_your_github_token"
}
```

**Output:**
- Issue number
- Issue URL
- Success confirmation

**Note:** Requires a GitHub personal access token with `repo` scope. You can create one at https://github.com/settings/tokens

#### 4. list_standards

Lists all enterprise paved-road standards checked during audits.

**Output:**
- Complete list of standards with descriptions and recommendations

## Example Workflow

1. **Audit a repository:**
   ```
   Use the audit_repository tool with the path to your repository
   ```

2. **Review the natural language summary:**
   - Understand which standards are met
   - Identify gaps and recommendations
   
3. **Take action:**
   - Use `create_github_issue` to automatically create a GitHub issue with the audit findings
   - Or use `generate_issue_content` to preview issue content before manually creating it
   - Create PRs to address specific gaps
   - Monitor compliance percentage over time

## Example Output

Here's the actual audit output for this repository itself:

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

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run watch
```

## Integration with GitHub Copilot

Once configured, GitHub Copilot can:

1. **Audit repositories** - Ask Copilot to check repository health
2. **Explain gaps** - Get natural language explanations of what's missing
3. **Create issues automatically** - Use the GitHub API to create issues directly from audit results
4. **Preview issue content** - Generate issue content to review before creation
5. **Guide improvements** - Get specific recommendations for each gap

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT