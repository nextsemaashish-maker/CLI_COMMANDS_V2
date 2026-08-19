// AI CLI Intelligence Engine - Natural Language to Production CLI Command Translator
// Includes instant NLP query matching, safety ratings, flag breakdown, and real-world sysadmin recipes.

export const AI_CATEGORIES = [
  { id: 'all', label: 'All Domains' },
  { id: 'linux', label: 'Linux & Bash' },
  { id: 'git', label: 'Git Version Control' },
  { id: 'docker', label: 'Docker & Compose' },
  { id: 'k8s', label: 'Kubernetes & Cloud' },
  { id: 'network', label: 'Network & Security' },
  { id: 'ps', label: 'PowerShell / Windows' }
];

export const CURATED_AI_RECIPES = [
  // Git Recipes
  {
    id: 'git-undo-last-commit',
    category: 'git',
    query: 'How to undo the last commit but keep my modified files in working directory?',
    command: 'git reset --soft HEAD~1',
    explanation: 'Moves HEAD back by 1 commit while leaving your staged/unstaged changes intact in the working tree.',
    flags: [
      { flag: '--soft', desc: 'Preserves your code changes in the staging area (index).' },
      { flag: 'HEAD~1', desc: 'Points to the commit immediately preceding current HEAD.' }
    ],
    safety: 'safe',
    alternatives: ['git reset --mixed HEAD~1 (unstages changes)', 'git reset --hard HEAD~1 (destroys changes)']
  },
  {
    id: 'git-delete-remote-branch',
    category: 'git',
    query: 'How do I delete a branch on remote GitHub / GitLab origin?',
    command: 'git push origin --delete feature-login',
    explanation: 'Tells the remote repository (origin) to permanently delete the remote reference branch `feature-login`.',
    flags: [
      { flag: 'origin', desc: 'The remote repository alias.' },
      { flag: '--delete', desc: 'Instruction to delete the specified branch.' }
    ],
    safety: 'warning',
    alternatives: ['git push origin :feature-login (older syntax)']
  },
  {
    id: 'git-stash-include-untracked',
    category: 'git',
    query: 'How to stash everything including new untracked and ignored files?',
    command: 'git stash -u -m "WIP before switching branches"',
    explanation: 'Shelves all uncommitted work including new untracked files into the stash stack with a descriptive message.',
    flags: [
      { flag: '-u (--include-untracked)', desc: 'Includes newly created untracked files.' },
      { flag: '-m', desc: 'Attaches a custom descriptive message to the stash.' }
    ],
    safety: 'safe',
    alternatives: ['git stash -a (includes ignored files too)']
  },
  {
    id: 'git-interactive-rebase',
    category: 'git',
    query: 'How to squash or reword the last 4 commits?',
    command: 'git rebase -i HEAD~4',
    explanation: 'Opens an interactive editor to squash (combine), reword, edit, or drop any of the last 4 commits.',
    flags: [
      { flag: '-i', desc: 'Interactive mode offering pick/squash/reword choices.' },
      { flag: 'HEAD~4', desc: 'Rebase starting from 4 commits ago.' }
    ],
    safety: 'warning',
    alternatives: ['git commit --amend (modify only the very last commit)']
  },
  {
    id: 'git-clean-untracked',
    category: 'git',
    query: 'How to remove all untracked files and directories cleanly?',
    command: 'git clean -fd',
    explanation: 'Permanently deletes all files and folders in your repository that are not tracked by Git.',
    flags: [
      { flag: '-f', desc: 'Force deletion.' },
      { flag: '-d', desc: 'Remove untracked directories in addition to untracked files.' }
    ],
    safety: 'destructive',
    alternatives: ['git clean -nd (dry run: preview what would be deleted first)']
  },

  // Linux & Bash Recipes
  {
    id: 'linux-find-large-files',
    category: 'linux',
    query: 'Find all files larger than 100MB in the current directory and subdirectories',
    command: 'find . -type f -size +100M -exec ls -lh {} + | awk \'{print $5, $9}\'',
    explanation: 'Recursively searches for regular files greater than 100 Megabytes and prints their human-readable size and path.',
    flags: [
      { flag: '-type f', desc: 'Filters for regular files only (ignores directory entries).' },
      { flag: '-size +100M', desc: 'Matches files strictly greater than 100 Megabytes.' },
      { flag: '-exec ls -lh {} +', desc: 'Executes ls with human-readable format on batches of matching files.' }
    ],
    safety: 'safe',
    alternatives: ['du -ah . | sort -rh | head -n 15']
  },
  {
    id: 'linux-kill-port-process',
    category: 'linux',
    query: 'How to find and kill the process using port 3000 or 8080?',
    command: 'lsof -ti :3000 | xargs kill -9',
    explanation: 'Finds the exact Process ID (PID) listening on TCP port 3000 and forcefully terminates it.',
    flags: [
      { flag: '-t', desc: 'Terse output: outputs PID numbers only with no headers.' },
      { flag: '-i :3000', desc: 'Selects IPv4/IPv6 network files on port 3000.' },
      { flag: 'kill -9', desc: 'Sends SIGKILL signal to forcibly terminate the process.' }
    ],
    safety: 'warning',
    alternatives: ['fuser -k 3000/tcp', 'kill -15 $(lsof -t -i:3000) (graceful SIGTERM)']
  },
  {
    id: 'linux-grep-recursive',
    category: 'linux',
    query: 'Search for text across all files recursively ignoring case with line numbers',
    command: 'grep -rnI --color=auto "API_SECRET_KEY" ./src',
    explanation: 'Recursively searches inside `./src`, showing matching line numbers and ignoring binary files.',
    flags: [
      { flag: '-r', desc: 'Recursive directory traversal.' },
      { flag: '-n', desc: 'Prefix each output line with 1-based line number.' },
      { flag: '-I', desc: 'Ignore binary files to prevent terminal corruption.' }
    ],
    safety: 'safe',
    alternatives: ['rg -i "API_SECRET_KEY" (ripgrep - ultra fast alternative)']
  },
  {
    id: 'linux-disk-usage-summary',
    category: 'linux',
    query: 'Show the top 10 largest folders on disk',
    command: 'du -h --max-depth=1 /var | sort -hr | head -n 10',
    explanation: 'Calculates the disk space consumed by immediate subdirectories and sorts them descending.',
    flags: [
      { flag: '-h', desc: 'Human-readable sizes (K, M, G).' },
      { flag: '--max-depth=1', desc: 'Inspects top-level child directories only.' },
      { flag: 'sort -hr', desc: 'Sorts numerically by human size descending.' }
    ],
    safety: 'safe',
    alternatives: ['ncdu /var (interactive TUI disk usage analyzer)']
  },
  {
    id: 'linux-live-log-filter',
    category: 'linux',
    query: 'Live monitor a log file and filter only lines containing ERROR or FATAL',
    command: 'tail -f /var/log/app.log | grep --line-buffered -E "ERROR|FATAL"',
    explanation: 'Streams new appended lines from the log file in real-time and filters for high-severity keywords.',
    flags: [
      { flag: '-f', desc: 'Follow: keeps output open and appends new data live.' },
      { flag: '--line-buffered', desc: 'Flushes output buffer immediately per line.' },
      { flag: '-E', desc: 'Enables Extended Regular Expressions (ERE).' }
    ],
    safety: 'safe',
    alternatives: ['journalctl -u app.service -f -p err']
  },

  // Docker Recipes
  {
    id: 'docker-cleanup-all',
    category: 'docker',
    query: 'How to clean up all stopped containers, unused networks, and dangling images?',
    command: 'docker system prune -a --volumes -f',
    explanation: 'Reclaims massive disk space by wiping all unused containers, networks, unreferenced images, and anonymous volumes.',
    flags: [
      { flag: '-a', desc: 'Removes all unused images, not just dangling ones.' },
      { flag: '--volumes', desc: 'Prunes dangling anonymous volumes as well.' },
      { flag: '-f', desc: 'Bypasses the confirmation prompt.' }
    ],
    safety: 'destructive',
    alternatives: ['docker system prune (conservative prune without volumes)']
  },
  {
    id: 'docker-run-interactive-sh',
    category: 'docker',
    query: 'Run a disposable Ubuntu or Alpine container with an interactive bash shell',
    command: 'docker run --rm -it -v $(pwd):/workspace -w /workspace ubuntu:22.04 /bin/bash',
    explanation: 'Spawns an interactive container, mounts current directory to `/workspace`, and automatically removes container upon exit.',
    flags: [
      { flag: '--rm', desc: 'Automatically delete container filesystem when it terminates.' },
      { flag: '-it', desc: 'Allocates a pseudo-TTY and keeps STDIN open.' },
      { flag: '-v $(pwd):/workspace', desc: 'Mounts current host directory into container.' }
    ],
    safety: 'safe',
    alternatives: ['docker run --rm -it alpine:latest /bin/sh']
  },
  {
    id: 'docker-compose-rebuild',
    category: 'docker',
    query: 'Rebuild Docker Compose services from scratch and run in background',
    command: 'docker compose up -d --build --force-recreate',
    explanation: 'Forces a fresh image build from Dockerfiles and recreates containers in detached (background) mode.',
    flags: [
      { flag: '-d', desc: 'Detached mode: run containers in the background.' },
      { flag: '--build', desc: 'Rebuild images before starting containers.' },
      { flag: '--force-recreate', desc: 'Recreate containers even if configuration did not change.' }
    ],
    safety: 'safe',
    alternatives: ['docker compose down && docker compose up --build -d']
  },
  {
    id: 'docker-copy-file',
    category: 'docker',
    query: 'How to copy a file from my host machine into a running Docker container?',
    command: 'docker cp ./config.json my-web-app:/etc/app/config.json',
    explanation: 'Copies files or folders between the host filesystem and the container filesystem without rebuilding.',
    flags: [
      { flag: 'my-web-app', desc: 'Name or container ID of the destination container.' }
    ],
    safety: 'safe',
    alternatives: ['docker cp my-web-app:/var/log/app.log ./app.log (reverse: copy from container to host)']
  },

  // Kubernetes Recipes
  {
    id: 'k8s-port-forward',
    category: 'k8s',
    query: 'Forward a local port to a Kubernetes pod or service for debugging',
    command: 'kubectl port-forward svc/api-service 8080:80 -n production',
    explanation: 'Binds local machine localhost:8080 to port 80 of the `api-service` in the `production` namespace.',
    flags: [
      { flag: 'svc/api-service', desc: 'Target service name.' },
      { flag: '8080:80', desc: 'Maps LocalPort:TargetPort.' },
      { flag: '-n production', desc: 'Specifies target Kubernetes namespace.' }
    ],
    safety: 'safe',
    alternatives: ['kubectl port-forward pod/nginx-pod-xyz 8080:80']
  },
  {
    id: 'k8s-exec-debug',
    category: 'k8s',
    query: 'Open an interactive bash shell inside a running Kubernetes Pod',
    command: 'kubectl exec -it deployment/web-backend -n default -- /bin/bash',
    explanation: 'Executes a command inside the first pod of the deployment `web-backend` and attaches your terminal.',
    flags: [
      { flag: '-it', desc: 'Pass stdin to container and allocate TTY.' },
      { flag: '-n default', desc: 'Target namespace.' },
      { flag: '-- /bin/bash', desc: 'Command executed inside container.' }
    ],
    safety: 'safe',
    alternatives: ['kubectl exec -it web-backend-6789-abc -c app-container -- /bin/sh']
  },
  {
    id: 'k8s-get-events-sorted',
    category: 'k8s',
    query: 'See why a Kubernetes pod is CrashLoopBackOff or failing to start',
    command: 'kubectl get events --sort-by=\'.metadata.creationTimestamp\' -A',
    explanation: 'Lists cluster-wide events (OOMKilled, ImagePullBackOff, failed probes) sorted chronologically.',
    flags: [
      { flag: '--sort-by', desc: 'JSONPath expression to sort output by creation timestamp.' },
      { flag: '-A', desc: 'All namespaces.' }
    ],
    safety: 'safe',
    alternatives: ['kubectl describe pod <pod-name>', 'kubectl logs <pod-name> --previous']
  },

  // Networking & Security
  {
    id: 'net-curl-inspect-headers',
    category: 'network',
    query: 'How to make a curl request and print all request and response headers with timing?',
    command: 'curl -Iv https://api.github.com -w "\nTime Connect: %{time_connect}s\nTime Total: %{time_total}s\n"',
    explanation: 'Performs an HTTP HEAD request with verbose TLS handshake details and custom latency timing metrics.',
    flags: [
      { flag: '-I', desc: 'Fetch HTTP headers only (HEAD method).' },
      { flag: '-v', desc: 'Verbose output including TLS handshake and DNS resolution.' },
      { flag: '-w', desc: 'Custom format string for connection and transfer time.' }
    ],
    safety: 'safe',
    alternatives: ['http HEAD https://api.github.com (HTTPie tool)']
  },
  {
    id: 'net-check-open-ports',
    category: 'network',
    query: 'Check all listening TCP and UDP ports and associated processes',
    command: 'sudo ss -tulpn',
    explanation: 'Modern Linux replacement for `netstat` to display all active listening socket listeners and process IDs.',
    flags: [
      { flag: '-t', desc: 'TCP sockets.' },
      { flag: '-u', desc: 'UDP sockets.' },
      { flag: '-l', desc: 'Listening sockets only.' },
      { flag: '-p', desc: 'Shows the process using the socket.' },
      { flag: '-n', desc: 'Numeric address and port resolution.' }
    ],
    safety: 'safe',
    alternatives: ['sudo netstat -tulpn']
  },

  // PowerShell / Windows
  {
    id: 'ps-find-process-memory',
    category: 'ps',
    query: 'Find top 10 memory-heavy processes in Windows PowerShell',
    command: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, @{Name="RAM(MB)";Expression={[math]::Round($_.WorkingSet64/1MB,2)}}',
    explanation: 'Queries running Windows processes, calculates their RAM consumption in MB, and displays top 10.',
    flags: [
      { flag: 'Get-Process', desc: 'PowerShell cmdlet to retrieve running processes.' },
      { flag: 'Sort-Object -Descending', desc: 'Sorts output from highest to lowest.' }
    ],
    safety: 'safe',
    alternatives: ['tasklist /FI "MEMUSAGE gt 100000"']
  },
  {
    id: 'ps-test-port-connectivity',
    category: 'ps',
    query: 'Test if a remote server port is reachable via PowerShell (like telnet)',
    command: 'Test-NetConnection -ComputerName db.example.com -Port 5432 -InformationLevel Detailed',
    explanation: 'Tests TCP connection and returns detailed ping, DNS resolution, and TCP handshake success status.',
    flags: [
      { flag: '-ComputerName', desc: 'Host or IP address to target.' },
      { flag: '-Port', desc: 'TCP port number (e.g. 5432 for Postgres, 443 for HTTPS).' }
    ],
    safety: 'safe',
    alternatives: ['tnc db.example.com -p 5432 (PowerShell alias)']
  }
];

