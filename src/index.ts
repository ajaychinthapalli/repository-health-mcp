#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";

interface AuditStandard {
  id: string;
  name: string;
  description: string;
  check: (repoPath: string) => Promise<boolean>;
  recommendation: string;
}

interface AuditResult {
  standard: string;
  compliant: boolean;
  description: string;
  recommendation?: string;
}

interface AuditSummary {
  repoPath: string;
  totalStandards: number;
  compliantStandards: number;
  nonCompliantStandards: number;
  compliancePercentage: number;
  results: AuditResult[];
  naturalLanguageSummary: string;
}

// Define enterprise paved-road standards
const PAVED_ROAD_STANDARDS: AuditStandard[] = [
  {
    id: "readme",
    name: "README file",
    description: "Repository should have a README.md file",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        return files.some(f => f.toLowerCase() === "readme.md");
      } catch {
        return false;
      }
    },
    recommendation: "Add a README.md file to explain what the project does, how to install and use it."
  },
  {
    id: "license",
    name: "LICENSE file",
    description: "Repository should have a LICENSE file",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        return files.some(f => f.toLowerCase().startsWith("license"));
      } catch {
        return false;
      }
    },
    recommendation: "Add a LICENSE file to clarify how others can use your code."
  },
  {
    id: "gitignore",
    name: ".gitignore file",
    description: "Repository should have a .gitignore file",
    check: async (repoPath: string) => {
      try {
        await fs.access(path.join(repoPath, ".gitignore"));
        return true;
      } catch {
        return false;
      }
    },
    recommendation: "Add a .gitignore file to exclude build artifacts and dependencies from version control."
  },
  {
    id: "contributing",
    name: "CONTRIBUTING guidelines",
    description: "Repository should have CONTRIBUTING guidelines",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        return files.some(f => f.toLowerCase().startsWith("contributing"));
      } catch {
        return false;
      }
    },
    recommendation: "Add a CONTRIBUTING.md file to guide contributors on how to participate in the project."
  },
  {
    id: "code_of_conduct",
    name: "Code of Conduct",
    description: "Repository should have a Code of Conduct",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        // Check for common Code of Conduct filename patterns
        const cocPatterns = [
          'code_of_conduct.md',
          'code-of-conduct.md',
          'code_of_conduct.txt',
          'code-of-conduct.txt',
          'conduct.md',
          'codeofconduct.md'
        ];
        return files.some(f => 
          cocPatterns.includes(f.toLowerCase())
        );
      } catch {
        return false;
      }
    },
    recommendation: "Add a CODE_OF_CONDUCT.md file to establish community guidelines and expectations."
  },
  {
    id: "security",
    name: "Security Policy",
    description: "Repository should have a security policy",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        const hasSecurity = files.some(f => f.toLowerCase().startsWith("security"));
        if (hasSecurity) return true;
        
        // Check for .github/SECURITY.md
        try {
          await fs.access(path.join(repoPath, ".github", "SECURITY.md"));
          return true;
        } catch {
          return false;
        }
      } catch {
        return false;
      }
    },
    recommendation: "Add a SECURITY.md file to explain how to report security vulnerabilities."
  },
  {
    id: "ci_cd",
    name: "CI/CD Configuration",
    description: "Repository should have CI/CD configuration",
    check: async (repoPath: string) => {
      try {
        // Check for GitHub Actions
        const githubWorkflowsPath = path.join(repoPath, ".github", "workflows");
        try {
          const workflows = await fs.readdir(githubWorkflowsPath);
          if (workflows.length > 0) return true;
        } catch {}
        
        // Check for other CI configs
        const files = await fs.readdir(repoPath);
        return files.some(f => 
          f === ".travis.yml" || 
          f === ".circleci" ||
          f === "Jenkinsfile" ||
          f === ".gitlab-ci.yml"
        );
      } catch {
        return false;
      }
    },
    recommendation: "Add CI/CD configuration (e.g., GitHub Actions workflows) to automate testing and deployment."
  },
  {
    id: "package_manifest",
    name: "Package Manifest",
    description: "Repository should have a package manifest file",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        return files.some(f => 
          f === "package.json" || 
          f === "pom.xml" ||
          f === "build.gradle" ||
          f === "Cargo.toml" ||
          f === "go.mod" ||
          f === "requirements.txt" ||
          f === "setup.py" ||
          f === "pyproject.toml"
        );
      } catch {
        return false;
      }
    },
    recommendation: "Add a package manifest file (e.g., package.json, requirements.txt) to define dependencies."
  },
  {
    id: "tests",
    name: "Test Files",
    description: "Repository should have test files",
    check: async (repoPath: string) => {
      try {
        // Check common test directories
        const testDirs = ['test', 'tests', '__tests__', 'spec'];
        for (const dir of testDirs) {
          try {
            const dirPath = path.join(repoPath, dir);
            const stat = await fs.stat(dirPath);
            if (stat.isDirectory()) return true;
          } catch {}
        }
        
        // Check for test files in root
        const files = await fs.readdir(repoPath);
        return files.some((f: string) => {
          const fileName = f.toLowerCase();
          return fileName.includes("test") || 
                 fileName.includes("spec") ||
                 fileName.endsWith(".test.js") ||
                 fileName.endsWith(".test.ts") ||
                 fileName.endsWith(".spec.js") ||
                 fileName.endsWith(".spec.ts");
        });
      } catch {
        return false;
      }
    },
    recommendation: "Add test files to ensure code quality and prevent regressions."
  },
  {
    id: "changelog",
    name: "CHANGELOG file",
    description: "Repository should have a CHANGELOG to track changes",
    check: async (repoPath: string) => {
      try {
        const files = await fs.readdir(repoPath);
        return files.some(f => f.toLowerCase().startsWith("changelog"));
      } catch {
        return false;
      }
    },
    recommendation: "Add a CHANGELOG.md file to document version history and notable changes."
  }
];

