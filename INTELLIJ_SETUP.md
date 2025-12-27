# Quick Setup Guide for IntelliJ IDEA Users

This is a streamlined guide specifically for IntelliJ IDEA users who want to use the Repository Health MCP server.

## TL;DR

Since IntelliJ IDEA's GitHub Copilot doesn't directly support MCP servers yet, **use Claude Desktop as a companion tool** for auditing, and use GitHub Copilot in IntelliJ IDEA for creating the missing files.

## Setup (5 minutes)

### 1. Build the MCP Server

```bash
git clone https://github.com/ajaychinthapalli/repository-health-mcp.git
cd repository-health-mcp
npm install
npm run build
```

### 2. Install Claude Desktop

Download from: https://claude.ai/download

### 3. Configure Claude Desktop

**macOS:**
```bash
# Create config file
mkdir -p ~/Library/Application\ Support/Claude
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```cmd
# Navigate to
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
mkdir -p ~/.config/Claude
nano ~/.config/Claude/claude_desktop_config.json
```

**Add this configuration:**
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

Replace `/absolute/path/to/repository-health-mcp` with your actual path.

### 4. Restart Claude Desktop

## Usage Workflow

### Step 1: Audit in Claude Desktop

Open Claude Desktop and type:

```
Can you audit my repository at /Users/myname/IdeaProjects/my-project for compliance with paved-road standards?
```

**Example output:**
```
Repository Health Audit Summary:

Overall Compliance: 40% (4/10 standards met)

✅ Standards Met:
  • README file
  • LICENSE file
  • .gitignore file
  • Package Manifest

❌ Gaps Found (6):
  • CONTRIBUTING guidelines
  • Code of Conduct
  • Security Policy
  • CI/CD Configuration
  • Test Files
  • CHANGELOG file
```

### Step 2: Create Missing Files in IntelliJ IDEA

Now switch to IntelliJ IDEA and use GitHub Copilot Chat to create the missing files.

**In IntelliJ IDEA Copilot Chat:**

For each missing file, ask Copilot to create it:

```
Create a CONTRIBUTING.md file with guidelines for this project
```

```
Create a CODE_OF_CONDUCT.md following the Contributor Covenant
```

```
Add a SECURITY.md file explaining how to report security vulnerabilities
```

```
Create a CHANGELOG.md file to track version history
```

### Step 3: Generate GitHub Issue (Optional)

Back in Claude Desktop:

```
Generate GitHub issue content for tracking these repository health improvements
```

Copy the output and create an issue in GitHub to track progress.

### Step 4: Re-audit

After creating the missing files, audit again in Claude Desktop:

```
Audit the repository again to see the updated compliance score
```

## Example: Complete Workflow

Let's say you're working on a Spring Boot project in IntelliJ IDEA:

1. **Claude Desktop:**
   ```
   Audit the repository at /Users/ajay/IdeaProjects/spring-boot-api
   ```
   
   *Result: 30% compliance - missing CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CI/CD, CHANGELOG*

2. **IntelliJ IDEA - Create CONTRIBUTING.md:**
   - Right-click project root → New → File → `CONTRIBUTING.md`
   - In Copilot Chat: "Create contribution guidelines for a Spring Boot project"
   - Copy generated content into the file

3. **IntelliJ IDEA - Create CODE_OF_CONDUCT.md:**
   - New file: `CODE_OF_CONDUCT.md`
   - In Copilot Chat: "Add a code of conduct following Contributor Covenant"

4. **IntelliJ IDEA - Create SECURITY.md:**
   - New file: `SECURITY.md`
   - In Copilot Chat: "Create a security policy for vulnerability reporting"

5. **IntelliJ IDEA - Create GitHub Actions:**
   - New directory: `.github/workflows`
   - New file: `.github/workflows/build.yml`
   - In Copilot Chat: "Create a GitHub Actions workflow for a Maven/Spring Boot project"

6. **IntelliJ IDEA - Create CHANGELOG.md:**
   - New file: `CHANGELOG.md`
   - In Copilot Chat: "Create a CHANGELOG.md following Keep a Changelog format"

7. **Claude Desktop - Re-audit:**
   ```
   Audit /Users/ajay/IdeaProjects/spring-boot-api again
   ```
   
   *Result: 90% compliance!*

## Quick Commands Reference

### In Claude Desktop:

| Task | Command |
|------|---------|
| Audit repository | `Audit the repository at /path/to/project` |
| Generate issue | `Generate GitHub issue content for repository health` |
| List standards | `What paved-road standards do you check?` |
| Get recommendations | `What should I add to improve my repository health?` |

### In IntelliJ IDEA Copilot Chat:

| Task | Command |
|------|---------|
| Create CONTRIBUTING | `Create a CONTRIBUTING.md file` |
| Create Code of Conduct | `Add CODE_OF_CONDUCT.md` |
| Create Security Policy | `Create SECURITY.md for vulnerability reporting` |
| Create CHANGELOG | `Add a CHANGELOG.md file` |
| Create GitHub Actions | `Create a GitHub Actions workflow for [your tech stack]` |
| Create tests | `Generate unit tests for this class` |

## Why This Approach?

- **Claude Desktop** excels at auditing and analysis using the MCP server
- **IntelliJ IDEA Copilot** excels at code generation and file creation
- Using both together gives you the best of both worlds

## Troubleshooting

### Claude Desktop doesn't see the MCP server

1. Check the config file path is correct
2. Verify the path to `dist/index.js` is absolute
3. Restart Claude Desktop completely
4. Check Node.js is installed: `node --version`

### Can't find project path

**macOS/Linux:**
```bash
cd /path/to/your/project
pwd
# Copy the output
```

**Windows:**
```cmd
cd C:\path\to\your\project
cd
# Copy the output
```

### IntelliJ IDEA Copilot not generating files

1. Make sure GitHub Copilot plugin is enabled
2. Check your Copilot subscription is active
3. Try being more specific in your prompts
4. Use the context: Right-click folder → "Ask Copilot"

## Next Steps

1. ✅ Set up Claude Desktop with MCP server
2. ✅ Audit your current project
3. ✅ Create missing files using IntelliJ Copilot
4. ✅ Re-audit to track improvement
5. ✅ Create a GitHub issue to track ongoing work
6. ✅ Make this part of your project setup checklist

## Need Help?

- Check the full guide: [GITHUB_COPILOT_SETUP.md](GITHUB_COPILOT_SETUP.md)
- Review example output: [examples/DEMO.md](examples/DEMO.md)
- See the main README: [README.md](README.md)

---

**Pro Tip:** Set up a template for new projects that includes all 10 paved-road standards from the start! Ask Claude Desktop to help you create a project template with 100% compliance.