// NLP Smart Query Matcher
export function queryAiAssistant(userPrompt, category = 'all') {
  if (!userPrompt || !userPrompt.trim()) {
    return category === 'all'
      ? CURATED_AI_RECIPES.slice(0, 8)
      : CURATED_AI_RECIPES.filter((r) => r.category === category);
  }

  const clean = userPrompt.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter((t) => t.length > 1);

  // Score matching
  const scored = CURATED_AI_RECIPES.map((recipe) => {
    let score = 0;
    if (category !== 'all' && recipe.category !== category) {
      return { recipe, score: -1 };
    }

    const qText = (recipe.query + ' ' + recipe.command + ' ' + recipe.explanation).toLowerCase();

    // Exact phrase match bonus
    if (qText.includes(clean)) score += 50;

    // Token match
    tokens.forEach((token) => {
      if (recipe.command.toLowerCase().includes(token)) score += 15;
      if (recipe.query.toLowerCase().includes(token)) score += 10;
      if (recipe.explanation.toLowerCase().includes(token)) score += 5;
    });

    return { recipe, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.recipe);

  // If no direct recipe matched, synthesize a dynamic suggestion
  if (matched.length === 0) {
    return [
      {
        id: 'dynamic-suggestion',
        category: category !== 'all' ? category : 'linux',
        query: userPrompt,
        command: synthesizeDynamicCommand(userPrompt),
        explanation: `Synthesized smart command proposal based on analysis of: "${userPrompt}". Review flags before execution.`,
        flags: [
          { flag: '--help / man', desc: 'Check manual page for exact parameter options.' }
        ],
        safety: 'safe',
        alternatives: ['Type "help" in the live terminal to inspect all available tools.']
      }
    ];
  }

  return matched;
}

function synthesizeDynamicCommand(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('git') && p.includes('branch')) return 'git branch -a --sort=-committerdate';
  if (p.includes('git') && (p.includes('log') || p.includes('history'))) return 'git log --oneline --graph --decorate --all -n 15';
  if (p.includes('docker') && (p.includes('log') || p.includes('inspect'))) return 'docker logs -f --tail=100 <container_id>';
  if (p.includes('k8s') || p.includes('kubectl') || p.includes('pod')) return 'kubectl get pods -o wide --show-labels';
  if (p.includes('port') || p.includes('listen')) return 'ss -tulpn | grep LISTEN';
  if (p.includes('permission') || p.includes('chmod')) return 'chmod -R 755 ./scripts && chown -R $USER:$USER .';
  if (p.includes('tar') || p.includes('zip') || p.includes('compress')) return 'tar -czvf backup_$(date +%F).tar.gz ./data';
  return `man ${prompt.split(' ')[0] || 'bash'} || command -v ${prompt.split(' ')[0] || 'ls'}`;
}
