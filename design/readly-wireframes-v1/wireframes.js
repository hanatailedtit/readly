(function (global) {
  'use strict';

  const W = 1440, CW = 1200;
  const color = { ink: '#242424', muted: '#666666', border: '#D8D8D8', surface: '#F4F4F4', white: '#FFFFFF', active: '#E7E7E7' };
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
      for (const char of paragraph) {
        if (widthOf(line + char, size) > width && line) { output.push(line.trimEnd()); line = char.trimStart(); }
        else line += char;
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
    return { type: 'text', name: value.split('\n')[0], w: width, h: lines.length * lh, lines, size, weight, tone, lh, ...extra };
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
    const dark = variant === 'primary';
    const dropdown = label.includes('▾'), checkbox = /^[☐☑]/.test(label);
    const cleanLabel = label.replace(/[▾☐☑]/g, '').trim();
    const labelNode = t(cleanLabel, w - 24 - (dropdown || checkbox ? 24 : 0), 15, 400, dark ? 'white' : 'ink', { center: true });
    const icon = { type: 'icon', name: dropdown ? 'Chevron Down' : 'Record Filter Checkbox', kind: dropdown ? 'down' : label.includes('☑') ? 'checked' : 'unchecked', w: 16, h: 16, size: 16, tone: dark ? 'white' : 'ink' };
    const content = dropdown || checkbox ? row('Button Content', w - 24, checkbox ? [icon, labelNode] : [labelNode, icon], 8, { align: 'center' }) : labelNode;
    return col('Button · ' + cleanLabel, w, [content], 0, { p: [10, 12, 10, 12], fill: dark ? 'ink' : variant === 'ghost' ? null : 'white', border: variant !== 'ghost', radius: 6, height: 44, align: 'center', action });
  }
  function toggle(label, checked, w, action) {
    const labelWidth = Math.min(w - 64, Math.ceil(widthOf(label, 16)) + 4);
    return Object.assign(row('Switch · ' + label, w, [t(label, labelWidth, 16, 700), { type: 'switch', name: 'Switch Track', w: 48, h: 28, checked }], 16, { align: 'center', action }), { role: 'switch', checked });
  }
  function field(label, placeholder, w, error, disabled = false) {
    const hasArrow = placeholder.includes('▾');
    const innerText = t(placeholder.replace('▾', '').trim(), w - 28 - (hasArrow ? 24 : 0), 16, 400, 'muted');
    const content = hasArrow ? row('Select Value', w - 28, [innerText, { type: 'icon', name: 'Chevron Down', kind: 'down', w: 16, h: 16, size: 16 }], 8, { align: 'center' }) : innerText;
    const inner = col('Input · ' + label, w, [content], 0, { p: [12, 14, 12, 14], border: true, radius: 6, fill: disabled ? 'surface' : 'white', height: 48 });
    return Object.assign(col('Field · ' + label, w, [t(label, w, 14, 700, disabled ? 'muted' : 'ink'), inner, ...(error ? [t(error, w, 13)] : [])], 8), { disabled });
  }
  function cover(book, w = 96, h = 132) {
    const padding = Math.max(6, Math.min(12, Math.round(w * .1)));
    const gap = Math.max(4, Math.min(8, Math.round(w * .05))), inner = w - padding * 2;
    const titleSize = Math.max(9, Math.min(21, Math.round(w * .12)));
    const badge = t('BOOK', inner, Math.max(7, Math.min(10, Math.round(w * .075))), 700, 'muted');
    const author = t(book.author, inner, Math.max(8, Math.min(14, Math.round(w * .075))), 400, 'muted', { maxLines: 1 });
    const titleLines = Math.max(1, Math.min(3, Math.floor((h - padding * 2 - badge.h - author.h - gap * 3) / Math.ceil(titleSize * 1.5))));
    const title = t(book.title, inner, titleSize, 700, 'ink', { maxLines: titleLines });
    return col('Cover Placeholder · ' + book.title, w, [badge, title, space(h - padding * 2 - badge.h - title.h - author.h - gap * 3), author], gap, { p: padding, fill: 'active', border: true, height: h });
  }
  function header(active = '') {
    return row('Header', W, [
      t('READLY', 220, 24, 700, 'ink', { action: 'page:home' }),
      row('Navigation', 516, [button('독서 기록', 120, active === 'records' ? 'neutral' : 'ghost', 'page:records'), button('도서', 90, active === 'books' ? 'neutral' : 'ghost', 'page:books')], 8),
      row('Account Actions', 400, [button('로그인', 82, 'ghost', 'page:login'), button('회원가입', 94, 'neutral', 'page:signup'), button('기록 남기기', 168, 'primary', 'write')], 12),
    ], 32, { p: [14, 120, 14, 120], align: 'center', fill: 'white', height: 72 });
  }
  function footer() {
    return row('Footer', W, [t('READLY · 읽고, 기록하고, 나누다', 720, 14, 700), t('서비스 소개     이용약관     개인정보처리방침', 456, 14, 400, 'muted')], 24, { p: [28, 120, 28, 120], fill: 'surface' });
  }
  function page(name, active, sections) {
    return col(name, W, [header(active), col('Body', W, sections, 32, { p: [48, 120, 64, 120] }), footer()], 0, { fill: 'white' });
  }
  function gridRecord(r, width = 384, mark = '') {
    const b = books[r.book];
    return col('Record Card · ' + r.title, width, [
      ...(mark ? [t(mark, width - 40, 12, 700)] : []),
      t(r.title, width - 40, 20, 700, 'ink', { maxLines: 2 }),
      t(b.title + ' · ' + b.author, width - 40, 14, 400, 'muted', { maxLines: 2 }),
      t(r.excerpt, width - 40, 16, 400, 'muted', { maxLines: 2 }),
      space(6),
      t(r.user + ' · ' + r.date, width - 40, 13, 400, 'muted'),
      t('좋아요 ' + r.likes + '     댓글 ' + r.comments, width - 40, 13, 400, 'muted'),
    ], 10, { p: 20, border: true, radius: 8, fill: 'white', height: mark ? 338 : 310, action: 'page:record-detail' });
  }
  function listRecord(r, width = 1200) {
    const b = books[r.book], textW = width - 40 - 74 - 184 - 48;
    return row('Record Row · ' + r.title, width, [
      cover(b, 74, 102),
      col('Record Content', textW, [t(r.title, textW, 21, 700), t(b.title + ' · ' + b.author, textW, 14, 400, 'muted'), t(r.excerpt, textW, 15, 400, 'muted')], 8),
      col('Record Metadata', 184, [t(r.user + ' · ' + r.date, 184, 13, 400, 'muted'), t('좋아요 ' + r.likes + '  ·  댓글 ' + r.comments, 184, 13, 400, 'muted')], 8),
    ], 24, { p: 20, border: true, radius: 8, align: 'center', action: 'page:record-detail' });
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
    return row('Pagination', w, [space(1), button('이전', 76, 'ghost', 'notice:첫 번째 페이지입니다'), button('1', 44, 'primary'), button('2', 44, 'neutral', 'notice:샘플 와이어프레임입니다'), button('3', 44, 'neutral', 'notice:샘플 와이어프레임입니다'), button('다음', 76, 'ghost', 'notice:샘플 와이어프레임입니다')], 8, { p: [8, (w - 405) / 2, 8, (w - 405) / 2] });
  }
  function home(state) {
    const hero = row('01 · 서비스 안내', CW, [
      col('Service Introduction', 680, [t('읽고 난 뒤의 생각이\n나만의 기록이 되는 곳', 650, 40, 700), t('좋아하는 문장부터 오래 남은 생각까지.\n책과 함께 기록하고, 다른 독자의 시선을 만나보세요.', 640, 18, 400, 'muted'), t('책을 고르고  /  생각을 남기고  /  함께 이야기해요', 640, 14, 400, 'muted')], 16),
      col('기록 미리보기', 360, [t('한 문장이 오래 남았어요', 320, 21, 700), t('『소년이 온다』를 읽고\n\n책을 덮고도 쉽게 떠나지 않은 장면을 기록합니다.\n\n서연 · 좋아요 24 · 댓글 8', 320, 15, 400, 'muted')], 16, { p: 20, border: true, radius: 8, fill: 'white', action: 'page:record-detail' }),
    ], 32, { p: 32, fill: 'surface', align: 'center' });
    const cta = row('02 · 낮은 높이 작성 배너', CW, [col('CTA Copy', 960, [t('지금 독서 기록을 남겨보세요', 940, 20, 700), t('한 줄의 감상도 좋아요. 오늘 읽은 책에서 시작해보세요.', 940, 14, 400, 'muted')], 6), button('기록 남기기', 168, 'primary', 'write')], 24, { p: [16, 24, 16, 24], fill: 'surface', align: 'center' });
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
  function empty(title, body, label, action, w = CW) { return col('Empty State', w, [t(title, w - 64, 22, 700, 'ink', { center: true }), t(body, w - 64, 16, 400, 'muted', { center: true }), button(label, 208, 'neutral', action)], 16, { p: 32, fill: 'surface', align: 'center' }); }
  function comment(user, body, reply = false) {
    const w = reply ? 756 : 812;
    return col(reply ? 'Reply · 대댓글' : 'Comment · 댓글', w, [row('Comment Author', w - 32, [t(user, 180, 15, 700), t('2026.10.23 · 3시간 전', w - 212, 13, 400, 'muted')], 0), t(body, w - 32, 16), ...(reply ? [] : [button('답글 달기', 96, 'ghost', 'reply')])], 8, { p: 16, fill: reply ? 'surface' : null, border: !reply, radius: 6 });
  }
  function detail(state) {
    const article = col('독서 기록 본문', 812, [
      t('소설  /  독서 기록', 812, 14, 400, 'muted'), t(records[0].title, 812, 36, 700), t('서연 · 2026.10.23 · 조회 182', 812, 14, 400, 'muted'),
      row('Record Actions', 812, [button('좋아요 24', 132, 'neutral', 'like'), button('공유', 100, 'neutral', 'notice:공유 · URL 복사 / 카카오톡 / X'), button('더보기 ···', 132, 'ghost', 'notice:내 기록일 때 수정·삭제 메뉴 표시')], 12), line(812),
      t('책을 덮고도 쉽게 떠나지 않는 장면이 있습니다.\n독서가 끝났다고 생각한 순간부터, 오히려 질문은 시작되었습니다.', 812, 18),
      col('기억에 남은 문장 · 예시', 812, [t('기억은 과거를 보관하는 일에 그치지 않고,\n오늘을 살아가는 태도가 될 수도 있겠다고 생각했다.', 748, 22, 700), t('독자의 생각을 정리한 예시 문장 · 실제 도서 인용이 아닙니다', 748, 13, 400, 'muted')], 16, { p: 32, fill: 'surface' }),
      t('이번 독서에서 가장 오래 남은 것은 한 사람의 목소리를 듣는 마음이었습니다. 어떤 이야기는 빠르게 이해하기보다 충분히 곁에 머물러야 한다는 생각이 들었습니다.\n\n다시 읽게 된다면 같은 장면에서 또 다른 질문을 만나게 될 것 같습니다. 여러분에게는 어떤 장면이 오래 남았나요?', 812, 18),
      t('기록한 쪽수  32–68p     #소설  #기억  #함께읽기', 812, 14, 400, 'muted'), line(812),
      t('댓글 8', 812, 24, 700),
      col('Comment Composer', 812, [field('댓글 남기기', state.reply ? '책갈피 님에게 답글을 남겨보세요.' : '기록에 대한 생각을 나눠보세요.', 812), row('Comment Submit', 812, [t('댓글 작성은 로그인 후 가능합니다.', 640, 14, 400, 'muted'), button('로그인', 156, 'primary', 'page:login')], 16, { align: 'center' })], 12),
      comment('책갈피', '같은 책을 읽었는데도 다른 장면에 눈이 머물렀네요. 덕분에 다시 펼쳐보고 싶어졌어요.'),
      row('Indented Reply', 812, [t('↳', 32, 24, 400, 'muted'), comment('서연 · 작성자', '함께 나눌 수 있어서 좋네요. 다음에 읽으면 또 다른 장면이 남을 것 같아요.', true)], 24),
      ...(state.reply ? [col('답글 입력 상태', 812, [field('책갈피 님에게 답글', '답글을 입력하세요.', 812), button('로그인 후 답글 등록', 208, 'primary', 'page:login')], 12, { p: [0, 0, 0, 0] })] : []),
      comment('온유', '기억한다는 일에 대해 천천히 생각하게 되는 기록이네요. 잘 읽었습니다.'), button('댓글 더 보기', 812, 'neutral', 'notice:나머지 댓글을 불러오는 자리입니다'),
    ], 24);
    const side = col('연결 도서', 324, [cover(books[0], 180, 244), t('소년이 온다', 276, 23, 700), t('한강 · 소설\n도서 상세에서 서지 정보 확인', 276, 15, 400, 'muted'), t('이 책의 독서 기록 48건', 276, 16, 700), button('도서와 다른 기록 보기', 276, 'neutral', 'page:book-detail'), button('이 책으로 기록 남기기', 276, 'primary', 'write')], 16, { p: 24, fill: 'surface', align: 'center' });
    return page('03 · 독서 기록 상세', 'records', [t('독서 기록  /  소년이 온다', CW, 14, 400, 'muted', { action: 'page:records' }), row('Article and Book Sidebar', CW, [article, side], 64), button('독서 기록 목록으로', 200, 'neutral', 'page:records')]);
  }
  function bookTile(b) {
    return col('Book · ' + b.title, 282, [cover(b, 140, 186), t(b.title, 242, 20, 700), t(b.author + ' · ' + b.category, 242, 14, 400, 'muted'), t('독서 기록 ' + b.count + '건', 242, 16, 700), ...(b.count === 0 ? [t('첫 기록을 기다리고 있어요', 242, 13, 400, 'muted')] : [])], 12, { p: 20, border: true, radius: 8, height: 362, align: 'center', action: 'page:book-detail' });
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
      row('01 · 도서 정보', CW, [cover(b, 180, 248), col('Book Information', 908, [t('소설', 908, 14, 400, 'muted'), t('소년이 온다', 908, 36, 700), t('한강 지음', 908, 18), t('출판사 · 출간일 · ISBN', 908, 14, 400, 'muted'), t('책의 소개와 기본 정보를 보여주는 영역입니다. 책을 읽은 독자들의 기록을 아래에서 함께 살펴볼 수 있습니다.', 860, 17, 400, 'muted'), row('Book Actions', 908, [button('이 책으로 기록 남기기', 220, 'primary', 'write'), button('도서 원문 정보', 160, 'neutral', 'notice:기존 bookLink 외부 도서 정보 연결')], 16)], 16)], 48, { p: 32, fill: 'surface', align: 'center' }),
      col('02 · 달린 독서 기록', CW, [toolbar('이 책의 독서 기록', state, '48건'), t('기록을 선택하면 독서 기록 상세 페이지로 이동합니다.', CW, 14, 400, 'muted'), recordCollection(state, related), pagination()], 24),
      button('도서 목록으로', CW, 'neutral', 'page:books'),
    ]);
  }
  function login(state) {
    const form = col('로그인 폼', 432, [t('다시 만나 반가워요', 432, 32, 700), t('독서 기록을 이어가려면 로그인해 주세요.', 432, 16, 400, 'muted'), space(8), field('아이디', '아이디를 입력하세요.', 432, state.error ? '아이디와 비밀번호를 확인해 주세요.' : null), field('비밀번호', '비밀번호를 입력하세요.', 432), button('로그인', 432, 'primary', 'login'), t('또는', 432, 14, 400, 'muted', { center: true }), button('Google로 계속하기', 432, 'neutral', 'notice:Google OAuth 로그인으로 연결'), t('아직 계정이 없으신가요?', 432, 14, 400, 'muted', { center: true }), button('회원가입', 432, 'ghost', 'page:signup')], 20, { align: 'center' });
    return page('06 · 로그인', '', [col('Centered Login', CW, [form], 0, { p: [40, 0, 100, 0], align: 'center' })]);
  }
  function signup(state) {
    const form = col('회원가입 폼', 432, [t('나의 독서 기록 시작하기', 432, 30, 700), t('책을 읽은 마음을 오래 간직해 보세요.', 432, 16, 400, 'muted'), field('아이디', '영문·숫자 6자 이상', 432, state.error ? '이미 사용 중인 아이디입니다.' : null), t('입력 후 사용 가능한 아이디인지 자동으로 확인합니다.', 432, 13, 400, 'muted'), field('비밀번호', '8자 이상 입력하세요.', 432), field('비밀번호 확인', '비밀번호를 다시 입력하세요.', 432, state.error ? '비밀번호가 일치하지 않습니다.' : null), field('닉네임', '2–8자로 입력하세요.', 432), row('Required Agreements', 432, [t(state.agreed ? '☑' : '☐', 28, 20, 400, 'ink', { action: 'agree' }), t('이용약관 및 개인정보 수집·이용에 동의합니다. (필수)', 388, 13, 400, 'muted', { action: 'agree' })], 12), button('회원가입', 432, 'primary', 'signup'), row('Already Registered', 432, [t('이미 계정이 있으신가요?', 274, 14, 400, 'muted'), button('로그인', 146, 'ghost', 'page:login')], 12, { align: 'center' })], 18);
    return page('07 · 회원가입', '', [col('Centered Signup', CW, [form], 0, { p: [16, 0, 48, 0], align: 'center' })]);
  }

  function writeRecord(state) {
    const b = books[state.selectedBook || 0], width = 812;
    const bookSearch = row('Book Search', width, [field('책 제목 또는 저자', state.bookSearch ? '책 제목이나 저자를 입력하세요.' : '기록할 책을 검색하세요.', 636), button('도서 검색', 160, 'neutral', 'book-search')], 16, { align: 'end' });
    const selected = row('Selected Book', width, [cover(b, 74, 102), col('Selected Book Information', 490, [t(b.title, 490, 23, 700), t(b.author + ' · ' + b.category, 490, 15, 400, 'muted'), t('이 책에 독서 기록을 연결합니다.', 490, 14, 400, 'muted')], 8), button('책 변경', 160, 'neutral', 'book-search')], 24, { p: 20, border: true, radius: 8, align: 'center' });
    const results = state.bookSearch ? [col('Book Search Results', width, [t('검색 결과 예시 · 기록할 책을 선택하세요.', width - 32, 14, 700), ...books.slice(0, 3).map((book, index) => row('Book Result · ' + book.title, width - 32, [cover(book, 60, 92), col('Book Result Information', 544, [t(book.title, 544, 18, 700), t(book.author + ' · ' + book.category, 544, 14, 400, 'muted')], 8), button('선택', 112, 'neutral', 'select-book:' + index)], 16, { align: 'center' }))], 16, { p: 16, border: true, radius: 8 })] : [];
    const bookSection = col('01 · 읽은 책 선택', width, [t('읽은 책 *', width, 22, 700), t('책을 먼저 선택하면 해당 도서의 기록 목록에도 함께 표시됩니다.', width, 15, 400, 'muted'), ...(state.bookSelected ? [selected] : [bookSearch, ...results]), ...(state.error && !state.bookSelected ? [t('기록할 책을 선택해 주세요.', width, 14, 700)] : [])], 16);
    const categorySection = col('02 · 카테고리', width, [field('카테고리 *', state.bookSelected ? b.category + '  ▾' : '카테고리를 선택하세요.  ▾', width, state.error && !state.bookSelected ? '카테고리를 선택해 주세요.' : null)], 0);
    const toolbar = row('Editor Toolbar', width, [button('본문  ▾', 120, 'neutral', 'notice:본문 / 제목 서식 선택'), ...['굵게', '기울임', '인용', '목록', '링크'].map(label => button(label, 90, 'ghost', 'notice:' + label + ' 편집 도구 위치 예시'))], 8, { p: 12, fill: 'surface', align: 'center' });
    const editor = col('Record Body Editor', width, [toolbar, col('Record Body Input', width, [t('기억에 남은 문장이나 느낌을 자유롭게 적어보세요.', width - 48, 18, 400, 'muted'), t('한 줄의 소감, 인상 깊었던 장면, 나만의 해석도 좋아요.\n\n다른 독자와 나누고 싶은 생각을 천천히 적어보세요.', width - 48, 16, 400, 'muted')], 20, { p: 24, height: 300 }), row('Editor Status', width, [t('0자', 360, 13, 400, 'muted'), t('서식 있는 본문 작성', 412, 13, 400, 'muted')], 16, { p: [12, 12, 12, 12], fill: 'surface' })], 0, { border: true, radius: 8 });
    const contentSection = col('03 · 독서 기록 본문', width, [t('독서 기록 *', width, 22, 700), editor, ...(state.error ? [t('독서 기록 내용을 입력해 주세요.', width, 14, 700)] : [])], 16);
    const pageSection = col('04 · 쪽수 기록 / 선택', width, [row('Page Range Toggle', width, [t('쪽수 기록', 612, 22, 700), toggle('책 전체', state.wholeBook, 184, 'write-whole-book')], 16, { align: 'center' }), row('Page Range Fields', width, [field('시작 쪽수', '예: 32', 240, null, state.wholeBook), t('—', 32, 20, 400, 'muted', { center: true }), field('마지막 쪽수', '예: 68', 240, null, state.wholeBook)], 16, { align: 'end' }), t(state.wholeBook ? '책 전체에 대한 기록입니다. 쪽수 입력은 비활성화됩니다.' : '책 전체에 대한 기록이라면 ‘책 전체’를 켜주세요.', width, 14, 400, 'muted')], 16);
    const form = col('Writing Form', width, [bookSection, categorySection, contentSection, pageSection, line(width), row('Publish Actions', width, [t('등록하면 다른 독자에게 공개됩니다.', 436, 14, 400, 'muted'), button('취소', 128, 'neutral', 'page:records'), button('기록 등록하기', 216, 'primary', 'write-publish')], 16, { align: 'center' })], 32);
    const aside = col('Writing Guide', 324, [t('한 줄부터\n시작해도 좋아요', 276, 24, 700), t('완벽한 서평을 쓰지 않아도 괜찮아요.\n읽으며 떠오른 생각을\n내 말로 남겨보세요.', 276, 16, 400, 'muted'), line(276), t('이렇게 적어보세요', 276, 18, 700), t('01  오래 기억하고 싶은 장면\n\n02  내 일상과 연결된 생각\n\n03  함께 나누고 싶은 질문', 276, 15, 400, 'muted'), line(276), t('등록하기 전에', 276, 18, 700), t('읽은 책과 카테고리를 확인해 주세요.\n본문은 꼭 입력해 주세요.\n쪽수는 선택사항입니다.', 276, 15, 400, 'muted')], 20, { p: 24, fill: 'surface', radius: 8 });
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
      return col('Mobile Header', mw, [row('Brand and Account', cw, [t('READLY', cw - 208, 22, 700, 'ink', { action: 'page:home' }), button('기록 쓰기', 108, 'primary', 'write'), button('로그인', 76, 'ghost', 'page:login')], 12, { align: 'center' }), row('Primary Navigation', cw, [button('독서 기록', (cw - 12) / 2, ['records', 'record-detail', 'write'].includes(key) ? 'neutral' : 'ghost', 'page:records'), button('도서', (cw - 12) / 2, ['books', 'book-detail'].includes(key) ? 'neutral' : 'ghost', 'page:books')], 12)], 8, { p: [12, 16, 12, 16], fill: 'white' });
    }
    function mobilePage(name, sections) {
      return col(name + ' / 모바일', mw, [mobileHeader(), col('Mobile Body', mw, sections, 24, { p: [24, 16, 40, 16] }), col('Mobile Footer', mw, [t('READLY · 읽고, 기록하고, 나누다', cw, 14, 700), t('서비스 소개 · 이용약관\n개인정보처리방침', cw, 13, 400, 'muted')], 12, { p: [24, 16, 24, 16], fill: 'surface' })], 0, { fill: 'white' });
    }
    function mobileToolbar(title, count = '') {
      const sortW = Math.round(cw * .4), viewW = (cw - sortW - 16) / 2;
      return col('Mobile Records Toolbar', cw, [t(title + (count ? '  ' + count : ''), cw, 22, 700), row('Sort and View', cw, [button(sortName(state.sort) + '  ▾', sortW, 'neutral', 'sort'), button('리스트', viewW, state.view === 'list' ? 'primary' : 'neutral', 'view:list'), button('그리드', viewW, state.view === 'grid' ? 'primary' : 'neutral', 'view:grid')], 8)], 16);
    }
    function mobileRecord(r, view = state.view, width = cw) {
      if (view === 'grid') return gridRecord(r, width);
      const b = books[r.book], tw = width - 116;
      return col('Mobile Record Row · ' + r.title, width, [row('Book and Record', width - 32, [cover(b, 72, 108), col('Record Content', tw, [t(r.title, tw, 18, 700, 'ink', { maxLines: 2 }), t(b.title + ' · ' + b.author, tw, 14, 400, 'muted', { maxLines: 2 })], 8)], 12), t(r.excerpt, width - 32, 15, 400, 'muted', { maxLines: 2 }), t(r.user + ' · ' + r.date, width - 32, 13, 400, 'muted'), t('좋아요 ' + r.likes + '   댓글 ' + r.comments, width - 32, 13, 400, 'muted')], 12, { p: 16, border: true, radius: 8, fill: 'white', action: 'page:record-detail' });
    }
    function mobileRecords(list) { return col('Mobile Records · ' + state.view, cw, list.map(r => mobileRecord(r)), 16); }
    function mobilePagination() { return row('Mobile Pagination', cw, [button('이전', (cw - 164) / 2, 'ghost', 'notice:첫 번째 페이지입니다'), button('1', 44, 'primary'), button('2', 44, 'neutral', 'notice:샘플 와이어프레임입니다'), button('3', 44, 'neutral', 'notice:샘플 와이어프레임입니다'), button('다음', (cw - 164) / 2, 'ghost', 'notice:샘플 와이어프레임입니다')], 8); }
    function mobileSearch(bookSearch = false) { return col('Mobile Search', cw, [...(bookSearch ? [] : [field('검색 범위', '전체  ▾', cw)]), field(bookSearch ? '도서 검색' : '독서 기록 검색', bookSearch ? '책 제목이나 저자를 입력하세요.' : '책 제목, 내용, 작성자', cw), button('검색', cw, 'primary', 'search')], 12); }
    function mobileComment(user, body, reply = false, width = cw) {
      return col(reply ? 'Mobile Reply · 대댓글' : 'Mobile Comment · 댓글', width, [t(user, width - 32, 15, 700), t('2026.10.23 · 3시간 전', width - 32, 12, 400, 'muted'), t(body, width - 32, 16), ...(reply ? [] : [button('답글 달기', 104, 'ghost', 'reply')])], 8, { p: 16, fill: reply ? 'surface' : 'white', border: !reply, radius: 6 });
    }
    function compactBook(b, withActions = false) {
      const tw = cw - 128;
      return col('Mobile Connected Book', cw, [row('Book Information', cw - 32, [cover(b, 80, 120), col('Book Metadata', tw, [t(b.title, tw, 20, 700), t(b.author + ' · ' + b.category, tw, 14, 400, 'muted'), t('독서 기록 ' + b.count + '건', tw, 14, 700)], 8)], 16), ...(withActions ? [button('이 책의 다른 기록 보기', cw - 32, 'neutral', 'page:book-detail'), button('이 책으로 기록 남기기', cw - 32, 'primary', 'write')] : [])], 16, { p: 16, fill: 'surface', radius: 8 });
    }

    if (key === 'home') return mobilePage('01 · 메인 / ' + (state.view === 'list' ? '리스트' : '그리드'), [col('01 · 서비스 안내', cw, [t('읽고 난 뒤의 생각이\n나만의 기록이 되는 곳', cw - 32, 28, 700), t('좋아하는 문장부터 오래 남은 생각까지.\n책과 함께 기록하고 나눠보세요.', cw - 32, 16, 400, 'muted'), t('책을 고르고 · 생각을 남기고\n함께 이야기해요', cw - 32, 14, 400, 'muted')], 16, { p: 16, fill: 'surface' }), col('02 · 낮은 작성 배너', cw, [t('지금 독서 기록을 남겨보세요', cw - 32, 18, 700), button('기록 남기기', cw - 32, 'primary', 'write')], 12, { p: 16, fill: 'surface' }), mobileToolbar('함께 읽는 독서 기록'), mobileRecords(ordered(state.sort)), button('독서 기록 전체 보기', cw, 'neutral', 'page:records')]);

    if (key === 'records') {
      const recommended = [records[0], records[2], records[4]], index = state.recommendation || 0, inner = cw - 32;
      const rec = col('02 · 이달의 추천', cw, [t('이달의 추천 독서 기록', inner, 22, 700), t('10월의 기록 · 한 번에 한 편씩', inner, 14, 400, 'muted'), gridRecord(recommended[index], inner, '10월의 기록  0' + (index + 1)), row('Recommendation Controls', inner, [button('이전', 76, 'neutral', 'recommendation:' + (index + 2) % 3), t((index + 1) + ' / 3', inner - 168, 14, 400, 'muted', { center: true }), button('다음', 76, 'neutral', 'recommendation:' + (index + 1) % 3)], 8, { align: 'center' })], 16, { p: 16, fill: 'surface' });
      const labels = ['전체', '소설', '에세이', '인문', '자기계발'], chipW = (cw - 16) / 3;
      const chips = col('Category Filter', cw, [row('Category Row 1', cw, labels.slice(0, 3).map((label, i) => button(label, chipW, state.category === i ? 'primary' : 'neutral', 'category:' + i)), 8), row('Category Row 2', cw, labels.slice(3).map((label, i) => button(label, chipW, state.category === i + 3 ? 'primary' : 'neutral', 'category:' + (i + 3))), 8)], 8);
      const list = ordered(state.sort).filter(r => !state.category || books[r.book].category === labels[state.category]);
      const results = list.length ? mobileRecords(list) : col('Mobile Empty State', cw, [t('아직 이 분류의 기록이 없어요', cw - 32, 20, 700), t('첫 번째 독서 기록을 남겨보세요.', cw - 32, 16, 400, 'muted'), button('기록 남기기', cw - 32, 'neutral', 'write')], 16, { p: 16, fill: 'surface' });
      return mobilePage('02 · 독서 기록', [heading('독서 기록', '다른 독자의 생각에서 다음 책을 발견해 보세요.'), mobileSearch(), rec, mobileToolbar('전체 독서 기록', list.length + '건'), chips, results, mobilePagination()]);
    }

    if (key === 'record-detail') return mobilePage('03 · 독서 기록 상세', [t('독서 기록 / 소년이 온다', cw, 13, 400, 'muted', { action: 'page:records' }), compactBook(books[0], true), heading('기억한다는 건,\n끝내 곁에 머무는 일'), t('서연 · 2026.10.23 · 조회 182', cw, 13, 400, 'muted'), row('Mobile Record Actions', cw, [button('좋아요 24', (cw - 16) / 3, 'neutral', 'like'), button('공유', (cw - 16) / 3, 'neutral', 'notice:URL 복사 / 카카오톡 / X'), button('더보기', (cw - 16) / 3, 'ghost', 'notice:내 기록일 때 수정·삭제 메뉴 표시')], 8), line(cw), t('책을 덮고도 쉽게 떠나지 않는 장면이 있습니다. 독서가 끝났다고 생각한 순간부터, 오히려 질문은 시작되었습니다.', cw, 17), col('기억에 남은 생각', cw, [t('기억은 과거를 보관하는 일에 그치지 않고, 오늘을 살아가는 태도가 될 수도 있겠다고 생각했다.', cw - 32, 20, 700), t('독자의 생각을 정리한 예시 · 실제 도서 인용 아님', cw - 32, 12, 400, 'muted')], 16, { p: 16, fill: 'surface' }), t('이번 독서에서 가장 오래 남은 것은 한 사람의 목소리를 듣는 마음이었습니다. 어떤 이야기는 빠르게 이해하기보다 충분히 곁에 머물러야 한다는 생각이 들었습니다.\n\n다시 읽게 된다면 같은 장면에서 또 다른 질문을 만나게 될 것 같습니다. 여러분에게는 어떤 장면이 오래 남았나요?', cw, 17), t('기록한 쪽수 32–68p\n#소설  #기억  #함께읽기', cw, 14, 400, 'muted'), line(cw), t('댓글 8', cw, 24, 700), field('댓글 남기기', '기록에 대한 생각을 나눠보세요.', cw), t('댓글 작성은 로그인 후 가능합니다.', cw, 14, 400, 'muted'), button('로그인 후 댓글 남기기', cw, 'primary', 'page:login'), mobileComment('책갈피', '같은 책을 읽었는데도 다른 장면에 눈이 머물렀네요. 다시 펼쳐보고 싶어졌어요.'), row('Mobile Indented Reply', cw, [t('↳', 20, 20, 400, 'muted'), mobileComment('서연 · 작성자', '다음에 읽으면 또 다른 장면이 남을 것 같아요.', true, cw - 28)], 8), ...(state.reply ? [col('Mobile Reply Composer', cw, [field('책갈피 님에게 답글', '답글을 입력하세요.', cw), button('로그인 후 답글 등록', cw, 'primary', 'page:login')], 12)] : []), mobileComment('온유', '기억한다는 일에 대해 천천히 생각하게 되는 기록이네요.'), button('댓글 더 보기', cw, 'neutral', 'notice:나머지 댓글을 불러오는 자리입니다'), button('독서 기록 목록으로', 200, 'neutral', 'page:records')]);

    if (key === 'books') {
      const list = (state.onlyRecorded ? books.filter(b => b.count > 0) : books.slice()).sort((a, b) => b.count - a.count), textW = cw - 136;
      const items = col('Mobile Book List', cw, list.map(b => row('Mobile Book · ' + b.title, cw, [cover(b, 88, 132), col('Book Metadata', textW, [t(b.title, textW, 18, 700, 'ink', { maxLines: 2 }), t(b.author, textW, 14, 400, 'muted', { maxLines: 2 }), t('기록 ' + b.count + '건', textW, 14, 700)], 10)], 16, { p: 16, border: true, radius: 8, align: 'center', action: 'page:book-detail' })), 16);
      return mobilePage('04 · 도서 목록', [heading('도서', '한 권의 책에 쌓인 다양한 기록을 만나보세요.'), mobileSearch(true), mobileSwitch('기록이 달린 도서만 보기', state.onlyRecorded, 'filter'), row('Book Count and Sort', cw, [t(list.length + '권', cw - 180, 18, 700), button('기록 많은순  ▾', 164, 'neutral', 'notice:기록 많은순 / 최근 기록순 / 제목순')], 16, { align: 'center' }), items, mobilePagination()]);
    }

    if (key === 'book-detail') {
      const related = [records[0], { ...records[3], title: '조용히 읽고 오래 생각하게 된 책', book: 0 }, { ...records[4], title: '다시 읽으며 발견한 장면들', book: 0 }];
      if (state.sort === 'popular') related.sort((a, b) => b.likes - a.likes); if (state.sort === 'comments') related.sort((a, b) => b.comments - a.comments);
      return mobilePage('05 · 도서 상세', [t('도서 / 소년이 온다', cw, 13, 400, 'muted', { action: 'page:books' }), compactBook(books[0]), t('출판사 · 출간일 · ISBN', cw, 14, 400, 'muted'), t('도서 소개와 기본 정보를 보여주는 영역입니다. 아래에서 같은 책을 읽은 독자들의 기록을 살펴보세요.', cw, 16, 400, 'muted'), button('이 책으로 기록 남기기', cw, 'primary', 'write'), button('도서 원문 정보', cw, 'neutral', 'notice:외부 도서 정보로 연결'), line(cw), mobileToolbar('이 책의 독서 기록', '48건'), mobileRecords(related), mobilePagination(), button('도서 목록으로', 184, 'neutral', 'page:books')]);
    }

    if (key === 'login') return mobilePage('06 · 로그인', [heading('다시 만나 반가워요', '독서 기록을 이어가려면 로그인해 주세요.'), field('아이디', '아이디를 입력하세요.', cw, state.error ? '아이디와 비밀번호를 확인해 주세요.' : null), field('비밀번호', '비밀번호를 입력하세요.', cw), button('로그인', cw, 'primary', 'login'), t('또는', cw, 14, 400, 'muted', { center: true }), button('Google로 계속하기', cw, 'neutral', 'notice:Google OAuth 로그인으로 연결'), t('아직 계정이 없으신가요?', cw, 14, 400, 'muted', { center: true }), button('회원가입', cw, 'ghost', 'page:signup')]);

    if (key === 'signup') return mobilePage('07 · 회원가입', [heading('나의 독서 기록 시작하기', '책을 읽은 마음을 오래 간직해 보세요.'), field('아이디', '영문·숫자 6자 이상', cw, state.error ? '이미 사용 중인 아이디입니다.' : null), t('입력 후 아이디 사용 가능 여부를 확인합니다.', cw, 13, 400, 'muted'), field('비밀번호', '8자 이상 입력하세요.', cw), field('비밀번호 확인', '비밀번호를 다시 입력하세요.', cw, state.error ? '비밀번호가 일치하지 않습니다.' : null), field('닉네임', '2–8자로 입력하세요.', cw), row('Mobile Required Agreements', cw, [t(state.agreed ? '☑' : '☐', 28, 20, 400, 'ink', { action: 'agree' }), t('이용약관 및 개인정보 수집·이용에\n동의합니다. (필수)', cw - 40, 13, 400, 'muted', { action: 'agree' })], 12), button('회원가입', cw, 'primary', 'signup'), t('이미 계정이 있으신가요?', cw, 14, 400, 'muted', { center: true }), button('로그인', cw, 'ghost', 'page:login')]);

    const b = books[state.selectedBook || 0];
    const book = col('Mobile Selected Book', cw, [row('Selected Book Information', cw - 32, [cover(b, 80, 120), col('Selected Book Metadata', cw - 128, [t(b.title, cw - 128, 20, 700), t(b.author + ' · ' + b.category, cw - 128, 14, 400, 'muted')], 8)], 16), button('책 변경', cw - 32, 'neutral', 'book-search')], 16, { p: 16, border: true, radius: 8 });
    const searchResults = state.bookSearch ? [col('Mobile Book Search Results', cw, [t('검색 결과 예시 · 책을 선택하세요.', cw - 32, 14, 700), ...books.slice(0, 3).map((b, i) => col('Mobile Book Result · ' + b.title, cw - 32, [row('Result Information', cw - 32, [cover(b, 72, 108), col('Result Metadata', cw - 116, [t(b.title, cw - 116, 18, 700), t(b.author, cw - 116, 14, 400, 'muted')], 8)], 12), button('이 책 선택', cw - 32, 'neutral', 'select-book:' + i)], 12))], 16, { p: 16, border: true, radius: 8 })] : [];
    const bookSection = col('01 · 읽은 책', cw, [t('읽은 책 *', cw, 22, 700), ...(state.bookSelected ? [book] : [field('책 제목 또는 저자', '기록할 책을 검색하세요.', cw), button('도서 검색', cw, 'neutral', 'book-search'), ...searchResults]), ...(state.error && !state.bookSelected ? [t('기록할 책을 선택해 주세요.', cw, 14, 700)] : [])], 16);
    const toolW = (cw - 40) / 3;
    const editor = col('Mobile Editor', cw, [col('Mobile Editor Toolbar', cw, [row('Formatting Row 1', cw - 24, [button('본문  ▾', toolW, 'neutral', 'notice:본문 / 제목 서식 선택'), button('굵게', toolW, 'ghost', 'notice:굵게 도구'), button('기울임', toolW, 'ghost', 'notice:기울임 도구')], 8), row('Formatting Row 2', cw - 24, ['인용', '목록', '링크'].map(label => button(label, toolW, 'ghost', 'notice:' + label + ' 도구')), 8)], 8, { p: 12, fill: 'surface' }), col('Mobile Editor Input', cw, [t('기억에 남은 문장이나 느낌을 자유롭게 적어보세요.', cw - 32, 16, 400, 'muted'), t('한 줄의 소감, 인상 깊었던 장면, 나만의 해석도 좋아요.', cw - 32, 15, 400, 'muted')], 16, { p: 16, height: 260 }), col('Mobile Editor Status', cw, [t('0자', cw - 24, 13, 400, 'muted')], 0, { p: 12, fill: 'surface' })], 0, { border: true, radius: 8 });
    const range = col('Mobile Page Range', cw, [row('Page Range Heading', cw, [t('쪽수 기록', cw - 162, 22, 700), mobileSwitch('책 전체', state.wholeBook, 'write-whole-book', 150)], 12, { align: 'center' }), row('Page Range Fields', cw, [field('시작 쪽수', '예: 32', (cw - 32) / 2, null, state.wholeBook), t('—', 16, 16, 400, 'muted', { center: true }), field('마지막 쪽수', '예: 68', (cw - 32) / 2, null, state.wholeBook)], 8, { align: 'end' }), t(state.wholeBook ? '책 전체 기록으로 쪽수 입력이 비활성화됩니다.' : '책 전체에 대한 기록이라면 ‘책 전체’를 켜주세요.', cw, 14, 400, 'muted')], 16);
    return mobilePage('08 · 기록 남기기', [heading('책을 읽은 마음을\n남겨보세요', '좋아하는 문장과 오늘의 생각을 남겨보세요.'), bookSection, field('카테고리 *', state.bookSelected ? b.category + '  ▾' : '카테고리를 선택하세요.  ▾', cw, state.error && !state.bookSelected ? '카테고리를 선택해 주세요.' : null), col('03 · 독서 기록', cw, [t('독서 기록 *', cw, 22, 700), editor, ...(state.error ? [t('독서 기록 내용을 입력해 주세요.', cw, 14, 700)] : [])], 16), range, col('Mobile Writing Guide', cw, [t('한 줄부터 시작해도 좋아요', cw - 32, 20, 700), t('오래 기억하고 싶은 장면, 일상과 연결된 생각, 함께 나누고 싶은 질문을 적어보세요.', cw - 32, 15, 400, 'muted')], 12, { p: 16, fill: 'surface' }), t('등록하면 다른 독자에게 공개됩니다.', cw, 14, 400, 'muted'), row('Mobile Publish Actions', cw, [button('취소', 96, 'neutral', 'page:records'), button('기록 등록하기', cw - 108, 'primary', 'write-publish')], 12)]);
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
    function draw(n) {
      let content = '';
      if (n.type === 'frame') {
        if (n.fill || n.border) content += `<rect width="${n.w}" height="${n.h}" rx="${n.radius}" fill="${n.fill ? color[n.fill] : 'none'}" stroke="${n.border ? color.border : 'none'}"/>`;
        content += n.children.map(c => `<g transform="translate(${c.x},${c.y})">${draw(c)}</g>`).join('');
      } else if (n.type === 'text') {
        const x = n.center ? n.w / 2 : 0;
        content = `<text font-family="IBM Plex Sans KR, Noto Sans KR, sans-serif" font-size="${n.size}" font-weight="${n.weight}" fill="${color[n.tone]}" ${n.center ? 'text-anchor="middle"' : ''}>${n.lines.map((l, i) => `<tspan x="${x}" y="${i * n.lh + n.size * 1.12}">${esc(l)}</tspan>`).join('')}</text>`;
      } else if (n.type === 'line') content = `<rect width="${n.w}" height="1" fill="${color.border}"/>`;
      else if (n.type === 'switch') content = `<rect width="48" height="28" rx="14" fill="${n.checked ? color.ink : color.border}"/><circle cx="${n.checked ? 34 : 14}" cy="14" r="10" fill="white"/>`;
      else if (n.type === 'icon') {
        const stroke = color[n.tone || 'ink'], size = n.size;
        const path = n.kind === 'down' ? '<path d="m4 6 4 4 4-4"/>' : n.kind === 'reply' ? '<path d="M4 2v7h9m-4-4 4 4-4 4"/>' : '<rect x="2" y="2" width="12" height="12" rx="2"/>' + (n.kind === 'checked' ? '<path d="m5 8 2 2 4-4"/>' : '');
        content = `<svg x="0" y="${(n.h - size) / 2}" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      }
      const named = `<g data-name="${esc(n.name)}"${n.disabled ? ' aria-disabled="true"' : ''}>${content}</g>`;
      return n.action ? `<a href="#${esc(n.action)}" data-action="${esc(n.action)}" aria-label="${esc(n.name)}"${n.role === 'switch' ? ` role="switch" aria-checked="${n.checked}"` : ''}>${named}</a>` : named;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${scene.w}" height="${scene.h}" viewBox="0 0 ${scene.w} ${scene.h}" role="img" aria-label="${esc(scene.name)}"><title>${esc(scene.name)} · Readly 와이어프레임</title><rect width="100%" height="100%" fill="white"/>${draw(scene)}</svg>`;
  }
  const api = { build, svg, pages, books, records };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.ReadlyWireframes = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
