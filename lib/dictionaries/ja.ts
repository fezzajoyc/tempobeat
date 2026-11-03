import type { Dictionary } from "../i18n";

const ja: Dictionary = {
  brand: "TempoBeat",
  tagline: "完璧なリズムを保つ音楽ツール。",
  metaDesc:
    "無料オンライン音楽ツール:サンプル精度のブラウザメトロノーム、20 Hz–20 kHz のトーンジェネレーター、音程計算。すべてブラウザ内で処理され、インストールも登録も不要です。",

  nav: {
    tools: "すべてのツール",
    categories: "カテゴリー",
    about: "このサイトについて",
    menu: "メニュー",
    language: "言語",
  },

  home: {
    heroTitle: "完璧なリズムを刻むメトロノーム——ブラウザの中に",
    heroSub:
      "TempoBeat は音楽ツールのセット:サンプル精度のオンラインメトロノーム、トーンジェネレーター、音程計算。すべてブラウザ内でローカル処理——高速・無料・登録不要・アップロード一切なし。",
    browseAll: "すべてのツールを見る",
    pinned: "ピン留め",
    pin: "トップに固定",
    unpin: "固定を解除",
    popular: "人気のツール",
    categoriesTitle: "カテゴリー",
    featuredTitle: "人気のツール",
    trustLocal: "テンポもデータも端末内に留存",
    trustFree: "無料・アカウント不要",
    trustFast: "即時処理・オフライン対応",
    rotating: [
      "Web Audio クロックでスケジュールされたメトロノーム——ズレない",
      "4 回タップすれば、そのリズムが BPM になる",
      "20 Hz から 20 kHz までの純音。アプリのダウンロード不要",
      "周波数を 2 つ入力すれば、正確な音程が出る",
    ],
    statsLabels: { tools: "ツール", languages: "言語", uploads: "アップロード", accounts: "アカウント" },
    eyebrow: "ずっと無料",
    heroCtaSecondary: "仕組みを見る",
    statsTools: "{n} 個のツール",
    statsLanguages: "{n} 言語",
    statsUploads: "アップロード 0 回",
    statsAccounts: "アカウント 0 個",
    categoriesSub: "練習と音感トレーニングのための音楽ツールが、すべてあなたのデバイスで動きます。",
    popularSub: "いちばん使われているツール。",
    privacyTitle: "演奏したものは、あなたのデバイスから出ません。",
    privacySub: "アップロードという工程が存在しません。ツールはブラウザ内で動く JavaScript そのものです。ポリシーではなく構造の話です。",
    privacyPoint1T: "ローカル処理",
    privacyPoint1D: "入力したテンポや周波数はメモリ内でその場で処理されます。送信は一切ありません。",
    privacyPoint2T: "アカウント不要",
    privacyPoint2D: "登録もメールも履歴もありません。開いてすぐ使えます。",
    privacyPoint3T: "誠実な設計",
    privacyPoint3D: "ブラウザでできないことは、できないとはっきり書きます。",
    privacyLink: "プライバシーの詳細を読む",
    endTitle: "ツールを選んで、すぐ使える。",
    endSub: "15 言語、アップロード 0、インストール不要。",
  },

  tools: {
    title: "すべてのツール",
    subtitle: "{count} 個の無料音楽ツールを検索。アップロード不要・登録不要。",
    filterPlaceholder: "ツールを検索…",
    count: "{count} 個のツール",
    empty: "「{query}」に一致するツールはありません。",
  },

  categories: {
    pdf: { name: "PDF", desc: "PDF の結合・分割・変換・編集をどこにもアップロードせずに行えます。" },
    image: { name: "画像", desc: "画像の圧縮・リサイズ・切り抜き・形式変換をブラウザ内で。" },
    text: { name: "テキスト", desc: "文字数・整形・並べ替え・変換を入力しながら即時に。" },
    developer: { name: "開発者", desc: "日々の開発に使うフォーマッタ・エンコーダ・ジェネレータ。" },
    seo: { name: "SEO", desc: "メタタグ・構造化データ・SERP プレビューなどの SEO ヘルパー。" },
    security: { name: "セキュリティ", desc: "パスワード・ハッシュ・各種ルックアップを端末内で生成・検証。" },
    utility: { name: "音楽ツール", desc: "正確なオンラインメトロノーム、トーンジェネレーター、音程計算——完全にブラウザ内で動く練習ツール。" },
  },

  tool: {
    howTo: "使い方",
    faq: "よくある質問",
    related: "関連ツール",
    nextStep: "次のステップ",
    copyLink: "リンクをコピー",
    privacyNote:
      "このツールは完全にブラウザ内で動作します。データは端末から出ず、サーバーへアップロードされることはありません。",
    inCategory: "{category}のその他のツール",
    backToCategory: "{category}のすべてのツール",
  },

  common: {
    openTool: "ツールを開く",
    copy: "コピー",
    copied: "コピーしました",
    download: "ダウンロード",
    reset: "リセット",
    swap: "入れ替え",
    clear: "クリア",
    error: "エラーが発生しました。入力を確認して再試行してください。",
    input: "入力",
    output: "結果",
    settings: "オプション",
    dropFiles: "ここにファイルをドロップ、またはクリックして選択",
    dropFile: "ここにファイルをドロップ、またはクリックして選択",
    processing: "処理中…",
    fileSize: "サイズ",
    sample: "サンプルを試す",
    uppercase: "大文字",
  },

  unit: {
    from: "変換前",
    to: "変換後",
    amount: "数値",
    result: "結果",
    common: "よく使う変換",
    formula: "計算式",
    allUnits: "すべての単位",
  },

  text: {
    stats: {
      words: "単語数",
      characters: "文字数",
      charsNoSpaces: "空白除く",
      sentences: "文の数",
      paragraphs: "段落",
      lines: "行数",
      readingTime: "読了時間",
      readingMinutes: "約 {n} 分",
    },
  },

  footer: {
    line: "完璧なリズムを保つ音楽ツール。ここでの演奏は端末の外に出ません。",
    privacy: "プライバシー",
    terms: "利用規約",
    about: "このサイトについて",
    badges: "バッジ",
    language: "言語",
  },

  badge: {
    title: "TempoBeat バッジ",
    desc: "あなたのサイトや README、ドキュメントに TempoBeat バッジを置いてみてください。このサイトへリンクし、音楽ツールが完全にブラウザ内で動くことを伝えます。",
    voluntary: "設置は完全に任意です。プロジェクトを気に入ったらお好きなバッジをどうぞ。許可は不要です。",
    md: "Markdown(README)",
    html: "HTML(ウェブサイト)",
    thanks: "広めていただきありがとうございます。すべての設置が、ファイルを尊重するツールの発見につながります。",
  },

    embed: {
    title: "ツールを埋め込む",
    desc: "1 行であなたのサイトにツールを。訪問者のブラウザ内で動きます。",
  },

    mcp: {
    title: "MCP サーバー——AI から呼び出せるツール",
    desc1: "TempoBeat は MCP(Model Context Protocol)サーバーを同梱しています。Claude や Cursor などの AI アシスタントが、このサイトの音楽数学——音名→周波数、音程距離、タップテンポ——をそのまま実行できます。同じテスト済みロジックです。",
    desc2: "ツールはサイト自慢の純関数(十二平均律のピッチ、半音距離、タップ間隔の平均)を実行します。npx 経由で AI クライアント側のマシン上で動き、当社サーバーには送信されません。",
    toolsTitle: "実行可能なツール({n} 個)",
    requiresNode: "Node.js 18+ が必要です。サーバーは stdio でローカル実行。呼び出したツール計算のみローカルで行われます。",
    privacy: "Node.js 18+ が必要です。サーバーは stdio でローカル実行。呼び出したツール計算のみローカルで行われます。",
  },

    notFound: {
    title: "ページが見つかりません",
    body: "お探しのツールは存在しません。すべてのツールからお探しください。",
    home: "ホームへ戻る",
  },
};

export default ja;