// Audit repository against standards
async function auditRepository(repoPath: string): Promise<AuditSummary> {
  const results: AuditResult[] = [];
  
  for (const standard of PAVED_ROAD_STANDARDS) {
    const compliant = await standard.check(repoPath);
    results.push({
      standard: standard.name,
      compliant,
      description: standard.description,
      recommendation: compliant ? undefined : standard.recommendation
    });
  }
  
  const compliantCount = results.filter(r => r.compliant).length;
  const nonCompliantCount = results.filter(r => !r.compliant).length;
  const compliancePercentage = Math.round((compliantCount / results.length) * 100);
  
  // Generate natural language summary
  const naturalLanguageSummary = generateNaturalLanguageSummary(
    results,
    compliantCount,
    nonCompliantCount,
    compliancePercentage
  );
  
  return {
    repoPath,
    totalStandards: results.length,
    compliantStandards: compliantCount,
    nonCompliantStandards: nonCompliantCount,
    compliancePercentage,
    results,
    naturalLanguageSummary
  };
}

function generateNaturalLanguageSummary(
  results: AuditResult[],
  compliantCount: number,
  nonCompliantCount: number,
  compliancePercentage: number
): string {
  const compliantItems = results.filter(r => r.compliant).map(r => r.standard);
  const nonCompliantItems = results.filter(r => !r.compliant);
  
  let summary = `Repository Health Audit Summary:\n\n`;
  summary += `Overall Compliance: ${compliancePercentage}% (${compliantCount}/${results.length} standards met)\n\n`;
  
  if (compliancePercentage === 100) {
    summary += `🎉 Excellent! This repository meets all enterprise paved-road standards.\n`;
  } else if (compliancePercentage >= 70) {
    summary += `✅ Good! This repository meets most standards but has room for improvement.\n`;
  } else if (compliancePercentage >= 40) {
    summary += `⚠️  Fair. This repository meets some standards but needs significant improvements.\n`;
  } else {
    summary += `❌ Needs Attention. This repository is missing many important standards.\n`;
  }
  
  if (compliantItems.length > 0) {
    summary += `\n✅ Standards Met:\n`;
    compliantItems.forEach(item => {
      summary += `  • ${item}\n`;
    });
  }
  
  if (nonCompliantItems.length > 0) {
    summary += `\n❌ Gaps Found (${nonCompliantCount}):\n`;
    nonCompliantItems.forEach(item => {
      summary += `  • ${item}: ${item.recommendation}\n`;
    });
  }
  
  return summary;
}

