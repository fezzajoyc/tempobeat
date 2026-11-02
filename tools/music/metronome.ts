import { MetronomeEngine } from "../_engines/engine-metronome";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "metronome",
  category: "utility",
  icon: "clock",
  featured: true,
  engine: { component: MetronomeEngine },
  related: ["tone-generator", "interval-calculator"],
  copy: {
    en: {
      name: "Online Metronome",
      tagline:
        "A precise browser metronome: 30–300 BPM, five time signatures, subdivisions and tap tempo — scheduled on the Web Audio clock so the beat never drifts.",
      intro: [
        "A metronome is only useful if it is exactly steady. This one schedules every click on the Web Audio clock with a 120 ms lookahead — the technique professional web metronomes use — instead of firing setTimeout calls that drift with the main thread. The result is a beat you can practice against at 30 to 300 BPM, in 2/4, 3/4, 4/4, 6/8 or 7/8.",
        "Dial the tempo with the slider or by tapping the rhythm you have in mind: four or more taps are averaged into a BPM. Add eighth, triplet or sixteenth subdivisions, accent the downbeat, and follow the beat dots while you play. Nothing to install, no account, and it works on phones during practice sessions.",
      ],
      steps: [
        "Drag the tempo slider or press −1 / +1 until the BPM reads where you want it — or tap the tap-tempo button four or more times in rhythm.",
        "Pick a time signature (2/4, 3/4, 4/4, 6/8, 7/8) and, if you need one, a subdivision: quarter, eighth, triplet or sixteenth.",
        "Choose whether the first beat of each bar is accented, then press Start.",
        "Play along; the dots above the BPM light up on each beat so you can keep your eyes on your instrument.",
      ],
      faqs: [
        {
          q: "Why doesn't this metronome drift like other web metronomes?",
          a: "Most web metronomes schedule each click with setTimeout, which inherits every hiccup of the browser's main thread. This tool uses the standard lookahead pattern: a small timer wakes up every 25 ms and schedules clicks roughly 120 ms ahead on the Web Audio hardware clock, so the actual timing is sample-accurate and never accumulates drift.",
        },
        {
          q: "How does tap tempo work?",
          a: "Tap the button in the rhythm you want, at least four times. The tool measures the intervals between taps, averages them, and converts the average into BPM. If you pause longer than 3 seconds between taps, the count resets — that pause means you started a new phrase rather than continuing one tempo.",
        },
        {
          q: "What does the subdivision setting do?",
          a: "It divides each beat into equal pulses: quarter plays one click per beat, eighth two, triplet three, and sixteenth four. The beats stay accented and the subdivisions sound softer, so you can hear exactly where each note of a run should land.",
        },
        {
          q: "How should I read 6/8 and 7/8 on this metronome?",
          a: "For the x/8 signatures the beat is an eighth note, so 6/8 at 120 BPM plays six eighth-note clicks per bar. That matches how the notation counts: set the BPM to the speed of the eighth note you want and the bar length follows.",
        },
      ],
    },
    zh: {
      name: "在线节拍器",
      tagline: "精准的浏览器节拍器:30–300 BPM、五种拍号、细分与手动打拍——基于 Web Audio 时钟排程,节拍永不漂移。",
      intro: [
        "节拍器只有绝对稳才有用。本工具把每一次点击都按 Web Audio 时钟、提前 120 ms 排程——专业网页节拍器的标准做法——而不是用会随主线程卡顿漂移的 setTimeout。因此你可以在 30–300 BPM 下安心练习,支持 2/4、3/4、4/4、6/8、7/8 五种拍号。",
        "用滑杆调速度,也可以按心里的节奏点「手动打拍」:点 4 次以上取平均即得 BPM。可叠加八分、三连、十六分细分,重音落在每小节第一拍,弹奏时跟着节拍点亮灯走。无需安装、无需注册,练习时手机也能直接用。",
      ],
      steps: [
        "拖动速度滑杆或按 −1 / +1 调到目标 BPM,也可以按节奏点「手动打拍」按钮 4 次以上。",
        "选择拍号(2/4、3/4、4/4、6/8、7/8),需要的话再选细分:四分、八分、三连音或十六分。",
        "决定每小节第一拍是否重音,然后按「开始」。",
        "跟着练习——BPM 上方的圆点会在每一拍亮起,让你可以盯着手中的乐器。",
      ],
      faqs: [
        {
          q: "为什么这个节拍器不像其他网页节拍器那样漂移?",
          a: "多数网页节拍器用 setTimeout 排程每次点击,浏览器主线程一卡顿节拍就跟着歪。本工具采用标准的 lookahead 模式:一个很小的定时器每 25 ms 醒来一次,把未来约 120 ms 的点击排程到 Web Audio 硬件时钟上,实际发音按采样精确计时,不会累积漂移。",
        },
        {
          q: "手动打拍(Tap tempo)是怎么工作的?",
          a: "按你想要的节奏点按钮,至少 4 次。工具测量各次点击的间隔、取平均,再换算成 BPM。两次点击之间停顿超过 3 秒会重新计数——停顿意味着你开始的是新的一段,而不是同一条节奏。",
        },
        {
          q: "细分设置是做什么的?",
          a: "它把每一拍等分成若干脉冲:四分音符每拍 1 个 click,八分 2 个,三连音 3 个,十六分 4 个。节拍保持重音、细分音量更轻,你能清楚听到每个音应该落在哪里。",
        },
        {
          q: "6/8 和 7/8 应该怎么理解?",
          a: "x/8 拍号的一拍是八分音符,所以 6/8 在 120 BPM 下每小节有 6 个八分音符 click。这与乐谱的计数方式一致:把 BPM 设成你想要的八分音符速度,小节长度自然随之确定。",
        },
      ],
    },
    ja: {
      name: "オンラインメトロノーム",
      tagline:
        "正確さに特化したブラウザメトロノーム。30–300 BPM、5 種類の拍子、拍の細分、タップテンポ対応——Web Audio クロックでスケジュールするのでビートはズレません。",
      intro: [
        "メトロノームは正確に一定でなければ意味がありません。このツールはすべてのクリックを Web Audio クロック上で 120 ms 先までスケジュールする——プロ仕様のウェブメトロノームと同じ方式——で、メインスレッドの影響でズレる setTimeout には頼りません。30 から 300 BPM、2/4・3/4・4/4・6/8・7/8 の拍子に対応します。",
        "テンポはスライダーでも、頭の中のリズムをタップしても設定できます。4 回以上タップすると平均が BPM になります。八分・三連符・十六分の細分を重ね、一小節目にアクセントを置き、ビートの点灯に合わせて演奏してください。インストールもアカウントも不要で、練習中のスマホでもそのまま使えます。",
      ],
      steps: [
        "テンポスライダーを動かすか −1 / +1 で BPM を合わせます。リズムに合わせてタップテンポを 4 回以上押しても構いません。",
        "拍子(2/4、3/4、4/4、6/8、7/8)を選び、必要なら細分(四分・八分・三連符・十六分)を選びます。",
        "一小節目をアクセントするかどうかを選び、「スタート」を押します。",
        "合わせて演奏します。BPM の上の点が各拍で光るので、楽譜や楽器に視線を保てます。",
      ],
      faqs: [
        {
          q: "他のウェブメトロノームと違ってズレないのはなぜですか?",
          a: "多くのウェブメトロノームはクリックを setTimeout でスケジュールするため、ブラウザのメインスレッドが詰まるとビートが狂います。このツールは標準的なルックアヘッド方式を使います。小さなタイマーが 25 ms ごとに起きて、約 120 ms 先のクリックを Web Audio のハードウェアクロックに予定するので、実際の発音はサンプル精度になりドリフトが蓄積しません。",
        },
        {
          q: "タップテンポはどう動きますか?",
          a: "欲しいリズムでボタンを 4 回以上タップしてください。ツールはタップ間の間隔を測って平均し、BPM に換算します。タップの間が 3 秒を超えると数え直しになります。3 秒の空白は同じテンポの続きではなく新しいフレーズの始まりとみなすためです。",
        },
        {
          q: "細分(サブディビジョン)設定は何をしますか?",
          a: "一拍を等分したパルスに分割します。四分音符は 1 拍に 1 クリック、八分は 2、三連符は 3、十六分は 4 です。拍はアクセントのまま、細分は小さめの音なので、走句の各音がどこに乗るべきかがはっきり聞こえます。",
        },
        {
          q: "6/8 と 7/8 はどう読めばいいですか?",
          a: "x/8 の拍子では一拍=八分音符です。6/8 を 120 BPM にすると一小節に 6 つの八分音符クリックが鳴ります。記譜の数え方と同じで、BPM を望みの八分音符の速さに設定すれば小節の長さは自動的に決まります。",
        },
      ],
    },
    es: {
      name: "Metrónomo online",
      tagline:
        "Un metrónomo de navegador preciso: 30–300 BPM, cinco compases, subdivisiones y tempo por pulsación — programado en el reloj de Web Audio para que el pulso nunca se desvíe.",
      intro: [
        "Un metrónomo solo sirve si es exactamente estable. Este programa cada clic en el reloj de Web Audio con 120 ms de antelación — la técnica de los metrónomos web profesionales — en lugar de lanzar setTimeout que se desvíe con el hilo principal. Así puede practicar de 30 a 300 BPM, en 2/4, 3/4, 4/4, 6/8 o 7/8.",
        "Ajuste el tempo con el deslizador o pulsando el ritmo que lleva en la cabeza: cuatro o más pulsaciones se promedian en un BPM. Añada subdivisiones de corchea, tresillo o semicorchea, acentúe el primer tiempo y siga los puntos del pulso mientras toca. Nada que instalar, sin cuenta, y funciona en el móvil durante las sesiones de estudio.",
      ],
      steps: [
        "Arrastre el deslizador de tempo o pulse −1 / +1 hasta el BPM deseado — o pulse el botón de tempo por pulsación cuatro veces o más siguiendo el ritmo.",
        "Elija un compás (2/4, 3/4, 4/4, 6/8, 7/8) y, si lo necesita, una subdivisión: negra, corchea, tresillo o semicorchea.",
        "Decida si el primer tiempo de cada compás lleva acento y pulse Iniciar.",
        "Toque siguiendo el pulso; los puntos sobre el BPM se iluminan en cada tiempo para que no aparte la vista de su instrumento.",
      ],
      faqs: [
        {
          q: "¿Por qué este metrónomo no se desvía como otros metrónomos web?",
          a: "La mayoría programan cada clic con setTimeout, que hereda cada atasco del hilo principal del navegador. Esta herramienta usa el patrón estándar de lookahead: un temporizador pequeño despierta cada 25 ms y programa los clics unos 120 ms adelante en el reloj de hardware de Web Audio, así el ritmo es preciso al sample y nunca acumula desvío.",
        },
        {
          q: "¿Cómo funciona el tempo por pulsación?",
          a: "Pulse el botón siguiendo el ritmo que quiere, al menos cuatro veces. La herramienta mide los intervalos entre pulsaciones, los promedia y los convierte en BPM. Si se detiene más de 3 segundos entre pulsaciones, el conteo se reinicia: esa pausa significa que empezó una frase nueva, no que mantuvo un tempo.",
        },
        {
          q: "¿Qué hace la subdivisión?",
          a: "Divide cada tiempo en pulsos iguales: negra suena un clic por tiempo, corchea dos, tresillo tres y semicorchea cuatro. Los tiempos quedan acentuados y las subdivisiones suenan más suaves, así oye exactamente dónde debe caer cada nota de un pasaje.",
        },
        {
          q: "¿Cómo se leen 6/8 y 7/8 aquí?",
          a: "En los compases x/8 el tiempo es una corchea, así que 6/8 a 120 BPM suena seis corcheas por compás. Coincide con cómo cuenta la partitura: fije el BPM a la velocidad de corchea que quiera y la longitud del compás se sigue sola.",
        },
      ],
    },
    pt: {
      name: "Metrônomo online",
      tagline:
        "Um metrônomo de navegador preciso: 30–300 BPM, cinco compassos, subdivisões e tempo por toques — agendado no relógio da Web Audio para que a batida nunca desvie.",
      intro: [
        "Um metrônomo só serve se for exatamente estável. Este agenda cada clique no relógio da Web Audio com 120 ms de antecedência — a técnica dos metrônomos web profissionais — em vez de disparar setTimeout que desvia com a thread principal. Assim você pratica de 30 a 300 BPM, em 2/4, 3/4, 4/4, 6/8 ou 7/8.",
        "Ajuste o tempo com o slider ou marcando o ritmo que tem na cabeça: quatro ou mais toques viram uma média em BPM. Adicione subdivisões de colcheia, tercina ou semicolcheia, acentue o primeiro tempo e acompanhe os pontos da batida enquanto toca. Nada para instalar, sem conta, e funciona no celular durante o estudo.",
      ],
      steps: [
        "Arraste o slider de tempo ou use −1 / +1 até o BPM desejado — ou toque o botão de tempo por toques quatro vezes ou mais no ritmo.",
        "Escolha um compasso (2/4, 3/4, 4/4, 6/8, 7/8) e, se precisar, uma subdivisão: semínima, colcheia, tercina ou semicolcheia.",
        "Decida se o primeiro tempo de cada compasso leva acento e toque em Iniciar.",
        "Toque junto; os pontos acima do BPM acendem a cada tempo para você não tirar os olhos do instrumento.",
      ],
      faqs: [
        {
          q: "Por que este metrônomo não desvia como outros metrônomos web?",
          a: "A maioria agenda cada clique com setTimeout, que hereda cada engasgo da thread principal do navegador. Esta ferramenta usa o padrão lookahead: um timer pequeno acorda a cada 25 ms e agenda os cliques uns 120 ms à frente no relógio de hardware da Web Audio, então a batida tem precisão de amostra e nunca acumula desvio.",
        },
        {
          q: "Como funciona o tempo por toques?",
          a: "Toque o botão no ritmo que quer, pelo menos quatro vezes. A ferramenta mede os intervalos entre toques, calcula a média e converte em BPM. Se você parar mais de 3 segundos entre toques, a contagem zera — a pausa significa que começou uma frase nova, não que manteve um tempo.",
        },
        {
          q: "O que faz a subdivisão?",
          a: "Divide cada tempo em pulsos iguais: semínima toca um clique por tempo, colcheia dois, tercina três e semicolcheia quatro. Os tempos ficam acentuados e as subdivisões soam mais baixas, então você ouve exatamente onde cada nota de um trecho deve cair.",
        },
        {
          q: "Como ler 6/8 e 7/8 neste metrônomo?",
          a: "Nos compassos x/8 o tempo é uma colcheia, então 6/8 a 120 BPM toca seis colcheias por compasso. É a mesma contagem da partitura: defina o BPM na velocidade da colcheia desejada e o tamanho do compasso se segue.",
        },
      ],
    },
  },
});
