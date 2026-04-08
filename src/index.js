const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.static(path.join(__dirname, 'public')));

const SERVICE     = 'GitOps Monitor';
const ENV         = process.env.APP_ENV     || 'dev';
const VERSION     = process.env.APP_VERSION || 'v1';
const DEPLOY_TIME = new Date().toISOString();

// 환경별 색상 + 텍스트 설정
const ENV_CONFIG = {
  dev: {
    color:  '#f5a623',
    label:  'Development',
    icon:   '🛠️',
    badge:  'Healthy',
  },
  staging: {
    color:  '#378ADD',
    label:  'Staging',
    icon:   '🧪',
    badge:  'Healthy',
  },
  prod: {
    color:  '#ef4444',
    label:  'Production',
    icon:   '🚀',
    badge:  'Healthy',
  },
};

const cfg = ENV_CONFIG[ENV] || ENV_CONFIG.dev;

app.get('/', (req, res) => {
  res.json({
    service:     SERVICE,
    environment: ENV,
    version:     VERSION,
    deployedAt:  DEPLOY_TIME,
    status:      'Healthy',
    uptime:      `${Math.floor(process.uptime())}s`,
  });
});

app.get('/status', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GitOps Monitor — ${cfg.label}</title>
  <link rel="stylesheet" href="/style.css">
  <style>
    :root { --env-color: ${cfg.color}; }
  </style>
</head>
<body>
<div class="dashboard">

  <nav class="nav">
    <div class="nav-logo"><span>◆</span> GitOps Monitor</div>
    <ul class="nav-links">
      <li class="active">Dashboard</li>
      <li>Clusters</li>
      <li>Pipeline</li>
      <li>Settings</li>
    </ul>
  </nav>

  <div class="hero">
    <div class="hero-left">
      <h2>배포 환경</h2>
      <h1>${cfg.icon} ${cfg.label}</h1>
      <p>ArgoCD + ApplicationSet 기반 멀티 클러스터</p>
      <div class="hero-badge">
        <div class="dot"></div>
        ${cfg.badge}
      </div>
    </div>
    <div class="hero-deco"></div>
    <div class="hero-right">
      <div class="label">현재 버전</div>
      <div class="value">${VERSION}</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">상태</div>
      <div class="status-row">
        <div class="status-dot"></div>
        <div class="status-val">Healthy</div>
      </div>
      <div class="card-sub">모든 Pod 정상 동작 중</div>
    </div>

    <div class="card">
      <div class="card-label">업타임</div>
      <div class="card-value" id="uptime">${Math.floor(process.uptime())}s</div>
      <div class="card-sub">마지막 재시작 이후</div>
    </div>

    <div class="card tall">
      <div class="card-label">클러스터 현황</div>
      <div class="cluster-item">
        <div class="cluster-name">
          <div class="cluster-dot" style="background:#22c55e"></div>
          dev
        </div>
        <span class="badge badge-synced">Synced</span>
      </div>
      <div class="cluster-item">
        <div class="cluster-name">
          <div class="cluster-dot" style="background:#22c55e"></div>
          staging
        </div>
        <span class="badge badge-synced">Synced</span>
      </div>
      <div class="cluster-item">
        <div class="cluster-name">
          <div class="cluster-dot" style="background:#f5a623"></div>
          prod
        </div>
        <span class="badge badge-manual">Manual</span>
      </div>
    </div>

    <div class="card">
      <div class="card-label">배포 시각</div>
      <div class="mono">${DEPLOY_TIME}</div>
    </div>

    <div class="card">
      <div class="card-label">서비스</div>
      <div class="card-value" style="font-size:18px">${SERVICE}</div>
      <div class="card-sub">git push → 자동 배포</div>
    </div>
  </div>

  <div class="footer">GitOps Monitor · Powered by ArgoCD + ApplicationSet</div>

</div>

<script>
  let uptime = ${Math.floor(process.uptime())};
  setInterval(() => {
    uptime++;
    const el = document.getElementById('uptime');
    if (el) el.textContent = uptime < 60
      ? uptime + 's'
      : Math.floor(uptime / 60) + 'm ' + (uptime % 60) + 's';
  }, 1000);
</script>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log(`[${ENV}] ${SERVICE} ${VERSION} 시작됨 → http://localhost:3000/status`);
});


console.log("장애 배포 테스트 ..... 77");
process.exit(1);