// Create GitHub issue content
function createIssueContent(auditResult: AuditSummary): { title: string; body: string } {
  const title = `Repository Health: ${auditResult.compliancePercentage}% compliance with paved-road standards`;
  
  let body = `## Repository Health Audit\n\n`;
  body += `This repository was audited against enterprise paved-road standards.\n\n`;
  body += `**Overall Compliance:** ${auditResult.compliancePercentage}% (${auditResult.compliantStandards}/${auditResult.totalStandards} standards met)\n\n`;
  
  const nonCompliantItems = auditResult.results.filter(r => !r.compliant);
  
  if (nonCompliantItems.length > 0) {
    body += `### 🔧 Action Items\n\n`;
    nonCompliantItems.forEach((item, index) => {
      body += `#### ${index + 1}. ${item.standard}\n`;
      body += `${item.description}\n\n`;
      body += `**Recommendation:** ${item.recommendation}\n\n`;
    });
  }
  
  const compliantItems = auditResult.results.filter(r => r.compliant);
  if (compliantItems.length > 0) {
    body += `### ✅ Standards Already Met\n\n`;
    compliantItems.forEach(item => {
      body += `- ${item.standard}\n`;
    });
  }
  
  body += `\n---\n`;
  body += `*This issue was created by the Repository Health MCP server to track compliance with enterprise standards.*`;
  
  return { title, body };
}

// Main server setup
const server = new Server(
  {
    name: "repository-health-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "audit_repository",
        description: "Audit a repository against enterprise paved-road standards and explain gaps in natural language",
        inputSchema: {
          type: "object",
          properties: {
            repository_path: {
              type: "string",
              description: "Path to the repository to audit",
            },
          },
          required: ["repository_path"],
        },
      },
      {
        name: "generate_issue_content",
        description: "Generate GitHub issue content for repository health gaps (can be used to create issues)",
        inputSchema: {
          type: "object",
          properties: {
            repository_path: {
              type: "string",
              description: "Path to the repository to audit",
            },
          },
          required: ["repository_path"],
        },
      },
      {
        name: "list_standards",
        description: "List all enterprise paved-road standards that are checked during audits",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "audit_repository") {
    if (!args) {
      return {
        content: [{ type: "text", text: "Missing arguments" }],
        isError: true,
      };
    }
    const repoPath = args.repository_path as string;
    
    try {
      const auditResult = await auditRepository(repoPath);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(auditResult, null, 2),
          },
          {
            type: "text",
            text: `\n\n${auditResult.naturalLanguageSummary}`,
          }
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error auditing repository: ${error instanceof Error ? error.message : String(error)}`,
          }
        ],
        isError: true,
      };
    }
  }
  
  if (name === "generate_issue_content") {
    if (!args) {
      return {
        content: [{ type: "text", text: "Missing arguments" }],
        isError: true,
      };
    }
    const repoPath = args.repository_path as string;
    
    try {
      const auditResult = await auditRepository(repoPath);
      const issueContent = createIssueContent(auditResult);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(issueContent, null, 2),
          },
          {
            type: "text",
            text: `\n\n## Preview:\n\n### ${issueContent.title}\n\n${issueContent.body}`,
          }
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating issue content: ${error instanceof Error ? error.message : String(error)}`,
          }
        ],
        isError: true,
      };
    }
  }
  
  if (name === "list_standards") {
    const standardsList = PAVED_ROAD_STANDARDS.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      recommendation: s.recommendation
    }));
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(standardsList, null, 2),
        }
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${name}`,
      }
    ],
    isError: true,
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Repository Health MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
