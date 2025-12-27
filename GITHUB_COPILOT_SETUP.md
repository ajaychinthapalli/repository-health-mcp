# Using Repository Health MCP with GitHub Copilot Chat

This guide provides step-by-step instructions for using the Repository Health MCP server with GitHub Copilot Chat.

## Prerequisites

1. **GitHub Copilot subscription** with access to Copilot Chat
2. **Node.js** installed (version 18 or higher)
3. **VS Code** with GitHub Copilot extension installed

## Step 1: Clone and Build the Repository

```bash
# Clone the repository
git clone https://github.com/ajaychinthapalli/repository-health-mcp.git
cd repository-health-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

After building, you should see a `dist` folder with the compiled `index.js` file.

## Step 2: Configure MCP Server for GitHub Copilot

### For VS Code with GitHub Copilot Chat

1. **Find your VS Code settings location:**
   - **macOS/Linux**: `~/.config/Code/User/settings.json`
   - **Windows**: `%APPDATA%\Code\User\settings.json`

2. **Add the MCP server configuration:**

Open your VS Code `settings.json` and add the following configuration:

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "You have access to a Repository Health MCP server at the path specified below"
    }
  ],
  "mcp.servers": {
    "repository-health": {
      "command": "node",
      "args": [
        "/absolute/path/to/repository-health-mcp/dist/index.js"
      ]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/repository-health-mcp` with the actual absolute path where you cloned the repository.

### Alternative: Using with Claude Desktop

If you're using Claude Desktop instead of VS Code:

1. **Find your Claude Desktop config:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the configuration:**

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

3. **Restart Claude Desktop**

## Step 3: Verify Installation

After configuration, restart VS Code or Claude Desktop. The MCP server should be available.

## Step 4: Using the Repository Health Tools

### In GitHub Copilot Chat (VS Code)

Open the Copilot Chat panel in VS Code and try these commands:

#### Example 1: Audit Your Current Repository

```
@workspace Can you use the audit_repository tool to check my current repository for compliance with paved-road standards?
```

Or more specifically:

```
Use the audit_repository tool with the path /path/to/your/repository
```

#### Example 2: Get Natural Language Explanation

```
What enterprise standards is my repository missing? Use the repository health audit tool.
```

#### Example 3: Generate Issue Content

```
Use the generate_issue_content tool to create a GitHub issue for tracking repository health improvements at /path/to/your/repository
```

#### Example 4: List All Standards

```
What paved-road standards does the repository health tool check? Use the list_standards tool.
```

### In Claude Desktop

If using Claude Desktop, you can ask:

```
Can you audit the repository at /Users/username/projects/my-app for compliance with paved-road standards?
```

Claude will automatically use the MCP server tools.

## Available Tools

The MCP server provides 3 tools:

### 1. `audit_repository`

**Purpose:** Audit a repository against enterprise standards

**Input:**
```json
{
  "repository_path": "/absolute/path/to/repository"
}
```

**Output:**
- Compliance percentage
- List of met standards
- List of missing standards with recommendations
- Natural language summary

### 2. `generate_issue_content`

**Purpose:** Generate GitHub issue content for tracking improvements

**Input:**
```json
{
  "repository_path": "/absolute/path/to/repository"
}
```

**Output:**
- Issue title with compliance percentage
- Issue body with action items
- List of already-met standards

### 3. `list_standards`

**Purpose:** List all enterprise paved-road standards

**Input:** None required

**Output:**
- Complete list of 10 standards with descriptions and recommendations

## Example Workflow

### Step-by-Step: Audit and Improve Your Repository

1. **Initial Audit:**
   ```
   Use the audit_repository tool to check /path/to/my-project
   ```

2. **Review Results:**
   - Copilot will show you the compliance percentage
   - Review which standards are met and which are missing

3. **Get Issue Content:**
   ```
   Generate GitHub issue content for the audit results
   ```

4. **Create the Issue:**
   - Copy the generated title and body
   - Create a new issue in your GitHub repository
   - Paste the content

5. **Make Improvements:**
   - Address the gaps one by one
   - For example, if missing LICENSE:
     ```
     Create a LICENSE file for my project
     ```

6. **Re-audit:**
   ```
   Audit my repository again to see the updated compliance score
   ```

## Troubleshooting

### Issue: MCP server not found

**Solution:**
- Verify the path in your configuration is absolute and correct
- Make sure you ran `npm run build` successfully
- Check that `dist/index.js` exists

### Issue: Node.js not found

**Solution:**
- Install Node.js from https://nodejs.org/
- Verify installation: `node --version`

### Issue: Tools not showing up in Copilot

**Solution:**
- Restart VS Code completely
- Check the VS Code Output panel for MCP errors
- Verify your `settings.json` syntax is valid JSON

### Issue: Permission denied

**Solution:**
- Make sure `dist/index.js` has execute permissions:
  ```bash
  chmod +x dist/index.js
  ```

## Real Example Output

When you run the audit tool on this repository itself, you'll see:

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

## Tips for Best Results

1. **Always use absolute paths** when specifying repository locations
2. **Be specific** in your requests to Copilot Chat
3. **Use the tool names** explicitly when needed (e.g., "Use the audit_repository tool")
4. **Review the recommendations** carefully - they provide specific guidance
5. **Re-audit regularly** to track compliance improvements over time

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your MCP server configuration
3. Review the VS Code Output panel for error messages
4. Ensure Node.js and npm are properly installed

## Next Steps

After setting up:
1. Audit your current repository
2. Review the compliance report
3. Create issues to track improvements
4. Work through the recommendations
5. Re-audit to see progress

Happy auditing! 🎉
