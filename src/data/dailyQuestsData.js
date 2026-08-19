// Daily Quests System Data with XP Rewards and Claim Logic

export const INITIAL_DAILY_QUESTS = [
  {
    id: 'quest-run-commands',
    title: 'Terminal Explorer',
    desc: 'Execute at least 5 different commands in the Live Terminal',
    target: 5,
    current: 2,
    rewardXp: 150,
    icon: 'Terminal',
    completed: false,
    claimed: false
  },
  {
    id: 'quest-speed-typing',
    title: 'Keyboard Striker',
    desc: 'Achieve 45+ WPM in the Speed CLI Typing Arena',
    target: 45,
    current: 0,
    rewardXp: 200,
    icon: 'Zap',
    completed: false,
    claimed: false
  },
  {
    id: 'quest-perfect-quiz',
    title: 'Command Scholar',
    desc: 'Complete any lesson quiz with 100% first-try accuracy',
    target: 1,
    current: 1,
    rewardXp: 250,
    icon: 'Award',
    completed: true,
    claimed: false
  },
  {
    id: 'quest-sandbox-explorer',
    title: 'Visual Architect',
    desc: 'Perform 3 Git branches or Docker container actions in Visual Sandboxes',
    target: 3,
    current: 1,
    rewardXp: 180,
    icon: 'Boxes',
    completed: false,
    claimed: false
  }
];

export const TYPING_CHALLENGES = [
  {
    category: 'Essential Bash',
    cmd: 'find /var/log -type f -name "*.log" -mtime -7 -exec gzip {} \\;',
    difficulty: 'Medium'
  },
  {
    category: 'Git Power Moves',
    cmd: 'git commit --amend --no-edit && git push --force-with-lease origin main',
    difficulty: 'Hard'
  },
  {
    category: 'Docker Containerization',
    cmd: 'docker run -d --name postgres-db -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16-alpine',
    difficulty: 'Hard'
  },
  {
    category: 'Kubernetes Ops',
    cmd: 'kubectl rollout restart deployment/web-gateway -n production',
    difficulty: 'Medium'
  },
  {
    category: 'Linux File Ops',
    cmd: 'tar -czvf archive_backup.tar.gz /home/user/workspace/src',
    difficulty: 'Easy'
  },
  {
    category: 'System Diagnostics',
    cmd: 'ss -tulpn | grep LISTEN | awk \'{print $1, $5}\'',
    difficulty: 'Medium'
  },
  {
    category: 'Git Branching',
    cmd: 'git checkout -b feature/auth-jwt origin/main',
    difficulty: 'Easy'
  },
  {
    category: 'Cloud DevTools',
    cmd: 'curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh',
    difficulty: 'Medium'
  }
];
