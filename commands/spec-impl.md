---
description: Execute spec tasks using TDD methodology
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob, LS, WebFetch, WebSearch
argument-hint: <feature-name> [task-numbers]
version: 1.0.0
source: Based on cc-sdd (https://github.com/gotalab/cc-sdd) - MIT License
---

# Execute Spec Tasks with TDD

Execute implementation tasks for **{{feature_name}}** using Kent Beck's Test-Driven Development methodology.

## Instructions

### Pre-Execution Validation
Validate required files exist for feature **{{feature_name}}**:
- Requirements: `.kiro/specs/{{feature_name}}/requirements.md`
- Design: `.kiro/specs/{{feature_name}}/design.md`  
- Tasks: `.kiro/specs/{{feature_name}}/tasks.md`
- Metadata: `.kiro/specs/{{feature_name}}/spec.json`

### Context Loading

**Core Steering:**
- Structure: @.kiro/steering/structure.md
- Tech Stack: @.kiro/steering/tech.md  
- Product: @.kiro/steering/product.md

**Custom Steering:**
- Additional `*.md` files in `.kiro/steering/` (excluding structure.md, tech.md, product.md)

**Spec Documents for {{feature_name}}:**
- Metadata: @.kiro/specs/{{feature_name}}/spec.json
- Requirements: @.kiro/specs/{{feature_name}}/requirements.md
- Design: @.kiro/specs/{{feature_name}}/design.md
- Tasks: @.kiro/specs/{{feature_name}}/tasks.md

### Task Execution
1. **Feature**: {{feature_name}}  
2. **Task numbers**: {{task_numbers}} (optional, defaults to all pending tasks)
3. **Load all context** (steering + spec documents)
4. **Execute selected tasks** using TDD methodology

### TDD Implementation
For each selected task:

1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests  
3. **REFACTOR**: Clean up and improve code structure
4. **Verify**: 
   - All tests pass
   - No regressions in existing tests
   - Code quality and test coverage maintained
5. **Mark Complete**: Update checkbox from `- [ ]` to `- [x]` in tasks.md

**Note**: Follow Kent Beck's TDD methodology strictly, implementing only the specific task requirements.

## Implementation Notes

- **Feature**: Use `{{feature_name}}` for feature name
- **Tasks**: Use `{{task_numbers}}` for specific task numbers (optional)
- **Validation**: Check all required spec files exist
- **TDD Focus**: Always write tests before implementation
- **Task Tracking**: Update checkboxes in tasks.md as completed
