(function (global) {
  'use strict';

  const W = 1440, CW = 1200;
  const color = { ink: '#141414', muted: '#636C73', border: '#E6E8EB', surface: '#F8F9FA', white: '#FFFFFF', active: '#F2F4F5', accent: '#1E9EFF', action: '#1670B5', danger: '#C82E2E', disabled: '#F5F5F5', softBlue: '#E9F5FF' };
  const fonts = { body: 'Pretendard', display: 'Gowun Batang' };
  const logoArtwork = "<g fill=\"#141414\"><path d=\"M14 10H44V58L29 48L14 58Z\"/><path d=\"M58 49.352L65.227 49.352L65.227 34.264C65.227 31.041 67.619 28.746 70.891 28.746C71.916 28.746 73.283 28.941 73.967 29.137L73.967 22.691C73.332 22.545 72.404 22.447 71.672 22.447C68.693 22.447 66.252 24.156 65.275 27.428L64.982 27.428L64.982 22.838L58 22.838M89.494 49.889C96.037 49.889 100.432 46.666 101.457 41.783L94.572 41.783C93.840 43.395 92.082 44.469 89.641 44.469C85.930 44.469 83.537 41.979 83.537 37.975L101.652 37.975L101.652 35.924C101.652 26.891 96.184 22.496 89.201 22.496C81.438 22.496 76.408 28.014 76.408 36.217C76.408 44.615 81.389 49.889 89.494 49.889M83.537 33.434C83.659 30.382 86.027 27.916 89.348 27.916C92.570 27.916 94.816 30.211 94.816 33.434M104.924 41.930C104.924 47.203 108.684 49.840 113.762 49.840C117.717 49.840 120.207 48.131 121.525 45.689L121.721 45.689L121.721 49.352L128.557 49.352L128.557 31.480C128.557 25.084 123.088 22.496 117.326 22.496C110.295 22.496 106.291 26.109 105.852 30.699L112.736 30.699C113.127 28.893 114.689 27.770 117.131 27.770C119.816 27.770 121.330 29.088 121.379 31.285L121.379 33.434C120.256 33.482 116.691 33.653 114.787 33.775C109.709 34.068 104.924 36.021 104.924 41.930M111.857 41.734C111.857 39.684 113.469 38.512 115.959 38.268C117.204 38.146 120.280 37.975 121.379 37.926L121.379 39.879C121.428 42.662 119.084 44.859 115.813 44.859C113.518 44.859 111.857 43.785 111.857 41.734M143.840 49.791C148.137 49.791 150.334 47.301 151.359 45.104L151.701 45.104L151.701 49.352L158.830 49.352L158.830 14L151.604 14L151.604 27.281L151.359 27.281C150.383 25.133 148.283 22.496 143.840 22.496C137.980 22.496 133.049 27.037 133.049 36.119C133.049 44.957 137.785 49.791 143.840 49.791M146.086 44.029C142.424 44.029 140.471 40.758 140.471 36.070C140.471 31.432 142.424 28.258 146.086 28.258C149.699 28.258 151.750 31.285 151.750 36.070C151.750 40.855 149.699 44.029 146.086 44.029M171.867 14L164.641 14L164.641 49.352L171.867 49.352M181.730 59.313C187.346 59.313 190.227 56.529 191.740 52.281L202.092 22.838L194.426 22.838L188.811 42.369L188.518 42.369L182.951 22.838L175.383 22.838L184.904 50.084L184.465 51.207C183.586 53.502 182.414 53.648 180.998 53.648C180.070 53.648 178.996 53.600 178.068 53.551L178.068 59.166C178.996 59.264 180.314 59.313 181.730 59.313\"/></g>";
  const coverPalette = [
    { bg: '#FAF9F6', ink: '#324155', art: '#9C2424' },
    { bg: '#FFF1C0', ink: '#324155', art: '#8B8154' },
    { bg: '#C2EBD4', ink: '#185031', art: '#288852' },
    { bg: '#324155', ink: '#FFFFFF', art: '#D7CEA3' },
    { bg: '#BAE1FF', ink: '#0D426B', art: '#1670B5' },
    { bg: '#EDE8D5', ink: '#524C32', art: '#8B8154' },
    { bg: '#FDD2B0', ink: '#692E00', art: '#B24E00' },
    { bg: '#D4CCF6', ink: '#30265F', art: '#6952CD' },
  ];
  const books = [
    { title: '소년이 온다', author: '한강', category: '소설', count: 48 },
    { title: '아몬드', author: '손원평', category: '소설', count: 32 },
    { title: '불편한 편의점', author: '김호연', category: '소설', count: 36 },
    { title: '데미안', author: '헤르만 헤세', category: '문학', count: 24 },
    { title: '물고기는 존재하지 않는다', author: '룰루 밀러', category: '인문', count: 27 },
    { title: '아주 작은 습관의 힘', author: '제임스 클리어', category: '자기계발', count: 19 },
    { title: '여행의 이유', author: '김영하', category: '에세이', count: 0 },
    { title: '긴긴밤', author: '루리', category: '소설', count: 0 },
  ];
  const records = [
    { title: '기억한다는 건, 끝내 곁에 머무는 일', book: 0, excerpt: '책을 덮은 뒤에도 남아 있는 목소리들. 우리가 기억해야 하는 이유를 생각했습니다.', user: '서연', date: '2026.10.23', likes: 24, comments: 8 },
    { title: '다른 사람의 마음을 이해한다는 것', book: 1, excerpt: '감정을 배운다는 건 어떤 모습일까요. 익숙했던 관계를 다시 돌아보게 된 책입니다.', user: '책갈피', date: '2026.10.22', likes: 18, comments: 4 },
    { title: '작은 친절이 하루를 바꾸는 순간', book: 2, excerpt: '평범한 공간에서 발견한 따뜻한 마음. 오늘은 나도 조금 더 다정해지기로 했습니다.', user: '윤슬', date: '2026.10.22', likes: 32, comments: 12 },
    { title: '나의 세계를 넓히는 질문', book: 3, excerpt: '익숙한 경계를 한 발 넘어선다는 것. 내가 선택한 삶을 살아가고 있는지 묻습니다.', user: '민수', date: '2026.10.21', likes: 12, comments: 3 },
    { title: '분류할 수 없는 삶의 아름다움', book: 4, excerpt: '질서라고 믿었던 것들 바깥을 바라보며 예상치 못한 방향에서 위로를 얻었습니다.', user: '온유', date: '2026.10.20', likes: 41, comments: 9 },
    { title: '매일 조금씩 쌓아가는 나의 변화', book: 5, excerpt: '큰 결심보다 작고 꾸준한 실천부터. 나에게 맞는 독서 습관을 적어봅니다.', user: '하루', date: '2026.10.19', likes: 21, comments: 5 },
  ];

  function widthOf(s, size) {
    return [...s].reduce((sum, c) => sum + (/\s/.test(c) ? .3 : /[\u0000-\u007f]/.test(c) ? .55 : .97) * size, 0);
  }
  function wrap(value, width, size) {
    const output = [];
    for (const paragraph of String(value).split('\n')) {
      let line = '';
      for (const word of paragraph.split(/\s+/)) {
        if (!word) continue;
        const candidate = line ? line + ' ' + word : word;
        if (widthOf(candidate, size) <= width) { line = candidate; continue; }
        if (line) { output.push(line); line = ''; }
        for (const char of word) {
          if (line && widthOf(line + char, size) > width) { output.push(line); line = ''; }
          line += char;
        }
      }
      output.push(line);
    }
    return output;
  }

  function t(value, width, size = 16, weight = 400, tone = 'ink', extra = {}) {
    if (value === '↳' || value === '☐' || value === '☑') return { type: 'icon', name: value === '↳' ? 'Reply Arrow' : 'Agreement Checkbox', kind: value === '↳' ? 'reply' : value === '☑' ? 'checked' : 'unchecked', w: width, h: Math.ceil(size * 1.5), size, ...extra };
    let lines = wrap(value, width, size);
    if (extra.maxLines && lines.length > extra.maxLines) lines = [...lines.slice(0, extra.maxLines - 1), lines[extra.maxLines - 1].slice(0, -1) + '…'];
    const lh = Math.ceil(size * 1.5);
    return { type: 'text', name: value.split('\n')[0], w: width, h: lines.length * lh, lines, size, weight, tone, lh, font: 'body', ...extra };
  }
  function space(h) { return { type: 'space', name: 'Space', w: 1, h }; }
  function line(w) { return { type: 'line', name: 'Divider', w, h: 1 }; }
  function box(name, w, children, options = {}) {
    const { dir = 'col', gap = 16, p = 0, fill = null, border = false, radius = 0, align = 'start', height = 0, action } = options;
    const pad = Array.isArray(p) ? p : [p, p, p, p];
    const [pt, pr, pb, pl] = pad;
    let x = pl, y = pt;
    const contentH = dir === 'row' ? Math.max(0, ...children.map(c => c.h)) : children.reduce((s, c) => s + c.h, 0) + Math.max(0, children.length - 1) * gap;
    const h = Math.max(height, contentH + pt + pb);
    for (const child of children) {
      child.x = x; child.y = y;
      if (dir === 'row') { if (align === 'center') child.y = pt + (h - pt - pb - child.h) / 2; if (align === 'end') child.y = h - pb - child.h; x += child.w + gap; }
      else { if (align === 'center') child.x = pl + (w - pl - pr - child.w) / 2; y += child.h + gap; }
    }
    return { type: 'frame', name, w, h, dir, gap, pad, fill, border, radius, children, action };
  }
  function row(name, w, children, gap = 16, options = {}) { return box(name, w, children, { ...options, dir: 'row', gap }); }
  function col(name, w, children, gap = 16, options = {}) { return box(name, w, children, { ...options, gap }); }
  function button(label, w = 132, variant = 'neutral', action) {
    const primary = variant === 'primary', dropdown = label.includes('▾');
    const cleanLabel = label.replace('▾', '').trim();
    const labelNode = t(cleanLabel, w - 24 - (dropdown ? 24 : 0), 15, 600, primary ? 'white' : 'ink', { center: true });
    const content = dropdown ? row('Button Content', w - 24, [labelNode, { type: 'icon', name: 'Chevron Down', kind: 'down', w: 16, h: 16, size: 16 }], 8, { align: 'center' }) : labelNode;
    const node = col('Button · ' + cleanLabel, w, [content], 0, { p: [11, 12, 11, 12], fill: primary ? 'action' : variant === 'ghost' ? null : 'white', border: variant === 'neutral', radius: action && action.startsWith('category:') ? 99 : 6, height: 46, align: 'center', action });
    node.variant = variant;
    return node;
  }
  function navLink(label, width, selected, action) {
    const node = button(label, width, 'ghost', action);
    node.children[0].tone = selected ? 'action' : 'muted';
    return node;
  }
  function logo(width = 220) { return { type: 'logo', name: 'Readly', w: width, h: 44, action: 'page:home' }; }
  function stats(record, width = 120) { return { type: 'stats', name: '좋아요 ' + record.likes + ' · 댓글 ' + record.comments, w: width, h: 22, likes: record.likes, comments: record.comments }; }
  function heroArt(width = 460) { return { type: 'hero-art', name: '펼친 책과 남겨둔 문장', w: width, h: width * 300 / 460, action: 'page:record-detail' }; }

  function toggle(label, checked, w, action) {
    const labelWidth = Math.min(w - 64, Math.ceil(widthOf(label, 16)) + 4);
    return Object.assign(row('Switch · ' + label, w, [t(label, labelWidth, 16, 700), { type: 'switch', name: 'Switch Track', w: 48, h: 28, checked }], 16, { align: 'center', action }), { role: 'switch', checked });
  }
  function field(label, placeholder, w, error, disabled = false) {
    const hasArrow = placeholder.includes('▾');
    const innerText = t(placeholder.replace('▾', '').trim(), w - 28 - (hasArrow ? 24 : 0), 16, 400, 'muted');
    const content = hasArrow ? row('Select Value', w - 28, [innerText, { type: 'icon', name: 'Chevron Down', kind: 'down', w: 16, h: 16, size: 16 }], 8, { align: 'center' }) : innerText;
    const inner = col('Input · ' + label, w, [content], 0, { p: [13, 14, 13, 14], border: true, radius: 8, fill: disabled ? 'disabled' : 'white', height: 50 });
    if (error) inner.borderTone = 'danger';
    inner.disabled = disabled;
    return Object.assign(col('Field · ' + label, w, [t(label, w, 14, 600, disabled ? 'muted' : 'ink'), inner, ...(error ? [t(error, w, 13, 400, 'danger')] : [])], 8), { disabled });
  }

  function cover(book, w = 96) {
    return { type: 'cover', name: '시안 표지 · ' + book.title, w, h: w * 1.5, book: books.indexOf(book), title: book.title, author: book.author, category: book.category };
  }

  function header(active = '') {
    return row('Header', W, [
      logo(220),
      row('Navigation', 516, [navLink('독서 기록', 120, active === 'records', 'page:records'), navLink('도서', 90, active === 'books', 'page:books')], 8),
      row('Account Actions', 400, [button('로그인', 82, 'ghost', 'page:login'), button('회원가입', 94, 'ghost', 'page:signup'), button('기록 남기기', 168, 'primary', 'write')], 12),
    ], 32, { p: [18, 120, 18, 120], align: 'center', fill: 'white', height: 82 });
  }

  function footer() {
    return col('Footer', W, [row('Footer Content', CW, [logo(720), t('서비스 소개     이용약관     개인정보처리방침', 456, 14, 400, 'muted')], 24), t('읽고, 기록하고, 나누다. 책을 덮은 뒤에도 이어지는 이야기.', CW, 14, 400, 'muted')], 12, { p: [36, 120, 36, 120], fill: 'surface' });
  }

  function page(name, active, sections) {
    return col(name, W, [header(active), col('Body', W, sections, 32, { p: [48, 120, 64, 120] }), footer()], 0, { fill: 'white' });
  }
  function gridRecord(r, width = 384, mark = '') {
    const b = books[r.book], inner = width - 48;
    const spacer = space(4);
    const children = [
      ...(mark ? [t('이달의 추천', inner - 20, 12, 600, 'muted')] : []),
      t(r.title, inner - 12, 20, 700, 'ink', { maxLines: 2, h: 60 }),
      t(b.title + ' · ' + b.author, inner, 14, 400, 'muted', { maxLines: 2 }),
      t(r.excerpt, inner, 15, 400, 'muted', { maxLines: 2, h: 46 }),
      spacer, line(inner),
      row('Record Footer', inner, [t(r.user + ' · ' + r.date.slice(5), inner - 116, 13, 500, 'muted'), stats(r, 104)], 12, { align: 'center' }),
     ];
    const height = mark ? 328 : 296;
    spacer.h += Math.max(0, height - children.reduce((sum, node) => sum + node.h, 0) - (children.length - 1) * 14 - 48);
    return col('Record Card · ' + r.title, width, children, 14, { p: 24, border: true, radius: 4, fill: 'white', height, action: 'page:record-detail' });
  }

  function listRecord(r, width = 1200) {
    const b = books[r.book], textW = width - 352;
    return row('Record Row · ' + r.title, width, [
      cover(b, 80),
      col('Record Content', textW, [t(r.title, textW, 22, 700), t(b.title + ' · ' + b.author, textW, 14, 400, 'muted'), t(r.excerpt, textW, 15, 400, 'muted')], 10),
      col('Record Metadata', 176, [t(r.user + ' · ' + r.date.slice(5), 176, 13, 500, 'muted'), stats(r)], 12),
    ], 24, { p: 24, border: true, radius: 4, align: 'center', fill: 'white', action: 'page:record-detail' });
  }

  function ordered(sort = 'latest') {
    const a = records.slice();
    if (sort === 'popular') a.sort((a, b) => b.likes - a.likes);
    if (sort === 'comments') a.sort((a, b) => b.comments - a.comments);
    return a;
  }
  function sortName(sort) { return sort === 'popular' ? '인기순' : sort === 'comments' ? '댓글순' : '최신순'; }
  function toolbar(title, state, count, width = CW) {
    const controlW = 400;
    return row('Records Toolbar', width, [t(title + (count ? '  ' + count : ''), width - controlW - 24, 24, 700), row('Sort and View', controlW, [button(sortName(state.sort) + '  ▾', 176, 'neutral', 'sort'), button('리스트', 96, state.view === 'list' ? 'primary' : 'neutral', 'view:list'), button('그리드', 104, state.view === 'grid' ? 'primary' : 'neutral', 'view:grid')], 12)], 24, { align: 'center' });
  }
  function recordCollection(state, subset = ordered(state.sort), width = CW) {
    if (state.view === 'list') return col('Records · List', width, subset.map(r => listRecord(r, width)), 16);
    const cardW = (width - 48) / 3, rows = [];
    for (let i = 0; i < subset.length; i += 3) rows.push(row('Records · Grid Row', width, subset.slice(i, i + 3).map(r => gridRecord(r, cardW)), 24));
    return col('Records · Grid', width, rows, 24);
  }
  function pagination(w = CW) {
    return row('Pagination', w, [space(1), button('이전', 76, 'ghost', 'notice:첫 번째 페이지입니다'), button('1', 44, 'primary'), button('2', 44, 'neutral', 'notice:샘플 디자인입니다'), button('3', 44, 'neutral', 'notice:샘플 디자인입니다'), button('다음', 76, 'ghost', 'notice:샘플 디자인입니다')], 8, { p: [8, (w - 405) / 2, 8, (w - 405) / 2] });
  }
  function home(state) {
    const hero = row('01 · 서비스 안내', CW, [
      col('Service Introduction', 644, [t('읽고 남은 마음을 모으는 곳', 600, 14, 600, 'muted'), t('읽고 난 뒤에도,\n이야기는 계속되니까.', 600, 42, 700, 'ink', { font: 'display' }), t('좋아하는 문장부터 오래 남은 생각까지.\n나의 기록이 누군가의 다음 책이 됩니다.', 600, 18, 400, 'muted'), t('책을 고르고 · 마음을 남기고 · 서로를 읽어요', 600, 14, 400, 'muted')], 20),
      heroArt(460),
    ], 32, { p: 32, fill: 'surface', radius: 20, align: 'center' });
    const cta = row('02 · 낮은 높이 작성 배너', CW, [col('CTA Copy', 960, [t('지금 독서 기록을 남겨보세요', 940, 20, 700), t('한 줄의 감상도 좋아요. 오늘 읽은 책에서 시작해보세요.', 940, 14, 400, 'muted')], 6), button('기록 남기기', 168, 'primary', 'write')], 24, { p: [16, 24, 16, 24], border: true, radius: 4, align: 'center' });
    return page('01 · 메인 / ' + (state.view === 'list' ? '리스트' : '그리드'), '', [hero, cta, col('03 · 독서 기록 목록', CW, [toolbar('함께 읽는 독서 기록', state), recordCollection(state), button('독서 기록 전체 보기', CW, 'neutral', 'page:records')], 24)]);
  }

  function recordDirectory(state) {
    const intro = col('01 · 검색', CW, [t('독서 기록', CW, 32, 700), t('다른 독자의 생각에서, 다음에 읽을 책을 발견해보세요.', CW, 16, 400, 'muted'), row('Search', CW, [field('검색 범위', '전체  ▾', 208), field('독서 기록 검색', '책 제목, 기록 내용, 작성자를 검색하세요', 800), button('검색', 160, 'primary', 'search')], 16, { align: 'end' })], 16);
    const recs = [records[0], records[2], records[4]];
    const rec = col('02 · 이달의 추천', CW, [t('이달의 추천 독서 기록', 1152, 24, 700), t('서로 다른 시선으로 읽는 한 권의 책 · 10월 선정', 1152, 14, 400, 'muted'), row('Monthly Recommendations', 1152, recs.map((r, i) => gridRecord(r, 368, '10월의 기록  0' + (i + 1))), 24)], 16, { p: 24, fill: 'surface' });
    const chips = row('Category Filter', CW, ['전체', '소설', '에세이', '인문', '자기계발'].map((s, i) => button(s, 100, i === state.category ? 'primary' : 'neutral', 'category:' + i)), 12);
    const subset = state.category ? ordered(state.sort).filter(r => books[r.book].category === ['전체', '소설', '에세이', '인문', '자기계발'][state.category]) : ordered(state.sort);
    const results = subset.length ? recordCollection(state, subset) : empty('아직 이 분류의 독서 기록이 없어요', '첫 번째 기록을 남겨 다른 독자와 생각을 나눠보세요.', '기록 남기기', 'write');
    return page('02 · 독서 기록', 'records', [intro, rec, col('03 · 전체 기록', CW, [toolbar('전체 독서 기록', state, subset.length + '건'), chips, results, pagination()], 24)]);
  }
  function empty(title, body, label, action, w = CW) { return col('Empty State', w, [t(title, w - 64, 22, 700, 'ink', { center: true }), t(body, w - 64, 16, 400, 'muted', { center: true }), button(label, 208, 'neutral', action)], 16, { p: 32, fill: 'surface', radius: 4, align: 'center' }); }
  function comment(user, body, reply = false) {
    const w = reply ? 756 : 812;
    return col(reply ? 'Reply · 대댓글' : 'Comment · 댓글', w, [row('Comment Author', w - 32, [t(user, 180, 15, 700), t('2026.10.23 · 3시간 전', w - 212, 13, 400, 'muted')], 0), t(body, w - 32, 16), ...(reply ? [] : [button('답글 달기', 96, 'ghost', 'reply')])], 8, { p: 16, fill: reply ? 'surface' : null, border: !reply, radius: 6 });
  }
  function detail(state) {
    const article = col('독서 기록 본문', 812, [
      t('소설  /  독서 기록', 812, 14, 400, 'muted'), t(records[0].title, 812, 34, 700, 'ink', { font: 'display' }), t('서연 · 2026.10.23 · 조회 182', 812, 14, 400, 'muted'),
      row('Record Actions', 812, [button('좋아요 24', 132, 'neutral', 'like'), button('공유', 100, 'neutral', 'notice:공유 · URL 복사 / 카카오톡 / X'), button('더보기 ···', 132, 'ghost', 'notice:내 기록일 때 수정·삭제 메뉴 표시')], 12), line(812),
      t('책을 덮고도 쉽게 떠나지 않는 장면이 있습니다.\n독서가 끝났다고 생각한 순간부터, 오히려 질문은 시작되었습니다.', 812, 18),
      col('기억에 남은 문장 · 예시', 812, [t('기억은 과거를 보관하는 일에 그치지 않고,\n오늘을 살아가는 태도가 될 수도 있겠다고 생각했다.', 748, 22, 700, 'ink', { font: 'display' }), t('서연의 생각 · 소년이 온다를 읽고', 748, 13, 400, 'muted')], 16, { p: 32, fill: 'surface' }),
      t('이번 독서에서 가장 오래 남은 것은 한 사람의 목소리를 듣는 마음이었습니다. 어떤 이야기는 빠르게 이해하기보다 충분히 곁에 머물러야 한다는 생각이 들었습니다.\n\n다시 읽게 된다면 같은 장면에서 또 다른 질문을 만나게 될 것 같습니다. 여러분에게는 어떤 장면이 오래 남았나요?', 812, 18),
      t('기록한 쪽수  32–68p     #소설  #기억  #함께읽기', 812, 14, 400, 'muted'), line(812),
      t('댓글 8', 812, 24, 700),
      col('Comment Composer', 812, [field('댓글 남기기', state.reply ? '책갈피 님에게 답글을 남겨보세요.' : '기록에 대한 생각을 나눠보세요.', 812), row('Comment Submit', 812, [t('댓글 작성은 로그인 후 가능합니다.', 640, 14, 400, 'muted'), button('로그인', 156, 'primary', 'page:login')], 16, { align: 'center' })], 12),
      comment('책갈피', '같은 책을 읽었는데도 다른 장면에 눈이 머물렀네요. 덕분에 다시 펼쳐보고 싶어졌어요.'),
      row('Indented Reply', 812, [t('↳', 32, 24, 400, 'muted'), comment('서연 · 작성자', '함께 나눌 수 있어서 좋네요. 다음에 읽으면 또 다른 장면이 남을 것 같아요.', true)], 24),
      ...(state.reply ? [col('답글 입력 상태', 812, [field('책갈피 님에게 답글', '답글을 입력하세요.', 812), button('로그인 후 답글 등록', 208, 'primary', 'page:login')], 12, { p: [0, 0, 0, 0] })] : []),
      comment('온유', '기억한다는 일에 대해 천천히 생각하게 되는 기록이네요. 잘 읽었습니다.'), button('댓글 더 보기', 812, 'neutral', 'notice:나머지 댓글을 불러오는 자리입니다'),
    ], 24);
    const side = col('연결 도서', 324, [cover(books[0], 180, 244), t('소년이 온다', 276, 23, 700), t('한강 지음 · 소설', 276, 15, 400, 'muted'), t('이 책의 독서 기록 48건', 276, 16, 700), button('도서와 다른 기록 보기', 276, 'neutral', 'page:book-detail'), button('이 책으로 기록 남기기', 276, 'primary', 'write')], 16, { p: 24, fill: 'surface', align: 'center' });
    return page('03 · 독서 기록 상세', 'records', [t('독서 기록  /  소년이 온다', CW, 14, 400, 'muted', { action: 'page:records' }), row('Article and Book Sidebar', CW, [article, side], 64), button('독서 기록 목록으로', 200, 'neutral', 'page:records')]);
  }
  function bookTile(b) {
    return col('Book · ' + b.title, 282, [cover(b, 140, 186), t(b.title, 242, 20, 700), t(b.author + ' · ' + b.category, 242, 14, 400, 'muted'), t('독서 기록 ' + b.count + '건', 242, 16, 700), ...(b.count === 0 ? [t('첫 기록을 기다리고 있어요', 242, 13, 400, 'muted')] : [])], 12, { p: 20, border: true, radius: 4, height: 376, align: 'center', action: 'page:book-detail' });
  }
  function bookDirectory(state) {
    const shown = (state.onlyRecorded ? books.filter(b => b.count > 0) : books.slice()).sort((a, b) => b.count - a.count);
    const rows = [];
    for (let i = 0; i < shown.length; i += 4) rows.push(row('Book Grid Row', CW, shown.slice(i, i + 4).map(bookTile), 24));
    return page('04 · 도서 목록' + (state.onlyRecorded ? ' / 기록 있는 도서' : ''), 'books', [
      col('01 · 도서 검색', CW, [t('도서', CW, 32, 700), t('한 권의 책에 쌓인 다양한 독서 기록을 만나보세요.', CW, 16, 400, 'muted'), row('Book Search', CW, [field('도서 검색', '책 제목이나 저자를 입력하세요.', 1024), button('검색', 160, 'primary', 'search')], 16, { align: 'end' })], 16),
      row('02 · 필터 및 정렬', CW, [toggle('기록이 달린 도서만 보기', state.onlyRecorded, 400, 'filter'), t(shown.length + '권', 568, 18, 700), button('기록 많은순  ▾', 200, 'neutral', 'notice:기록 많은순 / 최근 기록순 / 제목순')], 16, { align: 'center' }),
      col('03 · 도서 목록', CW, rows, 24), pagination(),
    ]);
  }
  function bookDetail(state) {
    const b = books[0];
    const related = [records[0], { ...records[3], title: '조용히 읽고 오래 생각하게 된 책', book: 0 }, { ...records[4], title: '다시 읽으며 발견한 장면들', book: 0 }];
    if (state.sort === 'popular') related.sort((a, b) => b.likes - a.likes);
    if (state.sort === 'comments') related.sort((a, b) => b.comments - a.comments);
    return page('05 · 도서 상세', 'books', [
      t('도서  /  소년이 온다', CW, 14, 400, 'muted', { action: 'page:books' }),
      row('01 · 도서 정보', CW, [cover(b, 180, 248), col('Book Information', 908, [t('소설', 908, 14, 400, 'muted'), t('소년이 온다', 908, 36, 700), t('한강 지음', 908, 18), t('함께 읽는 책 · 한강의 소설', 908, 14, 400, 'muted'), t('한 권의 책을 읽고 남긴 서로 다른 생각들. 같은 장면에서 무엇을 느꼈는지, 독자들의 기록으로 만나보세요.', 860, 17, 400, 'muted'), row('Book Actions', 908, [button('이 책으로 기록 남기기', 220, 'primary', 'write'), button('도서 원문 정보', 160, 'neutral', 'notice:기존 bookLink 외부 도서 정보 연결')], 16)], 16)], 48, { p: 32, fill: 'surface', radius: 4, align: 'center' }),
      col('02 · 달린 독서 기록', CW, [toolbar('이 책의 독서 기록', state, '48건'), t('같은 책에서 발견한, 서로 다른 이야기', CW, 14, 400, 'muted'), recordCollection(state, related), pagination()], 24),
      button('도서 목록으로', CW, 'neutral', 'page:books'),
    ]);
  }
  function login(state) {
    const form = col('로그인 폼', 432, [t('다시 만나 반가워요', 432, 32, 700), t('독서 기록을 이어가려면 로그인해 주세요.', 432, 16, 400, 'muted'), space(8), field('아이디', '아이디를 입력하세요.', 432, state.error ? '아이디와 비밀번호를 확인해 주세요.' : null), field('비밀번호', '비밀번호를 입력하세요.', 432), button('로그인', 432, 'primary', 'login'), t('또는', 432, 14, 400, 'muted', { center: true }), button('Google로 계속하기', 432, 'neutral', 'notice:Google OAuth 로그인으로 연결'), t('아직 계정이 없으신가요?', 432, 14, 400, 'muted', { center: true }), button('회원가입', 432, 'ghost', 'page:signup')], 20, { align: 'center' });
    return page('06 · 로그인', '', [row('Auth Layout', CW, [col('Auth Story', 560, [t('책을 덮은 뒤에,\n우리의 이야기가 시작돼요.', 480, 34, 700, 'ink', { font: 'display' }), heroArt(480), t('읽은 마음을 오래 간직하는 나만의 기록.', 480, 16, 400, 'muted')], 24), form], 128, { p: [32, 40, 64, 40], align: 'center' })]);
  }
  function signup(state) {
    const form = col('회원가입 폼', 432, [t('나의 독서 기록 시작하기', 432, 30, 700), t('책을 읽은 마음을 오래 간직해 보세요.', 432, 16, 400, 'muted'), field('아이디', '영문·숫자 6자 이상', 432, state.error ? '이미 사용 중인 아이디입니다.' : null), t('입력 후 사용 가능한 아이디인지 자동으로 확인합니다.', 432, 13, 400, 'muted'), field('비밀번호', '8자 이상 입력하세요.', 432), field('비밀번호 확인', '비밀번호를 다시 입력하세요.', 432, state.error ? '비밀번호가 일치하지 않습니다.' : null), field('닉네임', '2–8자로 입력하세요.', 432), row('Required Agreements', 432, [t(state.agreed ? '☑' : '☐', 28, 20), t('이용약관 및 개인정보 수집·이용에 동의합니다. (필수)', 388, 13, 400, 'muted')], 12, { height: 44, align: 'center', action: 'agree' }), button('회원가입', 432, 'primary', 'signup'), row('Already Registered', 432, [t('이미 계정이 있으신가요?', 274, 14, 400, 'muted'), button('로그인', 146, 'ghost', 'page:login')], 12, { align: 'center' })], 18);
    return page('07 · 회원가입', '', [row('Auth Layout', CW, [col('Auth Story', 560, [t('다 읽은 책도,\n다시 시작되는 이야기.', 480, 34, 700, 'ink', { font: 'display' }), heroArt(480), t('한 줄의 기록으로 나의 독서를 이어가세요.', 480, 16, 400, 'muted')], 24), form], 128, { p: [24, 40, 48, 40], align: 'center' })]);
  }

  function writeRecord(state) {
    const b = books[state.selectedBook || 0], width = 812;
    const bookSearch = row('Book Search', width, [field('책 제목 또는 저자', state.bookSearch ? '책 제목이나 저자를 입력하세요.' : '기록할 책을 검색하세요.', 636), button('도서 검색', 160, 'neutral', 'book-search')], 16, { align: 'end' });
    const selected = row('Selected Book', width, [cover(b, 74, 102), col('Selected Book Information', 490, [t(b.title, 490, 23, 700), t(b.author + ' · ' + b.category, 490, 15, 400, 'muted'), t('이 책에 독서 기록을 연결합니다.', 490, 14, 400, 'muted')], 8), button('책 변경', 160, 'neutral', 'book-search')], 24, { p: 20, border: true, radius: 8, align: 'center' });
    const results = state.bookSearch ? [col('Book Search Results', width, [t('기록할 책을 선택하세요.', width - 32, 14, 700), ...books.slice(0, 3).map((book, index) => row('Book Result · ' + book.title, width - 32, [cover(book, 60, 92), col('Book Result Information', 544, [t(book.title, 544, 18, 700), t(book.author + ' · ' + book.category, 544, 14, 400, 'muted')], 8), button('선택', 112, 'neutral', 'select-book:' + index)], 16, { align: 'center' }))], 16, { p: 16, border: true, radius: 8 })] : [];
    const bookSection = col('01 · 읽은 책 선택', width, [t('읽은 책 *', width, 22, 700), t('책을 먼저 선택하면 해당 도서의 기록 목록에도 함께 표시됩니다.', width, 15, 400, 'muted'), ...(state.bookSelected ? [selected] : [bookSearch, ...results]), ...(state.error && !state.bookSelected ? [t('기록할 책을 선택해 주세요.', width, 14, 700, 'danger')] : [])], 16);
    const categorySection = col('02 · 카테고리', width, [field('카테고리 *', state.bookSelected ? b.category + '  ▾' : '카테고리를 선택하세요.  ▾', width, state.error && !state.bookSelected ? '카테고리를 선택해 주세요.' : null)], 0);
    const toolbar = row('Editor Toolbar', width, [button('본문  ▾', 120, 'neutral', 'notice:본문 / 제목 서식 선택'), ...['굵게', '기울임', '인용', '목록', '링크'].map(label => button(label, 90, 'ghost', 'notice:' + label + ' 편집 도구 위치 예시'))], 8, { p: 12, fill: 'surface', align: 'center' });
    const editor = col('Record Body Editor', width, [toolbar, col('Record Body Input', width, [t('기억에 남은 문장이나 느낌을 자유롭게 적어보세요.', width - 48, 18, 400, 'muted'), t('한 줄의 소감, 인상 깊었던 장면, 나만의 해석도 좋아요.\n\n다른 독자와 나누고 싶은 생각을 천천히 적어보세요.', width - 48, 16, 400, 'muted')], 20, { p: 24, height: 300 }), row('Editor Status', width, [t('0자', 360, 13, 400, 'muted'), t('서식 있는 본문 작성', 412, 13, 400, 'muted')], 16, { p: [12, 12, 12, 12], fill: 'surface' })], 0, { border: true, radius: 8 });
    const contentSection = col('03 · 독서 기록 본문', width, [t('독서 기록 *', width, 22, 700), editor, ...(state.error ? [t('독서 기록 내용을 입력해 주세요.', width, 14, 700, 'danger')] : [])], 16);
    const pageSection = col('04 · 쪽수 기록 / 선택', width, [row('Page Range Toggle', width, [t('쪽수 기록', 612, 22, 700), toggle('책 전체', state.wholeBook, 184, 'write-whole-book')], 16, { align: 'center' }), row('Page Range Fields', width, [field('시작 쪽수', '예: 32', 240, null, state.wholeBook), t('—', 32, 20, 400, 'muted', { center: true }), field('마지막 쪽수', '예: 68', 240, null, state.wholeBook)], 16, { align: 'end' }), t(state.wholeBook ? '책 전체에 대한 기록입니다. 쪽수 입력은 비활성화됩니다.' : '책 전체에 대한 기록이라면 ‘책 전체’를 켜주세요.', width, 14, 400, 'muted')], 16);
    const form = col('Writing Form', width, [bookSection, categorySection, contentSection, pageSection, line(width), row('Publish Actions', width, [t('등록한 기록은 다른 독자와 함께 읽을 수 있어요.', 436, 14, 400, 'muted'), button('취소', 128, 'neutral', 'page:records'), button('기록 등록하기', 216, 'primary', 'write-publish')], 16, { align: 'center' })], 32);
    const aside = col('Writing Guide', 324, [t('한 줄부터\n시작해도 좋아요', 276, 24, 700), t('완벽한 서평을 쓰지 않아도 괜찮아요.\n읽으며 떠오른 생각을\n내 말로 남겨보세요.', 276, 16, 400, 'muted'), line(276), t('이렇게 적어보세요', 276, 18, 700), t('오래 기억하고 싶은 장면\n\n내 일상과 연결된 생각\n\n함께 나누고 싶은 질문', 276, 15, 400, 'muted'), line(276), t('등록하기 전에', 276, 18, 700), t('읽은 책과 카테고리를 확인해 주세요.\n본문은 꼭 입력해 주세요.\n쪽수는 선택사항입니다.', 276, 15, 400, 'muted')], 20, { p: 24, fill: 'surface', radius: 8 });
    return page('08 · 기록 남기기', 'records', [t('독서 기록  /  기록 남기기', CW, 14, 400, 'muted', { action: 'page:records' }), col('Writing Introduction', CW, [t('책을 읽은 마음을 남겨보세요', CW, 32, 700), t('좋아하는 문장부터 오늘의 생각까지, 나만의 독서 기록을 작성해 보세요.', CW, 16, 400, 'muted')], 12), row('Writing Form and Guide', CW, [form, aside], 64)]);
  }

  function mobileView(key, state) {
    const mw = state.mobileWidth || 390, cw = mw - 32;
    function heading(title, description) { return col('Mobile Page Introduction', cw, [t(title, cw, 28, 700), ...(description ? [t(description, cw, 16, 400, 'muted')] : [])], 12); }
    function mobileSwitch(label, checked, action, width = cw) {
      const n = toggle(label, checked, width, action);
      n.h = 44;
      for (const c of n.children) c.y = (44 - c.h) / 2;
      return n;
    }
    function mobileHeader() {
      return col('Mobile Header', mw, [row('Brand and Account', cw, [logo(cw - 188), button('기록 쓰기', 96, 'primary', 'write'), button('로그인', 68, 'ghost', 'page:login')], 12, { align: 'center' }), row('Primary Navigation', cw, [navLink('독서 기록', (cw - 12) / 2, ['records', 'record-detail', 'write'].includes(key), 'page:records'), navLink('도서', (cw - 12) / 2, ['books', 'book-detail'].includes(key), 'page:books')], 12)], 8, { p: [12, 16, 12, 16], fill: 'white' });
    }

    function mobilePage(name, sections) {
      return col(name + ' / 모바일', mw, [mobileHeader(), col('Mobile Body', mw, sections, 24, { p: [24, 16, 40, 16] }), col('Mobile Footer', mw, [logo(cw), t('읽고, 기록하고, 나누다', cw, 14, 400, 'muted'), t('서비스 소개 · 이용약관\n개인정보처리방침', cw, 13, 400, 'muted')], 12, { p: [24, 16, 24, 16], fill: 'surface' })], 0, { fill: 'white' });
    }
    function mobileToolbar(title, count = '') {
      const sortW = Math.round(cw * .4), viewW = (cw - sortW - 16) / 2;
      return col('Mobile Records Toolbar', cw, [t(title + (count ? '  ' + count : ''), cw, 22, 700), row('Sort and View', cw, [button(sortName(state.sort) + '  ▾', sortW, 'neutral', 'sort'), button('리스트', viewW, state.view === 'list' ? 'primary' : 'neutral', 'view:list'), button('그리드', viewW, state.view === 'grid' ? 'primary' : 'neutral', 'view:grid')], 8)], 16);
    }
    function mobileRecord(r, view = state.view, width = cw) {
      if (view === 'grid') return gridRecord(r, width);
      const b = books[r.book], tw = width - 116;
      return col('Mobile Record Row · ' + r.title, width, [row('Book and Record', width - 32, [cover(b, 72), col('Record Content', tw, [t(r.title, tw, 18, 700, 'ink', { maxLines: 2 }), t(b.title + ' · ' + b.author, tw, 14, 400, 'muted', { maxLines: 2 })], 10)], 12), t(r.excerpt, width - 32, 15, 400, 'muted', { maxLines: 2 }), row('Record Footer', width - 32, [t(r.user + ' · ' + r.date.slice(5), width - 148, 13, 500, 'muted'), stats(r, 104)], 12, { align: 'center' })], 16, { p: 16, border: true, radius: 4, fill: 'white', action: 'page:record-detail' });
    }

    function mobileRecords(list) { return col('Mobile Records · ' + state.view, cw, list.map(r => mobileRecord(r)), 16); }
    function mobilePagination() { return row('Mobile Pagination', cw, [button('이전', (cw - 164) / 2, 'ghost', 'notice:첫 번째 페이지입니다'), button('1', 44, 'primary'), button('2', 44, 'neutral', 'notice:샘플 디자인입니다'), button('3', 44, 'neutral', 'notice:샘플 디자인입니다'), button('다음', (cw - 164) / 2, 'ghost', 'notice:샘플 디자인입니다')], 8); }
    function mobileSearch(bookSearch = false) { return col('Mobile Search', cw, [...(bookSearch ? [] : [field('검색 범위', '전체  ▾', cw)]), field(bookSearch ? '도서 검색' : '독서 기록 검색', bookSearch ? '책 제목이나 저자를 입력하세요.' : '책 제목, 내용, 작성자', cw), button('검색', cw, 'primary', 'search')], 12); }
    function mobileComment(user, body, reply = false, width = cw) {
      return col(reply ? 'Mobile Reply · 대댓글' : 'Mobile Comment · 댓글', width, [t(user, width - 32, 15, 700), t('2026.10.23 · 3시간 전', width - 32, 12, 400, 'muted'), t(body, width - 32, 16), ...(reply ? [] : [button('답글 달기', 104, 'ghost', 'reply')])], 8, { p: 16, fill: reply ? 'surface' : 'white', border: !reply, radius: 6 });
    }
    function compactBook(b, withActions = false) {
      const tw = cw - 128;
      return col('Mobile Connected Book', cw, [row('Book Information', cw - 32, [cover(b, 80, 120), col('Book Metadata', tw, [t(b.title, tw, 20, 700), t(b.author + ' · ' + b.category, tw, 14, 400, 'muted'), t('독서 기록 ' + b.count + '건', tw, 14, 700)], 8)], 16), ...(withActions ? [button('이 책의 다른 기록 보기', cw - 32, 'neutral', 'page:book-detail'), button('이 책으로 기록 남기기', cw - 32, 'primary', 'write')] : [])], 16, { p: 16, fill: 'surface', radius: 8 });
    }

    if (key === 'home') return mobilePage('01 · 메인 / ' + (state.view === 'list' ? '리스트' : '그리드'), [col('01 · 서비스 안내', cw, [t('읽고 남은 마음을 모으는 곳', cw - 32, 13, 600, 'muted'), t('읽고 난 뒤에도,\n이야기는 계속되니까.', cw - 32, 28, 700, 'ink', { font: 'display' }), t('좋아하는 문장부터 오래 남은 생각까지.\n나의 기록이 누군가의 다음 책이 됩니다.', cw - 32, 15, 400, 'muted'), heroArt(cw - 32)], 16, { p: 16, fill: 'surface', radius: 20 }), col('02 · 낮은 작성 배너', cw, [t('지금 독서 기록을 남겨보세요', cw - 32, 18, 700), button('기록 남기기', cw - 32, 'primary', 'write')], 12, { p: 16, border: true, radius: 4 }), mobileToolbar('함께 읽는 독서 기록'), mobileRecords(ordered(state.sort)), button('독서 기록 전체 보기', cw, 'neutral', 'page:records')]);

    if (key === 'records') {
      const recommended = [records[0], records[2], records[4]], index = state.recommendation || 0, inner = cw - 32;
      const rec = col('02 · 이달의 추천', cw, [t('이달의 추천 독서 기록', inner, 22, 700), t('10월의 기록 · 한 번에 한 편씩', inner, 14, 400, 'muted'), gridRecord(recommended[index], inner, '10월의 기록  0' + (index + 1)), row('Recommendation Controls', inner, [button('이전', 76, 'neutral', 'recommendation:' + (index + 2) % 3), t((index + 1) + ' / 3', inner - 168, 14, 400, 'muted', { center: true }), button('다음', 76, 'neutral', 'recommendation:' + (index + 1) % 3)], 8, { align: 'center' })], 16, { p: 16, fill: 'surface' });
      const labels = ['전체', '소설', '에세이', '인문', '자기계발'], chipW = (cw - 16) / 3;
      const chips = col('Category Filter', cw, [row('Category Row 1', cw, labels.slice(0, 3).map((label, i) => button(label, chipW, state.category === i ? 'primary' : 'neutral', 'category:' + i)), 8), row('Category Row 2', cw, labels.slice(3).map((label, i) => button(label, chipW, state.category === i + 3 ? 'primary' : 'neutral', 'category:' + (i + 3))), 8)], 8);
      const list = ordered(state.sort).filter(r => !state.category || books[r.book].category === labels[state.category]);
      const results = list.length ? mobileRecords(list) : col('Mobile Empty State', cw, [t('아직 이 분류의 기록이 없어요', cw - 32, 20, 700), t('첫 번째 독서 기록을 남겨보세요.', cw - 32, 16, 400, 'muted'), button('기록 남기기', cw - 32, 'neutral', 'write')], 16, { p: 16, fill: 'surface' });
      return mobilePage('02 · 독서 기록', [heading('독서 기록', '다른 독자의 생각에서 다음 책을 발견해 보세요.'), mobileSearch(), rec, mobileToolbar('전체 독서 기록', list.length + '건'), chips, results, mobilePagination()]);
    }

    if (key === 'record-detail') return mobilePage('03 · 독서 기록 상세', [t('독서 기록 / 소년이 온다', cw, 13, 400, 'muted', { action: 'page:records' }), compactBook(books[0], true), col('Mobile Article Title', cw, [t('기억한다는 건,\n끝내 곁에 머무는 일', cw, 28, 700, 'ink', { font: 'display' })], 0), t('서연 · 2026.10.23 · 조회 182', cw, 13, 400, 'muted'), row('Mobile Record Actions', cw, [button('좋아요 24', (cw - 16) / 3, 'neutral', 'like'), button('공유', (cw - 16) / 3, 'neutral', 'notice:URL 복사 / 카카오톡 / X'), button('더보기', (cw - 16) / 3, 'ghost', 'notice:내 기록일 때 수정·삭제 메뉴 표시')], 8), line(cw), t('책을 덮고도 쉽게 떠나지 않는 장면이 있습니다. 독서가 끝났다고 생각한 순간부터, 오히려 질문은 시작되었습니다.', cw, 17), col('기억에 남은 생각', cw, [t('기억은 과거를 보관하는 일에 그치지 않고, 오늘을 살아가는 태도가 될 수도 있겠다고 생각했다.', cw - 32, 20, 700, 'ink', { font: 'display' }), t('서연의 생각 · 소년이 온다를 읽고', cw - 32, 12, 400, 'muted')], 16, { p: 16, fill: 'surface' }), t('이번 독서에서 가장 오래 남은 것은 한 사람의 목소리를 듣는 마음이었습니다. 어떤 이야기는 빠르게 이해하기보다 충분히 곁에 머물러야 한다는 생각이 들었습니다.\n\n다시 읽게 된다면 같은 장면에서 또 다른 질문을 만나게 될 것 같습니다. 여러분에게는 어떤 장면이 오래 남았나요?', cw, 17), t('기록한 쪽수 32–68p\n#소설  #기억  #함께읽기', cw, 14, 400, 'muted'), line(cw), t('댓글 8', cw, 24, 700), field('댓글 남기기', '기록에 대한 생각을 나눠보세요.', cw), t('댓글 작성은 로그인 후 가능합니다.', cw, 14, 400, 'muted'), button('로그인 후 댓글 남기기', cw, 'primary', 'page:login'), mobileComment('책갈피', '같은 책을 읽었는데도 다른 장면에 눈이 머물렀네요. 다시 펼쳐보고 싶어졌어요.'), row('Mobile Indented Reply', cw, [t('↳', 20, 20, 400, 'muted'), mobileComment('서연 · 작성자', '다음에 읽으면 또 다른 장면이 남을 것 같아요.', true, cw - 28)], 8), ...(state.reply ? [col('Mobile Reply Composer', cw, [field('책갈피 님에게 답글', '답글을 입력하세요.', cw), button('로그인 후 답글 등록', cw, 'primary', 'page:login')], 12)] : []), mobileComment('온유', '기억한다는 일에 대해 천천히 생각하게 되는 기록이네요.'), button('댓글 더 보기', cw, 'neutral', 'notice:나머지 댓글을 불러오는 자리입니다'), button('독서 기록 목록으로', 200, 'neutral', 'page:records')]);

    if (key === 'books') {
      const list = (state.onlyRecorded ? books.filter(b => b.count > 0) : books.slice()).sort((a, b) => b.count - a.count), textW = cw - 136;
      const items = col('Mobile Book List', cw, list.map(b => row('Mobile Book · ' + b.title, cw, [cover(b, 88, 132), col('Book Metadata', textW, [t(b.title, textW, 18, 700, 'ink', { maxLines: 2 }), t(b.author, textW, 14, 400, 'muted', { maxLines: 2 }), t('기록 ' + b.count + '건', textW, 14, 700)], 10)], 16, { p: 16, border: true, radius: 8, align: 'center', action: 'page:book-detail' })), 16);
      return mobilePage('04 · 도서 목록', [heading('도서', '한 권의 책에 쌓인 다양한 기록을 만나보세요.'), mobileSearch(true), mobileSwitch('기록이 달린 도서만 보기', state.onlyRecorded, 'filter'), row('Book Count and Sort', cw, [t(list.length + '권', cw - 180, 18, 700), button('기록 많은순  ▾', 164, 'neutral', 'notice:기록 많은순 / 최근 기록순 / 제목순')], 16, { align: 'center' }), items, mobilePagination()]);
    }

    if (key === 'book-detail') {
      const related = [records[0], { ...records[3], title: '조용히 읽고 오래 생각하게 된 책', book: 0 }, { ...records[4], title: '다시 읽으며 발견한 장면들', book: 0 }];
      if (state.sort === 'popular') related.sort((a, b) => b.likes - a.likes); if (state.sort === 'comments') related.sort((a, b) => b.comments - a.comments);
      return mobilePage('05 · 도서 상세', [t('도서 / 소년이 온다', cw, 13, 400, 'muted', { action: 'page:books' }), compactBook(books[0]), t('함께 읽는 책 · 한강의 소설', cw, 14, 400, 'muted'), t('한 권의 책을 읽고 남긴 서로 다른 생각들. 같은 장면을 읽은 독자들의 마음을 만나보세요.', cw, 16, 400, 'muted'), button('이 책으로 기록 남기기', cw, 'primary', 'write'), button('도서 원문 정보', cw, 'neutral', 'notice:외부 도서 정보로 연결'), line(cw), mobileToolbar('이 책의 독서 기록', '48건'), mobileRecords(related), mobilePagination(), button('도서 목록으로', 184, 'neutral', 'page:books')]);
    }

    if (key === 'login') return mobilePage('06 · 로그인', [heading('다시 만나 반가워요', '독서 기록을 이어가려면 로그인해 주세요.'), field('아이디', '아이디를 입력하세요.', cw, state.error ? '아이디와 비밀번호를 확인해 주세요.' : null), field('비밀번호', '비밀번호를 입력하세요.', cw), button('로그인', cw, 'primary', 'login'), t('또는', cw, 14, 400, 'muted', { center: true }), button('Google로 계속하기', cw, 'neutral', 'notice:Google OAuth 로그인으로 연결'), t('아직 계정이 없으신가요?', cw, 14, 400, 'muted', { center: true }), button('회원가입', cw, 'ghost', 'page:signup')]);

    if (key === 'signup') return mobilePage('07 · 회원가입', [heading('나의 독서 기록 시작하기', '책을 읽은 마음을 오래 간직해 보세요.'), field('아이디', '영문·숫자 6자 이상', cw, state.error ? '이미 사용 중인 아이디입니다.' : null), t('입력 후 아이디 사용 가능 여부를 확인합니다.', cw, 13, 400, 'muted'), field('비밀번호', '8자 이상 입력하세요.', cw), field('비밀번호 확인', '비밀번호를 다시 입력하세요.', cw, state.error ? '비밀번호가 일치하지 않습니다.' : null), field('닉네임', '2–8자로 입력하세요.', cw), row('Mobile Required Agreements', cw, [t(state.agreed ? '☑' : '☐', 28, 20), t('이용약관 및 개인정보 수집·이용에\n동의합니다. (필수)', cw - 40, 13, 400, 'muted')], 12, { height: 44, align: 'center', action: 'agree' }), button('회원가입', cw, 'primary', 'signup'), t('이미 계정이 있으신가요?', cw, 14, 400, 'muted', { center: true }), button('로그인', cw, 'ghost', 'page:login')]);

    const b = books[state.selectedBook || 0];
    const book = col('Mobile Selected Book', cw, [row('Selected Book Information', cw - 32, [cover(b, 80, 120), col('Selected Book Metadata', cw - 128, [t(b.title, cw - 128, 20, 700), t(b.author + ' · ' + b.category, cw - 128, 14, 400, 'muted')], 8)], 16), button('책 변경', cw - 32, 'neutral', 'book-search')], 16, { p: 16, border: true, radius: 8 });
    const searchResults = state.bookSearch ? [col('Mobile Book Search Results', cw, [t('기록할 책을 선택하세요.', cw - 32, 14, 700), ...books.slice(0, 3).map((b, i) => col('Mobile Book Result · ' + b.title, cw - 32, [row('Result Information', cw - 32, [cover(b, 72, 108), col('Result Metadata', cw - 116, [t(b.title, cw - 116, 18, 700), t(b.author, cw - 116, 14, 400, 'muted')], 8)], 12), button('이 책 선택', cw - 32, 'neutral', 'select-book:' + i)], 12))], 16, { p: 16, border: true, radius: 8 })] : [];
    const bookSection = col('01 · 읽은 책', cw, [t('읽은 책 *', cw, 22, 700), ...(state.bookSelected ? [book] : [field('책 제목 또는 저자', '기록할 책을 검색하세요.', cw), button('도서 검색', cw, 'neutral', 'book-search'), ...searchResults]), ...(state.error && !state.bookSelected ? [t('기록할 책을 선택해 주세요.', cw, 14, 700, 'danger')] : [])], 16);
    const toolW = (cw - 40) / 3;
    const editor = col('Mobile Editor', cw, [col('Mobile Editor Toolbar', cw, [row('Formatting Row 1', cw - 24, [button('본문  ▾', toolW, 'neutral', 'notice:본문 / 제목 서식 선택'), button('굵게', toolW, 'ghost', 'notice:굵게 도구'), button('기울임', toolW, 'ghost', 'notice:기울임 도구')], 8), row('Formatting Row 2', cw - 24, ['인용', '목록', '링크'].map(label => button(label, toolW, 'ghost', 'notice:' + label + ' 도구')), 8)], 8, { p: 12, fill: 'surface' }), col('Mobile Editor Input', cw, [t('기억에 남은 문장이나 느낌을 자유롭게 적어보세요.', cw - 32, 16, 400, 'muted'), t('한 줄의 소감, 인상 깊었던 장면, 나만의 해석도 좋아요.', cw - 32, 15, 400, 'muted')], 16, { p: 16, height: 260 }), col('Mobile Editor Status', cw, [t('0자', cw - 24, 13, 400, 'muted')], 0, { p: 12, fill: 'surface' })], 0, { border: true, radius: 8 });
    const range = col('Mobile Page Range', cw, [row('Page Range Heading', cw, [t('쪽수 기록', cw - 162, 22, 700), mobileSwitch('책 전체', state.wholeBook, 'write-whole-book', 150)], 12, { align: 'center' }), row('Page Range Fields', cw, [field('시작 쪽수', '예: 32', (cw - 32) / 2, null, state.wholeBook), t('—', 16, 16, 400, 'muted', { center: true }), field('마지막 쪽수', '예: 68', (cw - 32) / 2, null, state.wholeBook)], 8, { align: 'end' }), t(state.wholeBook ? '책 전체 기록으로 쪽수 입력이 비활성화됩니다.' : '책 전체에 대한 기록이라면 ‘책 전체’를 켜주세요.', cw, 14, 400, 'muted')], 16);
    return mobilePage('08 · 기록 남기기', [heading('책을 읽은 마음을\n남겨보세요', '좋아하는 문장과 오늘의 생각을 남겨보세요.'), bookSection, field('카테고리 *', state.bookSelected ? b.category + '  ▾' : '카테고리를 선택하세요.  ▾', cw, state.error && !state.bookSelected ? '카테고리를 선택해 주세요.' : null), col('03 · 독서 기록', cw, [t('독서 기록 *', cw, 22, 700), editor, ...(state.error ? [t('독서 기록 내용을 입력해 주세요.', cw, 14, 700, 'danger')] : [])], 16), range, col('Mobile Writing Guide', cw, [t('한 줄부터 시작해도 좋아요', cw - 32, 20, 700), t('오래 기억하고 싶은 장면, 일상과 연결된 생각, 함께 나누고 싶은 질문을 적어보세요.', cw - 32, 15, 400, 'muted')], 12, { p: 16, fill: 'surface' }), t('등록한 기록은 다른 독자와 함께 읽을 수 있어요.', cw, 14, 400, 'muted'), row('Mobile Publish Actions', cw, [button('취소', 96, 'neutral', 'page:records'), button('기록 등록하기', cw - 108, 'primary', 'write-publish')], 12)]);
  }

  const pages = [ ['home', '메인'], ['records', '독서 기록'], ['record-detail', '독서 기록 상세'], ['books', '도서 목록'], ['book-detail', '도서 상세'], ['login', '로그인'], ['signup', '회원가입'], ['write', '기록 남기기'] ];
  function build(key, state = {}) {
    const defaults = { view: key === 'home' ? 'grid' : 'list', sort: 'latest', category: 0, onlyRecorded: false, reply: false, error: false, agreed: false, bookSelected: true, bookSearch: false, selectedBook: 0, wholeBook: false, ...state };
    if (defaults.device === 'mobile') return mobileView(key, defaults);
    const builders = { home, records: recordDirectory, 'record-detail': detail, books: bookDirectory, 'book-detail': bookDetail, login, signup, write: writeRecord };
    return builders[key](defaults);
  }
  function esc(v) { return String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
  function svg(scene) {
    function inkText(text, x, y, size, fill = color.ink, weight = 400, font = fonts.body) {
      return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}">${esc(text)}</text>`.replace('<text ', `<text fill="${fill}" `);
    }
    function drawCover(n) {
      const index = n.book < 0 ? 0 : n.book, palette = coverPalette[index % coverPalette.length];
      const shapes = [
        `<circle cx="85" cy="111" r="17" fill="${palette.art}"/><path d="M20 145c20-31 37-15 58-35-2 22-22 46-58 35Z" fill="${palette.ink}" opacity=".75"/><path d="M37 149c8-28 22-41 30-55" fill="none" stroke="${palette.ink}" stroke-width="1.5"/>`,
        `<path d="M60 88c35 22 32 44 0 63-30-20-32-45 0-63Z" fill="${palette.art}"/><path d="M60 95c-12 16-13 30 0 48" fill="none" stroke="${palette.bg}" stroke-width="2"/>`,
        `<rect x="20" y="103" width="80" height="39" rx="2" fill="${palette.art}"/><path d="M17 103h86l-10-13H27Z" fill="${palette.ink}"/><path d="M35 109h19v26H35m29-26h22v15H64" fill="${palette.bg}"/><path d="M17 143h87" stroke="${palette.ink}"/>`,
        `<circle cx="82" cy="105" r="18" fill="${palette.art}"/><path d="M22 149v-26a32 32 0 0 1 64 0v26" fill="none" stroke="${palette.art}" stroke-width="3"/><path d="M43 149v-27a10 10 0 0 1 20 0v27" fill="${palette.ink}" opacity=".6"/>`,
        `<path d="M18 117q17-19 41 0-24 19-41 0m41 0 10-11v22Z" fill="${palette.art}"/><path d="M55 141q13-14 31 0-18 14-31 0m31 0 8-8v16Z" fill="${palette.art}" opacity=".55"/><circle cx="32" cy="115" r="1.5" fill="${palette.bg}"/>`,
        `<path d="M18 144h19v-16h20v-16h20V96h22" fill="none" stroke="${palette.art}" stroke-width="9"/><circle cx="97" cy="89" r="5" fill="${palette.ink}"/>`,
        `<circle cx="59" cy="119" r="31" fill="none" stroke="${palette.art}" stroke-width="1.5"/><path d="m28 118 61-12-35 41 3-25Z" fill="${palette.art}"/><path d="m57 122 32-16" stroke="${palette.bg}"/>`,
        `<path d="M20 147q39-66 80 0Z" fill="${palette.art}"/><circle cx="35" cy="101" r="12" fill="${palette.ink}"/><circle cx="77" cy="90" r="2" fill="${palette.ink}"/><circle cx="94" cy="108" r="1.5" fill="${palette.ink}"/>`,
      ];
      let lines = wrap(n.title, 96, 16);
      if (lines.length > 3) lines = [...lines.slice(0, 2), lines[2].slice(0, -1) + '…'];
      return `<svg width="${n.w}" height="${n.h}" viewBox="0 0 120 180" role="img" aria-label="${esc(n.title)} 시안 표지"><rect x=".5" y=".5" width="119" height="179" rx="4" fill="${palette.bg}" stroke="${color.border}"/><path d="M6 2v176" stroke="${palette.ink}" opacity=".12"/>${inkText(n.category, 12, 18, 8, palette.ink, 500)}${lines.map((l, i) => inkText(l, 12, 42 + i * 20, 16, palette.ink, 700, fonts.display)).join('')}${shapes[index % shapes.length]}${inkText(n.author, 12, 165, 10, palette.ink, 500)}</svg>`;
    }
    function drawHero(n) {
      return `<svg width="${n.w}" height="${n.h}" viewBox="0 0 460 300" aria-label="펼친 책 속의 독서 기록">${inkText('오늘, 누군가의 책갈피', 36, 26, 12, color.muted, 500)}<path d="M32 66Q121 42 229 67Q335 40 428 66V260Q324 235 229 260Q122 234 32 260Z" fill="${color.white}" stroke="${color.border}"/><path d="M229 68v190" stroke="${color.border}"/><path d="M41 70v181M419 70v181" stroke="${color.border}"/><path d="M344 52h20v54l-10-7-10 7Z" fill="${color.accent}"/><g transform="translate(88,82)">${drawCover(cover(books[0], 78))}</g>${inkText('소년이 온다를 읽고', 254, 103, 11, color.muted, 500)}${inkText('책을 덮고도', 254, 139, 19, color.ink, 700, fonts.display)}${inkText('떠나지 않은', 254, 169, 19, color.ink, 700, fonts.display)}${inkText('장면들.', 254, 199, 19, color.ink, 700, fonts.display)}<path d="M252 207h119" stroke="${color.border}"/>${inkText('서연 · 독서 기록', 254, 232, 11, color.muted)}${inkText('한 권의 책, 서로 다른 마음.', 36, 290, 11, color.muted)}</svg>`;
    }
    function draw(n) {
      let content = '';
      if (n.type === 'frame') {
        if (n.fill || n.border) content += `<rect width="${n.w}" height="${n.h}" rx="${n.radius}" fill="${n.fill ? color[n.fill] : 'none'}" stroke="${n.border ? color[n.borderTone || 'border'] : 'none'}"/>`;
        if (n.name === 'Header' || n.name === 'Mobile Header') content += `<path d="M0 ${n.h - .5}H${n.w}" stroke="${color.border}"/>`;
        if (n.name.startsWith('Record Card')) content += `<path d="M${n.w-34} 0h12v23l-6-4-6 4Z" fill="${color.border}"/>`;
        if (n.name.startsWith('기억에 남은')) content += `<path d="M1 16v${n.h-32}" stroke="${color.ink}" stroke-width="2"/>`;
        content += n.children.map(c => `<g transform="translate(${c.x},${c.y})">${draw(c)}</g>`).join('');
      } else if (n.type === 'text') {
        const x = n.center ? n.w / 2 : 0;
        content = `<text font-family="${fonts[n.font] || fonts.body}" font-size="${n.size}" font-weight="${n.weight}" letter-spacing="${-n.size * .01}" fill="${color[n.tone]}" ${n.center ? 'text-anchor="middle"' : ''}>${n.lines.map((l, i) => `<tspan x="${x}" y="${i * n.lh + n.size * 1.08}">${esc(l)}</tspan>`).join('')}</text>`;
      } else if (n.type === 'logo') {
        content = `<svg width="${Math.min(n.w, 120)}" height="${n.h}" viewBox="0 0 216 72" preserveAspectRatio="xMinYMid meet" aria-label="Readly 로고">${logoArtwork}</svg>`;
      } else if (n.type === 'cover') content = drawCover(n);
      else if (n.type === 'hero-art') content = drawHero(n);
      else if (n.type === 'stats') {
        content = `<g fill="none" stroke="${color.muted}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7C4 1 0 7 3 11l5 5 5-5c3-4-1-10-5-4Z"/><path d="M66 5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5l-4 3v-3h-1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></g>${inkText(n.likes, 22, 16, 13, color.muted)}${inkText(n.comments, 86, 16, 13, color.muted)}`;
      } else if (n.type === 'line') content = `<rect width="${n.w}" height="1" fill="${color.border}"/>`;
      else if (n.type === 'switch') content = `<rect width="48" height="28" rx="14" fill="${n.checked ? color.action : '#D1D5D9'}"/><circle cx="${n.checked ? 34 : 14}" cy="14" r="10" fill="white"/>`;
      else if (n.type === 'icon') {
        const stroke = color[n.tone || 'ink'], size = n.size;
        const path = n.kind === 'down' ? '<path d="m4 6 4 4 4-4"/>' : n.kind === 'reply' ? '<path d="M4 2v7h9m-4-4 4 4-4 4"/>' : `<rect x="2" y="2" width="12" height="12" rx="2" fill="${n.kind === 'checked' ? color.action : 'none'}"/>` + (n.kind === 'checked' ? '<path d="m5 8 2 2 4-4" stroke="white"/>' : '');
        content = `<svg x="0" y="${(n.h - size) / 2}" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      }
      const named = `<g data-name="${esc(n.name)}"${n.disabled ? ' aria-disabled="true"' : ''}>${content}</g>`;
      return n.action ? `<a href="#${esc(n.action)}" data-action="${esc(n.action)}" aria-label="${esc(n.name)}"${n.role === 'switch' ? ` role="switch" aria-checked="${n.checked}"` : ''}>${named}</a>` : named;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${scene.w}" height="${scene.h}" viewBox="0 0 ${scene.w} ${scene.h}" role="group" aria-label="${esc(scene.name)}"><title>${esc(scene.name)} · Readly 디자인</title><style>a{cursor:pointer}a:focus-visible{outline:2px solid ${color.action};outline-offset:3px}a:hover>g>rect{stroke:${color.action}}@media(prefers-reduced-motion:no-preference){a>g>rect{transition:stroke .2s ease}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style><rect width="100%" height="100%" fill="${color.white}"/>${draw(scene)}</svg>`;
  }

  const api = { build, svg, pages, books, records };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.ReadlyDesign = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
