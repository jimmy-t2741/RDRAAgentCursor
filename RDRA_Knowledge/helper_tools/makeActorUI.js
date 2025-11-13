const fs = require("fs/promises");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "RDRA_Knowledge", "helper_tools", "web_tool", "actorUI.html");

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>アクター別ポータル</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: 'Segoe UI', 'Meiryo', sans-serif;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #1a1a1a;
      color: #f0f0f0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 32px 16px;
    }
    .app-shell {
      width: min(1200px, 100%);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tab-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tab-button {
      border: 1px solid #3a3a3a;
      border-radius: 999px;
      background: #252525;
      color: #d0d0d0;
      padding: 10px 20px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
    }
    .tab-button:hover {
      background: #333333;
      color: #ffffff;
    }
    .tab-button.active {
      background: #ff8c42;
      border-color: transparent;
      color: #111111;
      font-weight: 600;
      transform: translateY(-1px);
    }
    .window {
      background: #202020;
      border: 1px solid #2f2f2f;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #2f2f2f;
      padding-bottom: 16px;
    }
    .header-context {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    .actor-name {
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffcc7a;
    }
    .screen-title {
      font-size: 24px;
      line-height: 1.2;
      color: #ffffff;
      word-break: keep-all;
    }
    .screen-context {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .context-chip {
      background: rgba(255, 140, 66, 0.18);
      color: #ffb36a;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 12px;
    }
    .context-chip.muted {
      background: rgba(255, 255, 255, 0.05);
      color: #888888;
    }
    .header-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }
    .screen-step {
      font-size: 13px;
      color: #bbbbbb;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    button {
      font-size: 14px;
      font-family: inherit;
    }
    .ghost,
    .primary {
      padding: 10px 18px;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: transform 0.1s ease, background 0.2s ease, border-color 0.2s ease;
    }
    .ghost {
      background: transparent;
      border-color: #555555;
      color: #dddddd;
    }
    .ghost:hover:not(:disabled) {
      border-color: #ff8c42;
      color: #ff8c42;
    }
    .primary {
      background: #ff8c42;
      color: #1a1a1a;
      font-weight: 600;
    }
    .primary:hover:not(:disabled) {
      background: #ffa057;
    }
    .ghost:disabled,
    .primary:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
    .layout {
      display: grid;
      grid-template-columns: 220px 1fr 220px;
      gap: 16px;
    }
    .side-panel {
      background: #191919;
      border: 1px solid #2b2b2b;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 520px;
    }
    .side-panel h2 {
      font-size: 16px;
      color: #ff8c42;
      border-bottom: 1px solid #2f2f2f;
      padding-bottom: 8px;
    }
    .side-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
    }
    .side-card {
      background: #262626;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: transform 0.1s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .side-card:hover,
    .side-card:focus {
      outline: none;
      transform: translateY(-1px);
      border-color: #ff8c42;
      background: #2f2f2f;
    }
    .side-card strong {
      font-size: 14px;
      color: #ffffff;
      line-height: 1.4;
    }
    .side-card ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .side-card li {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      font-size: 12px;
      color: #bbbbbb;
    }
    .type-chip {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      padding: 2px 8px;
      color: #dddddd;
      font-size: 11px;
      white-space: nowrap;
    }
    .main-panel {
      background: #191919;
      border: 1px solid #2b2b2b;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 520px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .section-header h2 {
      font-size: 16px;
      color: #ffb36a;
    }
    .operation-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .operation-chip {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .field-card {
      background: #262626;
      border-radius: 10px;
      border: 1px solid transparent;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.2s ease;
    }
    .field-card:hover {
      border-color: #ff8c42;
    }
    .field-card label {
      font-size: 14px;
      color: #ffffff;
    }
    .control-input,
    .control-select {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #3b3b3b;
      background: #1f1f1f;
      color: #ffffff;
      padding: 10px;
      font-size: 14px;
    }
    .control-input::placeholder {
      color: #777777;
    }
    .control-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #dddddd;
    }
    .control-checkbox input {
      width: 18px;
      height: 18px;
    }
    .tooltip {
      font-size: 12px;
      color: #aaaaaa;
      line-height: 1.4;
    }
    .data-access-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .data-access-card {
      background: #262626;
      border-radius: 10px;
      padding: 12px 14px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 180px;
    }
    .data-access-card strong {
      color: #ffffff;
      font-size: 14px;
    }
    .crud-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(255, 140, 66, 0.18);
      color: #ffb36a;
      padding: 2px 8px;
      font-size: 12px;
      margin-right: 4px;
    }
    .empty-state {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 16px;
      color: #aaaaaa;
      font-size: 13px;
      text-align: center;
    }
    .error {
      border: 1px solid rgba(255, 66, 66, 0.5);
      background: rgba(255, 66, 66, 0.1);
      border-radius: 12px;
      padding: 24px;
      color: #ffb4b4;
      font-size: 14px;
      text-align: center;
    }
    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .side-panel {
        min-height: auto;
        order: 3;
      }
      .side-panel:first-of-type {
        order: 2;
      }
      .main-panel {
        order: 1;
      }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <div class="tab-bar" id="tabBar" role="tablist" aria-label="アクター一覧"></div>
    <div class="window" id="window">
      <header class="header">
        <div class="header-context">
          <p class="actor-name" id="actorName">アクター未設定</p>
          <h1 class="screen-title" id="screenTitle">画面未定義</h1>
          <div class="screen-context" id="screenContext">
            <span class="context-chip muted">業務が設定されていません</span>
          </div>
        </div>
        <div class="header-actions">
          <span class="screen-step" id="screenStep">0 / 0</span>
          <div class="action-buttons">
            <button type="button" class="ghost" id="cancelButton" disabled>取消</button>
            <button type="button" class="primary" id="submitButton" disabled>登録</button>
          </div>
        </div>
      </header>
      <div class="layout">
        <aside class="side-panel">
          <h2>先工程</h2>
          <div class="side-list" id="prevPanel">
            <div class="empty-state">先行する画面はありません</div>
          </div>
        </aside>
        <main class="main-panel">
          <section>
            <div class="section-header">
              <h2>想定操作</h2>
            </div>
            <div class="operation-list" id="operationList">
              <div class="empty-state">操作が定義されていません</div>
            </div>
          </section>
          <section>
            <div class="section-header">
              <h2>入力エリア</h2>
            </div>
            <div class="field-grid" id="fieldList">
              <div class="empty-state">フィールドが定義されていません</div>
            </div>
          </section>
          <section>
            <div class="section-header">
              <h2>データアクセス</h2>
            </div>
            <div class="data-access-list" id="dataAccessList">
              <div class="empty-state">データアクセスの定義はありません</div>
            </div>
          </section>
        </main>
        <aside class="side-panel">
          <h2>後工程</h2>
          <div class="side-list" id="nextPanel">
            <div class="empty-state">後続する画面はありません</div>
          </div>
        </aside>
      </div>
    </div>
  </div>
  <script>
    (function () {
      const DATA_PATHS = ['/api/actor-ui', '../2_RDRASpec/actor_ui.json'];
      const fetchActorData = async function () {
        for (const url of DATA_PATHS) {
          try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
              continue;
            }
            return await response.json();
          } catch (error) {
            console.warn('Failed to load actor data from', url, error);
          }
        }
        throw new Error('全ての候補パスで actor_ui.json を取得できません');
      };
      const state = {
        actors: [],
        currentActorIndex: 0,
        currentScreenIndices: []
      };

      const elements = {
        tabBar: document.getElementById('tabBar'),
        window: document.getElementById('window'),
        actorName: document.getElementById('actorName'),
        screenTitle: document.getElementById('screenTitle'),
        screenContext: document.getElementById('screenContext'),
        screenStep: document.getElementById('screenStep'),
        cancelButton: document.getElementById('cancelButton'),
        submitButton: document.getElementById('submitButton'),
        operationList: document.getElementById('operationList'),
        fieldList: document.getElementById('fieldList'),
        dataAccessList: document.getElementById('dataAccessList'),
        prevPanel: document.getElementById('prevPanel'),
        nextPanel: document.getElementById('nextPanel')
      };

      const escapeHtml = function (value) {
        if (value === undefined || value === null) {
          return '';
        }
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      };

      const toArray = function (value) {
        if (!value && value !== 0) {
          return [];
        }
        return Array.isArray(value) ? value : [value];
      };

      const pickFields = function (screen, limit) {
        const fields = toArray(screen && screen.fields);
        return fields.slice(0, limit);
      };

      const formatBusinessContext = function (screen) {
        const businesses = toArray(screen && screen.businesses);
        if (!businesses.length) {
          return ['業務が設定されていません'];
        }
        const lines = [];
        businesses.forEach(function (business) {
          const name = business && business.business_name ? business.business_name : '';
          const bucs = toArray(business && business.BUCs);
          const label = bucs.length ? bucs.join(' / ') : '';
          if (name && label) {
            lines.push(name + ' ＞ ' + label);
          } else if (name) {
            lines.push(name);
          } else if (label) {
            lines.push(label);
          }
        });
        return lines.length ? lines : ['業務が設定されていません'];
      };

      const createFieldControl = function (field) {
        const rawType = field && field.type ? String(field.type) : '';
        const type = rawType.toLowerCase();
        if (type === 'string' || type === 'text') {
          return '<input type="text" class="control-input" placeholder="テキストを入力" />';
        }
        if (type === 'number' || type === 'numeric') {
          return '<input type="number" class="control-input" placeholder="数値を入力" />';
        }
        if (type === 'date') {
          return '<input type="date" class="control-input" />';
        }
        if (type === 'time') {
          return '<input type="time" class="control-input" />';
        }
        if (type === 'datetime' || type === 'datetime-local' || type === 'timestamp') {
          return '<input type="datetime-local" class="control-input" />';
        }
        if (type === 'boolean' || type === 'flag') {
          return '<label class="control-checkbox"><input type="checkbox" /> <span>オン / オフ</span></label>';
        }
        if (type === 'variation' || type === 'valiation' || type === 'enum' || /select/i.test(type)) {
          return '<select class="control-select"><option>選択してください</option></select>';
        }
        if (/[぀-ヿ一-龯]/.test(rawType)) {
          return '<select class="control-select"><option>' + escapeHtml(rawType) + 'を選択</option></select>';
        }
        return '<input type="text" class="control-input" placeholder="' + escapeHtml(rawType || '値を入力') + '" />';
      };

      const renderTabs = function () {
        if (!state.actors.length) {
          elements.tabBar.innerHTML = '<div class="empty-state" style="width:100%;">アクターが定義されていません</div>';
          return;
        }
        const buttons = state.actors.map(function (actor, index) {
          const name = actor && actor.actor_name ? actor.actor_name : 'アクター ' + (index + 1);
          const activeClass = index === state.currentActorIndex ? 'tab-button active' : 'tab-button';
          return '<button type="button" class="' + activeClass + '" data-index="' + index + '" role="tab" aria-selected="' + (index === state.currentActorIndex) + '">' + escapeHtml(name) + '</button>';
        }).join('');
        elements.tabBar.innerHTML = buttons;
        const tabButtons = elements.tabBar.querySelectorAll('button[data-index]');
        tabButtons.forEach(function (button) {
          button.addEventListener('click', function () {
            const nextIndex = Number(button.getAttribute('data-index'));
            if (Number.isNaN(nextIndex)) {
              return;
            }
            state.currentActorIndex = nextIndex;
            if (!state.currentScreenIndices[nextIndex]) {
              state.currentScreenIndices[nextIndex] = 0;
            }
            render();
          });
        });
      };

      const renderOperations = function (screen) {
        const operations = toArray(screen && screen.operations);
        if (!operations.length) {
          elements.operationList.innerHTML = '<div class="empty-state">操作が定義されていません</div>';
          return;
        }
        const chips = operations.map(function (operation) {
          return '<span class="operation-chip">' + escapeHtml(operation) + '</span>';
        }).join('');
        elements.operationList.innerHTML = chips;
      };

      const renderFields = function (screen) {
        const fields = toArray(screen && screen.fields);
        if (!fields.length) {
          elements.fieldList.innerHTML = '<div class="empty-state">フィールドが定義されていません</div>';
          return;
        }
        const cards = fields.map(function (field) {
          const label = field && field['項目名'] ? field['項目名'] : field && field.label ? field.label : '無題の項目';
          const tooltip = field && field.tooltip ? field.tooltip : '';
          const control = createFieldControl(field);
          return '<article class="field-card"><label>' + escapeHtml(label) + '</label>' + control + (tooltip ? '<p class="tooltip">' + escapeHtml(tooltip) + '</p>' : '') + '</article>';
        }).join('');
        elements.fieldList.innerHTML = cards;
      };

      const renderDataAccess = function (screen) {
        const dataAccess = toArray(screen && screen.data_access);
        if (!dataAccess.length) {
          elements.dataAccessList.innerHTML = '<div class="empty-state">データアクセスの定義はありません</div>';
          return;
        }
        const cards = dataAccess.map(function (entry) {
          const entity = entry && entry.entity ? entry.entity : 'エンティティ未定義';
          const crudList = toArray(entry && entry.CRUD);
          const crudChips = crudList.length
            ? crudList.map(function (crud) {
              return '<span class="crud-chip">' + escapeHtml(crud) + '</span>';
            }).join('')
            : '<span class="crud-chip">未指定</span>';
          return '<article class="data-access-card"><strong>' + escapeHtml(entity) + '</strong><div>' + crudChips + '</div></article>';
        }).join('');
        elements.dataAccessList.innerHTML = cards;
      };

      const renderSideList = function (container, items, onSelect) {
        if (!items.length) {
          container.innerHTML = '<div class="empty-state">対象はありません</div>';
          return;
        }
        const cards = items.map(function (item) {
          const screen = item.screen || {};
          const screenName = screen.screen_name ? screen.screen_name : '画面未定義';
          const fields = pickFields(screen, 3);
          const detail = fields.map(function (field) {
            const label = field && field['項目名'] ? field['項目名'] : field && field.label ? field.label : '項目';
            const type = field && field.type ? field.type : '';
            return '<li><span>' + escapeHtml(label) + '</span>' + (type ? '<span class="type-chip">' + escapeHtml(type) + '</span>' : '') + '</li>';
          }).join('');
          return '<article class="side-card" tabindex="0" data-index="' + item.index + '"><strong>' + escapeHtml(screenName) + '</strong><ul>' + detail + '</ul></article>';
        }).join('');
        container.innerHTML = cards;
        const cardsEls = container.querySelectorAll('.side-card');
        cardsEls.forEach(function (card) {
          card.addEventListener('click', function () {
            const nextIndex = Number(card.getAttribute('data-index'));
            if (Number.isNaN(nextIndex)) {
              return;
            }
            onSelect(nextIndex);
          });
          card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              const nextIndex = Number(card.getAttribute('data-index'));
              if (Number.isNaN(nextIndex)) {
                return;
              }
              onSelect(nextIndex);
            }
          });
        });
      };

      const updateNavigationButtons = function (screens, index) {
        const hasPrev = index > 0;
        const hasNext = index < screens.length - 1;
        elements.cancelButton.disabled = !hasPrev;
        elements.submitButton.disabled = !hasNext;
      };

      const getCurrent = function () {
        const actor = state.actors[state.currentActorIndex];
        if (!actor) {
          return null;
        }
        const screens = toArray(actor.screens);
        if (!screens.length) {
          return { actor: actor, screen: null, screens: screens, index: -1 };
        }
        const maxIndex = screens.length - 1;
        const rawIndex = state.currentScreenIndices[state.currentActorIndex] || 0;
        const index = Math.min(Math.max(rawIndex, 0), maxIndex);
        state.currentScreenIndices[state.currentActorIndex] = index;
        return { actor: actor, screen: screens[index], screens: screens, index: index };
      };

      const render = function () {
        renderTabs();
        const current = getCurrent();
        if (!current || !current.actor) {
          elements.actorName.textContent = 'アクター未設定';
          elements.screenTitle.textContent = '画面未定義';
          elements.screenContext.innerHTML = '<span class="context-chip muted">データが読み込まれていません</span>';
          elements.screenStep.textContent = '0 / 0';
          elements.operationList.innerHTML = '<div class="empty-state">操作が定義されていません</div>';
          elements.fieldList.innerHTML = '<div class="empty-state">フィールドが定義されていません</div>';
          elements.dataAccessList.innerHTML = '<div class="empty-state">データアクセスの定義はありません</div>';
          elements.prevPanel.innerHTML = '<div class="empty-state">対象はありません</div>';
          elements.nextPanel.innerHTML = '<div class="empty-state">対象はありません</div>';
          elements.cancelButton.disabled = true;
          elements.submitButton.disabled = true;
          return;
        }

        const actor = current.actor;
        const screen = current.screen;
        const screens = current.screens;
        const index = current.index;

        elements.actorName.textContent = actor && actor.actor_name ? actor.actor_name : 'アクター未設定';

        if (!screen) {
          elements.screenTitle.textContent = '画面未定義';
          elements.screenContext.innerHTML = '<span class="context-chip muted">画面が登録されていません</span>';
          elements.screenStep.textContent = '0 / ' + screens.length;
          elements.operationList.innerHTML = '<div class="empty-state">操作が定義されていません</div>';
          elements.fieldList.innerHTML = '<div class="empty-state">フィールドが定義されていません</div>';
          elements.dataAccessList.innerHTML = '<div class="empty-state">データアクセスの定義はありません</div>';
          elements.prevPanel.innerHTML = '<div class="empty-state">対象はありません</div>';
          elements.nextPanel.innerHTML = '<div class="empty-state">対象はありません</div>';
          elements.cancelButton.disabled = true;
          elements.submitButton.disabled = true;
          return;
        }

        elements.screenTitle.textContent = screen.screen_name ? screen.screen_name : '画面未定義';
        const contexts = formatBusinessContext(screen).map(function (line) {
          return '<span class="context-chip">' + escapeHtml(line) + '</span>';
        }).join('');
        elements.screenContext.innerHTML = contexts;
        elements.screenStep.textContent = (index + 1) + ' / ' + screens.length;

        renderOperations(screen);
        renderFields(screen);
        renderDataAccess(screen);

        const prevScreens = screens.slice(0, index).map(function (item, idx) {
          return { screen: item, index: idx };
        });
        const nextScreens = screens.slice(index + 1).map(function (item, offset) {
          return { screen: item, index: index + 1 + offset };
        });

        renderSideList(elements.prevPanel, prevScreens, function (nextIndex) {
          state.currentScreenIndices[state.currentActorIndex] = nextIndex;
          render();
        });
        renderSideList(elements.nextPanel, nextScreens, function (nextIndex) {
          state.currentScreenIndices[state.currentActorIndex] = nextIndex;
          render();
        });

        updateNavigationButtons(screens, index);
      };

      const navigate = function (delta) {
        const current = getCurrent();
        if (!current || !current.screen) {
          return;
        }
        const nextIndex = current.index + delta;
        if (nextIndex < 0 || nextIndex >= current.screens.length) {
          return;
        }
        state.currentScreenIndices[state.currentActorIndex] = nextIndex;
        render();
      };

      elements.cancelButton.addEventListener('click', function () {
        navigate(-1);
      });

      elements.submitButton.addEventListener('click', function () {
        navigate(1);
      });

      const bootstrap = function () {
        fetchActorData()
          .then(function (payload) {
            state.actors = toArray(payload && payload.actors);
            state.currentScreenIndices = state.actors.map(function () {
              return 0;
            });
            render();
          })
          .catch(function (error) {
            console.error('actor_ui.json の読み込みに失敗しました', error);
            const message = error && error.message ? error.message : '不明なエラーが発生しました';
            elements.window.innerHTML = '<div class="error">actor_ui.json の読み込みに失敗しました<br />' + escapeHtml(message) + '</div>';
          });
      };



    document.addEventListener('DOMContentLoaded', bootstrap);
    })();
  </script>
</body>
</html>
`;

const main = async () => {
  await fs.writeFile(OUTPUT_PATH, HTML_TEMPLATE, "utf8");
  console.log(`actorUI.html を出力しました: ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error("actorUI.html の出力に失敗しました", error);
  process.exitCode = 1;
});

