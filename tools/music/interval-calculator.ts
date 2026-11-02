import { IntervalCalculatorEngine } from "../_engines/engine-interval-calculator";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "interval-calculator",
  category: "utility",
  icon: "calc",
  engine: { component: IntervalCalculatorEngine },
  related: ["metronome", "tone-generator"],
  copy: {
    en: {
      name: "Interval Calculator",
      tagline:
        "Enter two frequencies and get the exact distance in semitones, the interval name, the frequency ratio and the nearest note for each — pure equal-temperament math.",
      intro: [
        "Interval questions come up constantly in music: how far apart are two pitches, what do you call that gap, how sharp is 442 Hz next to a 440 Hz reference? This calculator answers all three from one closed formula — semitone distance = 12 × log2(f2 ÷ f1) — the exact measure equal temperament is built on. Two frequencies an octave apart come out at exactly 12 semitones and a 2:1 ratio.",
        "The distance maps to the standard interval names from Unison through Octave, with anything wider expressed as a compound interval (13 semitones = Minor 2nd + 1 octave). Both frequencies are also matched to their nearest piano note with a cents deviation, so the tool doubles as a tuner readout: 440 Hz is A4 at zero cents, 442 Hz is still A4 but 8 cents sharp. Everything computes locally — nothing plays, uploads or needs an account.",
      ],
      steps: [
        "Type the lower frequency into the first field and the higher one into the second — any positive values in Hz work.",
        "Read the semitone distance and the interval name in the result cards; the direction line tells you up, down or unison.",
        "Check the ratio line to see f2 ÷ f1 — an octave is 2×, a semitone about 1.0595×.",
        "Use the nearest-notes line to see which piano keys the two frequencies sit on and how many cents each is off.",
      ],
      faqs: [
        {
          q: "How is the semitone distance computed?",
          a: "By the closed formula 12 × log2(f2 ÷ f1). In equal temperament one semitone means the higher frequency is 2^(1/12) ≈ 1.0595 times the lower one, so the logarithm of their ratio, times twelve, is exactly the number of semitones between them. The result is shown to one decimal, because real-world pitches rarely land exactly on a key.",
        },
        {
          q: "What are cents and where do they appear?",
          a: "A cent is one hundredth of a semitone. The nearest-notes line reports how far each frequency sits from its closest equal-temperament key: 442 Hz is 8 cents above A4, 415 Hz is about 2 cents below G♯4. Tuners use the same unit, so these numbers read directly like a tuner display.",
        },
        {
          q: "Why does the calculator only name intervals up to an octave?",
          a: "Distances beyond 12 semitones are compound intervals: the name wraps with the octave count, so 13 semitones reads Minor 2nd + 1 octave, 19 reads Perfect 5th + 1 octave, and 24 reads 2 octaves. That is how harmony textbooks describe wide spacings, and it keeps every result in one line.",
        },
        {
          q: "Can I use it to tune an instrument?",
          a: "As a reference, yes: type the frequency you measure or hear into one field and the target into the other — the cents deviation tells you exactly how far off you are and in which direction. The site's tone generator can produce the reference pitch itself, and the two tools make a simple tuning pair.",
        },
      ],
    },
    zh: {
      name: "音程计算器",
      tagline: "输入两个频率,得到精确的半音距离、音程名称、频率比,以及各自最近的音——纯十二平均律数学,本地即时计算。",
      intro: [
        "音程问题在音乐里随处可见:两个音差多远、这个距离叫什么、442 Hz 比标准 440 Hz 高多少?本计算器用一条封闭公式回答全部三个问题——半音距离 = 12 × log2(f2 ÷ f1)——这正是十二平均律所依赖的精确度量。相差一个八度的两个频率,结果恰好是 12 个半音、2:1 的频率比。",
        "距离会映射为从同度到八度的标准音程名称,更宽的距离按复音程表示(13 半音 = 小二度 + 1 个八度)。两个频率同时会匹配到最近的钢琴键并给出音分偏差,所以它也能当调音读数用:440 Hz 是 A4、偏差 0 音分;442 Hz 仍是 A4,但偏高 8 音分。全部本地计算——不发声、不上传、无需注册。",
      ],
      steps: [
        "把较低的频率填入第一个输入框、较高的填入第二个——任何大于 0 的 Hz 值都可以。",
        "在结果卡里读取半音距离与音程名称;方向一行告诉你向上、向下还是同度。",
        "看比率一行了解 f2 ÷ f1——八度是 2×,一个半音约 1.0595×。",
        "在最近音一行查看两个频率落在哪些钢琴键上、各自偏差多少音分。",
      ],
      faqs: [
        {
          q: "半音距离是怎么算出来的?",
          a: "用封闭公式 12 × log2(f2 ÷ f1)。在十二平均律里,一个半音意味着较高频率是较低频率的 2^(1/12) ≈ 1.0595 倍,所以比值取对数再乘以 12,就是两者之间的半音数。结果保留 1 位小数,因为现实中的音高很少正好落在键位上。",
        },
        {
          q: "音分是什么?出现在哪里?",
          a: "一个音分是百分之一 个半音。最近音一行会报告每个频率距离最近的平均律键位有多远:442 Hz 比 A4 高 8 音分,415 Hz 比 G♯4 低约 2 音分。调音器用的也是这个单位,所以这些数字可以直接当调音表读。",
        },
        {
          q: "为什么音程名称只到八度?",
          a: "超过 12 个半音的距离是复音程:名称会带上八度数——13 半音读作「小二度 + 1 个八度」,19 半音读作「纯五度 + 1 个八度」,24 半音读作「2 个八度」。和声教材就是这样描述宽间距的,这样每个结果也能保持一行。",
        },
        {
          q: "可以用它来给乐器调音吗?",
          a: "作为参考可以:把你实测或听到的频率填进一个框,目标频率填进另一个——音分偏差会精确告诉你偏高还是偏低、偏多少。本站的音调发生器可以直接发出参考音,两个工具配合就是一套简单的调音组合。",
        },
      ],
    },
    ja: {
      name: "音程計算",
      tagline:
        "2 つの周波数を入力すると、正確な半音距離・音程名・周波数比・それぞれの最近接音を表示。十二平均律の純粋な計算だけを、ローカルで即時に。",
      intro: [
        "音程の疑問は音楽に絶えず発生します。2 つの音はどれだけ離れているか、その間隔を何と呼ぶか、442 Hz は基準の 440 Hz より何セント高いか。この計算機は閉じた 1 本の式——半音距離 = 12 × log2(f2 ÷ f1)——からそのすべてに答えます。これは十二平均律の土台そのものです。オクターブ離れた 2 つの周波数は、ちょうど 12 半音・2:1 の比率になります。",
        "距離は同度からオクターブまでの標準音程名に対応し、それ以上は複音程で示します(13 半音 = 短二度 + 1 オクターブ)。両方の周波数は最近接のピアノの鍵とセント偏差にも一致するので、チューナー表示としても使えます。440 Hz は A4・偏差 0 セント、442 Hz は同じく A4 でも +8 セントです。計算はすべてローカル——音も出ず、送信もなく、アカウントも要りません。",
      ],
      steps: [
        "低い方の周波数を 1 つ目の欄に、高い方を 2 つ目に入力します。0 より大きい任意の Hz 値で構いません。",
        "結果カードで半音距離と音程名を読みます。方向の行が上向き・下向き・同度を教えます。",
        "比率の行で f2 ÷ f1 を確認します。オクターブは 2 倍、半音は約 1.0595 倍です。",
        "最近接音の行で、2 つの周波数がどの鍵の上に乗るか、それぞれ何セントずれているかを見ます。",
      ],
      faqs: [
        {
          q: "半音距離はどう計算されますか?",
          a: "閉じた式 12 × log2(f2 ÷ f1) によります。十二平均律では 1 半音とは高い周波数が低い方の 2^(1/12) ≈ 1.0595 倍であることなので、比の対数に 12 を掛けたものがちょうど半音数になります。結果は小数 1 位まで表示します。現実の音高が鍵の上にぴったり乗ることはまれだからです。",
        },
        {
          q: "セントとは何ですか?どこに現れますか?",
          a: "セントは半音の 100 分の 1 です。最近接音の行は、各周波数が最も近い平均律の鍵からどれだけずれているかを報告します。442 Hz は A4 より +8 セント、415 Hz は G♯4 より約 −2 セントです。チューナーも同じ単位を使うので、そのままチューナー表示として読めます。",
        },
        {
          q: "音程名がオクターブまでしかないのはなぜですか?",
          a: "12 半音を超える距離は複音程です。名前はオクターブ数を伴って折り返し、13 半音は「短二度 + 1 オクターブ」、19 は「完全五度 + 1 オクターブ」、24 は「2 オクターブ」と読みます。和声の教科書が広い音程を記述するやり方と同じで、すべての結果が 1 行に収まります。",
        },
        {
          q: "楽器のチューニングに使えますか?",
          a: "参照としては使えます。測った、または聞いた周波数を片方に、目標をもう片方に入力してください。セント偏差が正確にどちらへどれだけずれているかを教えます。サイトのトーンジェネレーターが基準音そのものを出せるので、2 つのツールで簡単なチューニングの組み合わせになります。",
        },
      ],
    },
    es: {
      name: "Calculadora de intervalos",
      tagline:
        "Introduzca dos frecuencias y obtenga la distancia exacta en semitonos, el nombre del intervalo, la relación de frecuencias y la nota más cercana de cada una — matemática pura del temperamento igual.",
      intro: [
        "Las preguntas de intervalos aparecen sin parar en la música: qué tan lejos están dos alturas, cómo se llama ese hueco, cuánto es más agudo 442 Hz junto a una referencia de 440 Hz. Esta calculadora responde las tres desde una fórmula cerrada — distancia en semitonos = 12 × log2(f2 ÷ f1) — la medida exacta sobre la que se construye el temperamento igual. Dos frecuencias a una octava salen con 12 semitonos exactos y relación 2:1.",
        "La distancia se traduce a los nombres estándar desde Unísono hasta Octava, y lo más ancho se expresa como intervalo compuesto (13 semitonos = Segunda menor + 1 octava). Ambas frecuencias se emparejan además con su tecla de piano más cercana y una desviación en cents, así que la herramienta sirve de lectura de afinador: 440 Hz es A4 a cero cents y 442 Hz sigue siendo A4 pero 8 cents agudo. Todo se calcula en local — no suena, no sube nada y no pide cuenta.",
      ],
      steps: [
        "Escriba la frecuencia más baja en el primer campo y la más alta en el segundo — valen cualquier valor positivos en Hz.",
        "Lea la distancia en semitonos y el nombre del intervalo en las tarjetas de resultado; la línea de dirección dice ascendente, descendente o unísono.",
        "Mire la línea de la relación para ver f2 ÷ f1 — una octava es 2×, un semitono unos 1,0595×.",
        "Use la línea de notas más cercanas para ver en qué teclas caen las dos frecuencias y cuántos cents está cada una.",
      ],
      faqs: [
        {
          q: "¿Cómo se calcula la distancia en semitonos?",
          a: "Con la fórmula cerrada 12 × log2(f2 ÷ f1). En el temperamento igual, un semitono significa que la frecuencia alta es 2^(1/12) ≈ 1,0595 veces la baja, así que el logaritmo de su relación por doce es exactamente el número de semitonos entre ellas. El resultado se muestra con un decimal, porque las alturas reales rara vez caen exactamente en una tecla.",
        },
        {
          q: "¿Qué son los cents y dónde aparecen?",
          a: "Un cent es la centésima parte de un semitono. La línea de notas más cercanas informa a qué distancia está cada frecuencia de su tecla igual-temperada más próxima: 442 Hz está 8 cents por encima de A4 y 415 Hz unos 2 cents por debajo de G♯4. Los afinadores usan la misma unidad, así que estos números se leen como la pantalla de un afinador.",
        },
        {
          q: "¿Por qué solo se nombran intervalos hasta la octava?",
          a: "Las distancias de más de 12 semitonos son intervalos compuestos: el nombre se envuelve con el número de octavas, así 13 semitonos se lee Segunda menor + 1 octava, 19 se lee Quinta justa + 1 octava y 24 se lee 2 octavas. Es como los textos de armonía describen las distancias amplias, y mantiene cada resultado en una línea.",
        },
        {
          q: "¿Sirve para afinar un instrumento?",
          a: "Como referencia, sí: escriba la frecuencia que mide o escucha en un campo y la objetivo en el otro — la desviación en cents le dice exactamente cuánto y hacia dónde está desviado. El generador de tonos del sitio puede producir la nota de referencia, y las dos herramientas forman un par de afinación sencillo.",
        },
      ],
    },
    pt: {
      name: "Calculadora de intervalos",
      tagline:
        "Informe duas frequências e receba a distância exata em semitons, o nome do intervalo, a razão de frequências e a nota mais próxima de cada uma — matemática pura do temperamento igual.",
      intro: [
        "Perguntas de intervalo aparecem o tempo todo na música: quão longe estão dois sons, como se chama esse vão, quanto 442 Hz está acima de uma referência de 440 Hz. Esta calculadora responde às três com uma fórmula fechada — distância em semitons = 12 × log2(f2 ÷ f1) — a medida exata sobre a qual o temperamento igual é construído. Duas frequências a uma oitava resultam em exatamente 12 semitons e razão 2:1.",
        "A distância vira os nomes padrão de Uníssono a Oitava, e distâncias maiores são expressas como intervalo composto (13 semitons = Segunda menor + 1 oitava). As duas frequências também são casadas com a tecla de piano mais próxima e um desvio em cents, então a ferramenta serve de leitura de afinador: 440 Hz é A4 a zero cents e 442 Hz continua A4, mas 8 cents agudo. Tudo é calculado localmente — não toca, não envia nada e não pede conta.",
      ],
      steps: [
        "Digite a frequência mais grave no primeiro campo e a mais aguda no segundo — qualquer valor positivo em Hz serve.",
        "Leia a distância em semitons e o nome do intervalo nos cartões de resultado; a linha de direção diz ascendente, descendente ou uníssono.",
        "Veja a linha da razão para conhecer f2 ÷ f1 — uma oitava é 2×, um semitom cerca de 1,0595×.",
        "Use a linha de notas mais próximas para ver em que teclas as duas frequências caem e quantos cents cada uma está desviada.",
      ],
      faqs: [
        {
          q: "Como a distância em semitons é calculada?",
          a: "Pela fórmula fechada 12 × log2(f2 ÷ f1). No temperamento igual, um semitom significa que a frequência aguda é 2^(1/12) ≈ 1,0595 vezes a grave, então o logaritmo da razão, vezes doze, é exatamente o número de semitons entre elas. O resultado aparece com um decimal, porque alturas reais raramente caem exatamente numa tecla.",
        },
        {
          q: "O que são cents e onde aparecem?",
          a: "Um cent é a centésima parte de um semitom. A linha de notas mais próximas informa a que distância cada frequência está da tecla igual-temperada mais próxima: 442 Hz está 8 cents acima de A4 e 415 Hz cerca de 2 cents abaixo de G♯4. Afinadores usam a mesma unidade, então esses números se leem como o visor de um afinador.",
        },
        {
          q: "Por que só se nomeiam intervalos até a oitava?",
          a: "Distâncias acima de 12 semitons são intervalos compostos: o nome volta com a contagem de oitavas, então 13 semitons se lê Segunda menor + 1 oitava, 19 se lê Quinta justa + 1 oitava e 24 se lê 2 oitavas. É assim que livros de harmonia descrevem espaçamentos largos, e mantém cada resultado numa linha.",
        },
        {
          q: "Dá para afinar um instrumento com isso?",
          a: "Como referência, sim: digite a frequência que você mede ou ouve num campo e a alvo no outro — o desvio em cents diz exatamente quanto e para que lado você está fora. O gerador de tons do site pode produzir a nota de referência, e as duas ferramentas formam um par de afinação simples.",
        },
      ],
    },
  },
});
