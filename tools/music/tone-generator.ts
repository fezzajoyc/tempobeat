import { ToneGeneratorEngine } from "../_engines/engine-tone-generator";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "tone-generator",
  category: "utility",
  icon: "sparkle",
  engine: { component: ToneGeneratorEngine },
  related: ["metronome", "interval-calculator"],
  copy: {
    en: {
      name: "Tone Generator",
      tagline:
        "Play pure tones from 20 Hz to 20 kHz — sine, square, sawtooth or triangle, with volume control, note presets and a binaural two-channel mode. Nothing to install.",
      intro: [
        "A clean test tone is surprisingly hard to find online: most sites wrap one in an app download or an ad wall. This generator synthesizes the wave live in your browser with the Web Audio API, from a 20 Hz rumble to a 20 kHz whine — the full span of nominal human hearing — with a logarithmic slider so the low end gets as much room as the top.",
        "Choose the waveform: sine for tuning and hearing checks, square and sawtooth for their bright harmonic stacks, triangle as a softer middle ground. Jump to preset pitches (A4 440 Hz, C4 261.63 Hz and friends), watch the nearest-note readout while you sweep, or switch to binaural mode, which plays slightly different frequencies into each ear channel for beat-frequency experiments.",
      ],
      steps: [
        "Drag the frequency slider or type an exact value between 20 and 20,000 Hz — the slider is logarithmic, so fine control at low frequencies stays easy.",
        "Pick a waveform and set the volume; keep it moderate, because pure tones concentrate all their energy at one frequency.",
        "Press Play. While it sounds, you can sweep the frequency, change presets or adjust volume live — or stop and press Play again.",
        "For binaural beats, enable the two-channel mode, put on headphones and set the beat frequency between the ears.",
      ],
      faqs: [
        {
          q: "What are the four waveforms good for?",
          a: "A sine wave is a single pure frequency — best for tuning instruments, testing speakers and hearing-range checks. Square and sawtooth waves contain a fundamental plus a stack of odd or all harmonics, which makes them sound bright and buzzy — handy for testing how gear handles harmonics. The triangle wave sits between: soft like a sine but with a few harmonics.",
        },
        {
          q: "Why can't I hear the top of the range?",
          a: "20 Hz–20 kHz is the nominal range of a healthy young ear. Adults typically lose the highest few kilohertz first, and speakers and laptop outputs often roll off well before 20 kHz. If a tone is inaudible, the generator is still producing it — your ear or the hardware is the limit.",
        },
        {
          q: "What does binaural mode actually do?",
          a: "It plays your chosen frequency into the left channel and a tone shifted by the beat frequency (0.5–30 Hz) into the right. Your brain perceives the difference as a slow pulsation. Headphones are required: over speakers both channels mix in the air and you hear a single tone. This tool provides the tones; claims about binaural-beat effects on focus or sleep are not settled science.",
        },
        {
          q: "Is a pure tone at high volume dangerous?",
          a: "Yes — energy concentrated at one frequency can damage hearing faster than broadband noise at the same perceived loudness, and discomfort is easy to underestimate over time. Keep the volume at the minimum you need and give your ears breaks, especially with headphones.",
        },
      ],
    },
    zh: {
      name: "音调发生器",
      tagline: "播放 20 Hz–20 kHz 的纯音:正弦、方波、锯齿、三角波,带音量控制、音高预设与双耳双声道模式。无需安装,打开即用。",
      intro: [
        "想在网上找一个干净的测试音意外地难:多数站点把它包在应用下载或广告墙里。本工具用 Web Audio API 在浏览器里实时合成波形,从 20 Hz 的低鸣到 20 kHz 的尖啸——人耳名义听域的全部跨度——滑杆走对数刻度,低频段和高频段一样好调。",
        "波形可选:调音和听力自测用正弦波;方波、锯齿波带明亮的高次谐波;三角波是更柔和的折中。可一键跳到预设音高(A4 440 Hz、C4 261.63 Hz 等),扫频时盯着「最近音」读数,或切到双耳模式——左右声道播放略有差异的两个频率,用于拍频实验。",
      ],
      steps: [
        "拖动频率滑杆或直接输入 20–20000 Hz 的精确值——滑杆是对数刻度,低频段的细调依然轻松。",
        "选择波形并调好音量;纯音把全部能量集中在一个频率上,音量请保持适中。",
        "按「播放」。发声过程中可以实时扫频、换预设或调音量,也可以随时停止。",
        "要体验双耳拍频,开启双声道模式、戴上耳机,并把两耳之间的拍频设到 0.5–30 Hz。",
      ],
      faqs: [
        {
          q: "四种波形各适合什么用途?",
          a: "正弦波是单一纯频率——最适合调音、测试音箱和听域自测。方波、锯齿波在基频之外带一叠奇次或全部谐波,听感明亮,适合测试设备对谐波的处理。三角波介于两者之间:像正弦一样柔和,又带少量谐波。",
        },
        {
          q: "为什么高频段我听不见?",
          a: "20 Hz–20 kHz 是健康年轻耳朵的名义听域。成年人通常最先失去最高的几千赫兹,音箱和笔记本输出的高频也常常远不到 20 kHz 就衰减了。听不见时,发生器仍在发出这个声音——是耳朵或硬件到了极限。",
        },
        {
          q: "双耳模式到底做了什么?",
          a: "它在左声道播放你选的频率,右声道播放偏移了拍频(0.5–30 Hz)的音,大脑会把差异感知为缓慢的脉动。必须戴耳机:用外放时两个声道在空气中混在一起,你只会听到一个音。本工具只提供声音;双耳节拍对专注或睡眠的效果并无定论。",
        },
        {
          q: "大音量纯音危险吗?",
          a: "危险——能量集中在一个频率上的声音,比同等响度的宽频噪声更容易损伤听力,而且长时间的不适感很容易被低估。音量保持在够用的最低值,给耳朵休息,戴耳机时尤其要克制。",
        },
      ],
    },
    ja: {
      name: "トーンジェネレーター",
      tagline:
        "20 Hz–20 kHz の純音を再生。正弦・矩形・鋸歯状・三角波、音量調整、音のプリセット、両チャンネル方式のバイノーラルモード付き。インストール不要ですぐ使えます。",
      intro: [
        "クリーンなテストトーンをネットで探すのは意外に難しく、多くのサイトはアプリ導入や広告の壁の向こうに置いています。このジェネレーターは Web Audio API で波形をブラウザ内でリアルタイム合成します。20 Hz の低い唸りから 20 kHz の高いノイズまで——人間の可聴域の名目上の全範囲——を、対数スライダーで低域も高域と同じ扱いやすさで操作できます。",
        "波形は用途で選びます。調律や聴力チェックには正弦波、明るい高調波の積み重ねが必要なら矩形波や鋸歯状波、より柔らかい中間なら三角波。プリセット(A4 440 Hz、C4 261.63 Hz など)に一発で飛び、スイープ中は「最も近い音」の表示を眺められます。バイノーラルモードに切り替えれば、左右の耳にわずかに違う周波数を送ってうなりを試せます。",
      ],
      steps: [
        "周波数スライダーを動かすか、20〜20000 Hz の値を直接入力します。スライダーは対数刻みなので低域の微調整も簡単です。",
        "波形を選び、音量を調整します。純音はエネルギーを単一周波数に集中させるため、音量は控えめに。",
        "「再生」を押します。鳴っている間も周波数のスイープ、プリセット変更、音量調整がリアルタイムに行えます。",
        "バイノーラルうなりを試すには、両チャンネルモードを有効にし、ヘッドフォンを着けて両耳の差(うなり周波数)を 0.5–30 Hz に設定します。",
      ],
      faqs: [
        {
          q: "4 つの波形はそれぞれ何に向いていますか?",
          a: "正弦波は単一の純粋な周波数で、調律・スピーカー試験・可聴域チェックに最適です。矩形波と鋸歯状波は基本音に奇数次またはすべての高調波を含み、明るくバズった音になるので、機器の高調波処理の確認に便利です。三角波はその中間で、正弦波のように柔らかく少数の高調波を持ちます。",
        },
        {
          q: "高域が聞こえないのはなぜですか?",
          a: "20 Hz–20 kHz は健康な若い耳の名目上の範囲です。成人ではまず最も高い数 kHz が失われ、スピーカーやノート PC の出力も 20 kHz よりずっと手前で減衰することが多いです。聞こえなくてもジェネレーターは鳴っています。限界は耳かハードウェア側にあります。",
        },
        {
          q: "バイノーラルモードは実際には何をしますか?",
          a: "左チャンネルに選択した周波数を、右チャンネルにうなり周波数(0.5–30 Hz)だけずらした音を再生し、脳がその差をゆっくりとした脈動として知覚します。ヘッドフォンが必須です。スピーカーでは 2 チャンネルが空気中で混ざり 1 つの音に聞こえます。このツールは音を提供するだけで、バイノーラルビートの集中・睡眠への効果は未確定の科学です。",
        },
        {
          q: "大音量の純音は危険ですか?",
          a: "危険です。単一周波数に集中したエネルギーは、同じ体感音量の広帯域ノイズより早く聴力を損なうことがあり、長時間の不快感は見落とされがちです。必要最低限の音量にし、特にヘッドフォンでは耳を休ませてください。",
        },
      ],
    },
    es: {
      name: "Generador de tonos",
      tagline:
        "Reproduce tonos puros de 20 Hz a 20 kHz — senoidal, cuadrada, diente de sierra o triangular, con control de volumen, notas predefinidas y modo binaural de dos canales. Nada que instalar.",
      intro: [
        "Un tono de prueba limpio es sorprendentemente difícil de encontrar en línea: la mayoría de los sitios lo esconden tras una descarga de app o un muro de anuncios. Este generador sintetiza la onda en vivo en su navegador con la Web Audio API, de un retumbe de 20 Hz a un silbido de 20 kHz — todo el rango nominal del oído humano — con un deslizador logarítmico que da al extremo grave tanto espacio como al agudo.",
        "Elija la forma de onda: senoidal para afinar y revisar la audición, cuadrada y diente de sierra por sus pilas brillantes de armónicos, triangular como término medio más suave. Salte a notas predefinidas (A4 440 Hz, C4 261,63 Hz y compañeras), observe la nota más cercana mientras barre, o active el modo binaural, que envía frecuencias ligeramente distintas a cada oído para experimentos de frecuencia de batido.",
      ],
      steps: [
        "Arrastre el deslizador de frecuencia o escriba un valor exacto entre 20 y 20 000 Hz — el deslizador es logarítmico, así que el control fino en graves sigue siendo fácil.",
        "Elija una forma de onda y ajuste el volumen; manténgalo moderado, porque los tonos puros concentran toda su energía en una frecuencia.",
        "Pulse Reproducir. Mientras suena puede barrer la frecuencia, cambiar de preset o ajustar el volumen en vivo — o detener y volver a reproducir.",
        "Para batidos binaurales, active el modo de dos canales, póngase auriculares y fije la frecuencia de batido entre ambos oídos.",
      ],
      faqs: [
        {
          q: "¿Para qué sirven las cuatro formas de onda?",
          a: "La senoidal es una única frecuencia pura — ideal para afinar instrumentos, probar altavoces y revisar el rango auditivo. La cuadrada y la diente de sierra contienen la fundamental más una pila de armónicos impares o todos, lo que las hace brillantes y zumbonas — útiles para probar cómo el equipo maneja armónicos. La triangular queda en medio: suave como la senoidal pero con algunos armónicos.",
        },
        {
          q: "¿Por qué no oigo la parte alta del rango?",
          a: "20 Hz–20 kHz es el rango nominal de un oído joven sano. Los adultos solemos perder primero los pocos kilohercios más altos, y los altavoces y salidas de portátil a menudo se atenúan mucho antes de 20 kHz. Si un tono es inaudible, el generador sigue produciéndolo — el límite está en su oído o en el hardware.",
        },
        {
          q: "¿Qué hace realmente el modo binaural?",
          a: "Reproduce su frecuencia en el canal izquierdo y un tono desplazado la frecuencia de batido (0,5–30 Hz) en el derecho. El cerebro percibe la diferencia como una pulsación lenta. Se necesitan auriculares: por altavoces ambos canales se mezclan en el aire y se oye un solo tono. Esta herramienta entrega los tonos; los efectos de los batidos binaurales sobre la concentración o el sueño no son ciencia asentada.",
        },
        {
          q: "¿Es peligroso un tono puro a volumen alto?",
          a: "Sí — la energía concentrada en una frecuencia puede dañar la audición más rápido que un ruido de banda ancha de la misma sonoridad percibida, y la molestia se subestima con facilidad al pasar el tiempo. Mantenga el volumen en el mínimo que necesite y dé descansos a sus oídos, sobre todo con auriculares.",
        },
      ],
    },
    pt: {
      name: "Gerador de tons",
      tagline:
        "Toque tons puros de 20 Hz a 20 kHz — senoidal, quadrada, dente de serra ou triangular, com controle de volume, notas predefinidas e modo binaural de dois canais. Nada para instalar.",
      intro: [
        "Um tom de teste limpo é surpreendentemente difícil de achar na internet: a maioria dos sites esconde um atrás de download de app ou mural de anúncios. Este gerador sintetiza a onda ao vivo no seu navegador com a Web Audio API, de um retumbo de 20 Hz a um apito de 20 kHz — toda a faixa nominal da audição humana — com um slider logarítmico que dá ao grave tanto espaço quanto ao agudo.",
        "Escolha a forma de onda: senoidal para afinar e checar a audição, quadrada e dente de serra pelos seus empilhados brilhantes de harmônicos, triangular como um meio-termo mais suave. Salte para notas predefinidas (A4 440 Hz, C4 261,63 Hz e companhia), acompanhe a nota mais próxima enquanto varre, ou ligue o modo binaural, que toca frequências ligeiramente diferentes em cada canal para experimentos de frequência de batimento.",
      ],
      steps: [
        "Arraste o slider de frequência ou digite um valor exato entre 20 e 20 000 Hz — o slider é logarítmico, então o controle fino nos graves continua fácil.",
        "Escolha uma forma de onda e ajuste o volume; mantenha moderado, porque tons puros concentram toda a energia numa única frequência.",
        "Toque em Reproduzir. Enquanto soa, você pode varrer a frequência, trocar de preset ou ajustar o volume em tempo real — ou parar e reproduzir de novo.",
        "Para batimentos binaurais, ative o modo de dois canais, coloque fones e defina a frequência de batimento entre os ouvidos.",
      ],
      faqs: [
        {
          q: "Para que servem as quatro formas de onda?",
          a: "A senoidal é uma única frequência pura — melhor para afinar instrumentos, testar alto-falantes e checar a faixa auditiva. A quadrada e a dente de serra contêm a fundamental mais uma pilha de harmônicos ímpares ou de todos, o que as deixa brilhantes e zumbindo — úteis para testar como o equipamento lida com harmônicos. A triangular fica no meio: suave como a senoidal, mas com alguns harmônicos.",
        },
        {
          q: "Por que não ouço o topo da faixa?",
          a: "20 Hz–20 kHz é a faixa nominal de um ouvido jovem saudável. Adultos costumam perder primeiro os poucos quilohertz mais altos, e alto-falantes e saídas de notebook frequentemente caem bem antes dos 20 kHz. Se um tom está inaudível, o gerador continua produzindo — o limite está no seu ouvido ou no hardware.",
        },
        {
          q: "O que o modo binaural realmente faz?",
          a: "Ele toca a sua frequência no canal esquerdo e um tom deslocado pela frequência de batimento (0,5–30 Hz) no direito. O cérebro percebe a diferença como uma pulsação lenta. Fones são obrigatórios: por alto-falantes os dois canais se misturam no ar e você ouve um tom só. Esta ferramenta fornece os tons; os efeitos de batimentos binaurais sobre foco ou sono não são ciência consolidada.",
        },
        {
          q: "Tom puro em volume alto é perigoso?",
          a: "Sim — energia concentrada numa única frequência pode machucar a audição mais rápido que ruído de banda larga com a mesma sonoridade percebida, e o incômodo ao longo do tempo é fácil de subestimar. Mantenha o volume no mínimo necessário e dê pausas aos ouvidos, especialmente com fones.",
        },
      ],
    },
  },
});
