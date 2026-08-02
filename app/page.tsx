"use client";

import { useEffect, useMemo, useState } from "react";

type Track = { title: string; musicAuthor: string; lyricsAuthor: string; noLyrics: boolean };
type Contract = {
  contractDate: string;
  contractNumber: string;
  tariff: string;
  artistShare: number;
  releaseType: string;
  workTitle: string;
  pseudonym: string;
  licensorName: string;
  passportSeriesNumber: string;
  passportIssuedBy: string;
  passportIssueDate: string;
  bankDetails: string;
  email: string;
  musicAuthor: string;
  lyricsAuthor: string;
  noLyrics: boolean;
  tracks: Track[];
  rightsConfirmed: boolean;
};

const initial: Contract = {
  // Keep the server render deterministic. The creation date is filled after mount.
  contractDate: "",
  contractNumber: "DM-2026-____",
  tariff: "",
  artistShare: 0,
  releaseType: "Сингл",
  workTitle: "",
  pseudonym: "",
  licensorName: "",
  passportSeriesNumber: "",
  passportIssuedBy: "",
  passportIssueDate: "",
  bankDetails: "",
  email: "",
  musicAuthor: "",
  lyricsAuthor: "",
  noLyrics: false,
  tracks: [{ title: "", musicAuthor: "", lyricsAuthor: "", noLyrics: false }],
  rightsConfirmed: false,
};

function normalizeTracks(raw: unknown, legacy: Partial<Contract> = {}): Track[] {
  const source = Array.isArray(raw) && raw.length ? raw : [{
    title: legacy.workTitle || "",
    musicAuthor: legacy.musicAuthor || "",
    lyricsAuthor: legacy.lyricsAuthor || "",
    noLyrics: Boolean(legacy.noLyrics),
  }];
  return source.map((item) => {
    const value = item && typeof item === "object" ? item as Partial<Track> : {};
    return {
      title: String(value.title || ""),
      musicAuthor: String(value.musicAuthor || ""),
      lyricsAuthor: String(value.lyricsAuthor || ""),
      noLyrics: Boolean(value.noLyrics),
    };
  });
}

const sections = [
  { id: "objects", number: "01", label: "Объекты" },
  { id: "licensor", number: "02", label: "Лицензиар" },
  { id: "authors", number: "03", label: "Авторы" },
  { id: "terms", number: "04", label: "Условия" },
  { id: "details", number: "05", label: "Реквизиты" },
];

function formatDate(value: string) {
  if (!value) return "«___» __________ 2026 г.";
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

function display(value: string, fallback = "________________") {
  return value.trim() || fallback;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SectionTitle({ number, title, caption }: { number: string; title: string; caption: string }) {
  return <div className="section-title"><span className="section-number">{number}</span><div><h2>{title}</h2><p>{caption}</p></div></div>;
}

function DocumentPreview({ data }: { data: Contract }) {
  const tracks = data.tracks.filter((track) => track.title.trim());
  const objects: Track[] = tracks.length ? tracks : [{
    title: data.workTitle,
    musicAuthor: data.musicAuthor,
    lyricsAuthor: data.lyricsAuthor,
    noLyrics: data.noLyrics,
  }];
  return <article className="paper" id="document-preview">
    <header className="paper-header"><h1>ЛИЦЕНЗИОННЫЙ ДОГОВОР DREAM MOTION</h1><div className="paper-contract-number">№ {display(data.contractNumber, "ОБРАЗЕЦ")}</div><div className="paper-meta"><span>г. Санкт-Петербург</span><span>Дата договора: {formatDate(data.contractDate)}</span></div></header>
    <p className="indent"><b>{display(data.licensorName)}</b> (паспорт: {display(data.passportSeriesNumber)}, выдан {display(data.passportIssuedBy)}, дата выдачи {formatDate(data.passportIssueDate)}), именуемый в дальнейшем «Лицензиар», с одной стороны, и Индивидуальный предприниматель Орехов Данила Александрович (ОГРНИП 324710000080681), именуемый в дальнейшем «Лицензиат», с другой стороны, совместно именуемые «Стороны», заключили настоящий договор о нижеследующем.</p>
    <h3>1. ТЕРМИНЫ И ПРЕДМЕТ ДОГОВОРА</h3><p><b>1.1.</b> Объекты — указанные в Приложении № 1 музыкальные произведения, тексты, исполнения, фонограммы, обложка и относящиеся к релизу метаданные.</p><p><b>1.2.</b> Лицензиар предоставляет Лицензиату исключительную лицензию исключительно в отношении способов цифровой дистрибуции, прямо перечисленных в разделе 2 Договора, а Лицензиат принимает Объекты и выплачивает вознаграждение. Права и способы использования, прямо не указанные в Договоре, Лицензиату не предоставляются.</p><p><b>1.3.</b> Территория использования — все страны мира. Первоначальный срок лицензии составляет четыре года с момента подписания Договора обеими Сторонами.</p>
    <h3>2. СПОСОБЫ ИСПОЛЬЗОВАНИЯ</h3><p><b>2.1.</b> Лицензиат вправе воспроизводить Объекты в объёме, необходимом для загрузки, хранения, кодирования, технической проверки и доставки цифровым платформам.</p><p><b>2.2.</b> Лицензиат вправе распространять цифровые экземпляры, доводить Объекты до всеобщего сведения, предоставлять потоковое прослушивание и скачивание, а также совершать через цифровые платформы и их сервисы иные технически необходимые действия, непосредственно связанные с цифровой дистрибуцией.</p><p><b>2.3.</b> Допускаются техническая адаптация формата и громкости без изменения творческого содержания, включение Объектов в каталоги, плейлисты, пользовательские видео и системы идентификации контента, а также использование обложки, метаданных и фрагментов Объектов продолжительностью до 60 секунд для продвижения релиза.</p><p><b>2.4.</b> Лицензиат вправе выдавать сублицензии цифровым платформам, агрегаторам, дистрибьюторам, организациям по управлению правами и техническим партнёрам только в целях исполнения Договора.</p>
    <h3>3. ПЕРЕДАЧА И РАЗМЕЩЕНИЕ РЕЛИЗА</h3><p><b>3.1.</b> Объекты считаются переданными и принятыми после загрузки через сайт или иную информационную систему Лицензиата и подписания Приложения № 1.</p><p><b>3.2.</b> Срок обработки и подготовки релиза к доставке начинается с момента подписания Договора обеими Сторонами и определяется согласованными условиями. Лицензиат самостоятельно определяет цифровые платформы, дату технической доставки и формат размещения.</p><p><b>3.3.</b> Лицензиат не гарантирует принятие релиза каждой платформой, конкретное количество прослушиваний, редакционную поддержку или размер дохода.</p>
    <h3>4. ВОЗНАГРАЖДЕНИЕ И ОТЧЁТНОСТЬ</h3><p><b>4.1.</b> Доля Лицензиара и минимальная сумма выплаты определены в Дополнительном соглашении, являющемся частью Договора.</p><p><b>4.2.</b> Вознаграждение рассчитывается от чистых поступлений, фактически полученных Лицензиатом от использования Объектов, после удержанных цифровыми платформами комиссий, налогов, возвратов и расходов на конвертацию валюты.</p><p><b>4.3.</b> По запросу Лицензиара Лицензиат предоставляет отчёт не позднее 30 рабочих дней с даты получения запроса.</p><p><b>4.4.</b> Выплата производится в рублях в течение 30 рабочих дней после получения запроса и достижения установленной минимальной суммы. Остаток ниже порога переносится на следующие периоды.</p>
    <h3>5. ГАРАНТИИ И ПРЕТЕНЗИИ</h3><p><b>5.1.</b> Лицензиар гарантирует, что обладает в полном объёме исключительными имущественными правами на все передаваемые Объекты, включая музыкальные произведения, тексты, исполнения, фонограммы, обложку и иные материалы релиза.</p><p><b>5.2.</b> Указанные права не отчуждены, не заложены и не обременены ранее выданными лицензиями, препятствующими исполнению Договора.</p><p><b>5.3.</b> Лицензиар гарантирует достоверность сведений об авторах и исполнителях, а также законность использованных фонограмм, семплов, текстов, изображений и иных материалов.</p>
    <h3>6. СРОК И ПРЕКРАЩЕНИЕ</h3><p><b>6.1.</b> Обычное одностороннее досрочное расторжение до истечения первоначального четырёхлетнего срока не допускается.</p><p><b>6.2.</b> После первоначального четырёхлетнего срока Договор автоматически продлевается каждый раз на один год, если Лицензиар не направит через систему тикетов уведомление об отказе от продления не позднее чем за 30 календарных дней.</p><p><b>6.3.</b> В уведомлении об отказе от продления Лицензиар указывает выбранный способ прекращения распространения: удаление Объектов либо их перенос к другому дистрибьютору.</p>
    <h3>7. ПОДПИСАНИЕ ДОГОВОРА</h3><p><b>7.1.</b> Договор заключается в письменной форме и подписывается Сторонами собственноручно. Каждый экземпляр, подписанный Стороной, имеет одинаковую юридическую силу.</p><p><b>7.2.</b> Датой договора считается дата его создания, указанная в заголовке документа. Изменения и дополнения оформляются в письменной форме и подписываются обеими Сторонами.</p><p><b>7.3.</b> Подписанный экземпляр передаётся другой Стороне по электронной почте или иным согласованным способом.</p>
    <h3>8. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h3><p><b>8.1.</b> К Договору применяется законодательство Российской Федерации. До обращения в суд Сторона направляет претензию, срок ответа — 15 рабочих дней.</p><p><b>8.2.</b> Персональные данные обрабатываются в объёме, необходимом для заключения и исполнения Договора, расчётов и выполнения требований законодательства.</p><p><b>8.3.</b> Приложение № 1 имеет приоритет в части состава и идентификации Объектов, Дополнительное соглашение — в части условий выплаты, доли Лицензиара и минимальной суммы выплаты.</p>
    <h3>9. РЕКВИЗИТЫ И ПОДПИСИ</h3><div className="signature-grid"><div><span>ЛИЦЕНЗИАР</span><strong>{display(data.licensorName)}</strong><p>Паспорт: {display(data.passportSeriesNumber)}<br />Выдан: {display(data.passportIssuedBy)}<br />Дата выдачи: {formatDate(data.passportIssueDate)}<br />Банковские реквизиты: {display(data.bankDetails)}<br />Email: {display(data.email)}</p><i>________________ / подпись</i></div><div><span>ЛИЦЕНЗИАТ</span><strong>ИП Орехов Данила Александрович</strong><p>ИНН 711613056345<br />ОГРНИП 324710000080681<br />Email: support@dreammotion.digital</p><i>________________ / подпись</i></div></div>
    <div className="paper-break" />
    <h1 className="appendix-title">ПРИЛОЖЕНИЕ № 1<br /><small>к договору DREAM MOTION № {display(data.contractNumber, "ОБРАЗЕЦ")}</small></h1><h2>ПЕРЕЧЕНЬ И АКТ ПЕРЕДАЧИ ОБЪЕКТОВ</h2><p><b>Релиз:</b> {display(data.workTitle)}. <b>Исполнитель:</b> {display(data.pseudonym)}. <b>Тип:</b> {data.releaseType}.</p><table className="objects"><thead><tr><th>№</th><th>Название и версия</th><th>Исполнители</th><th>Автор текста</th><th>Автор музыки</th></tr></thead><tbody>{objects.map((track, index) => <tr key={`${track.title}-${index}`}><td>{index + 1}</td><td>{display(track.title, "Название трека")}</td><td>{display(data.pseudonym)}</td><td>{track.noLyrics ? "Инструментал" : display(track.lyricsAuthor)}</td><td>{display(track.musicAuthor)}</td></tr>)}</tbody></table><p><b>1.</b> Лицензиар передал, а Лицензиат принял перечисленные Объекты и сведения о них через информационную систему Лицензиата.</p><p><b>2.</b> Лицензиар подтверждает достоверность перечня и принадлежность ему прав, необходимых для предоставления лицензии по Договору.</p><p><b>3.</b> Приложение составлено в письменной форме и является неотъемлемой частью Договора.</p>
    <div className="paper-break" /><h1 className="appendix-title">ДОПОЛНИТЕЛЬНОЕ СОГЛАШЕНИЕ<br /><small>к договору DREAM MOTION № {display(data.contractNumber, "ОБРАЗЕЦ")}</small></h1><p><b>1.</b> Для релиза «{display(data.workTitle)}» применяются индивидуальные условия.</p><p><b>2.</b> Вознаграждение Лицензиара составляет <b>{data.artistShare}%</b> чистых поступлений, рассчитанных в соответствии с разделом 4 Договора.</p><p><b>3.</b> Минимальная накопленная сумма для выплаты определяется Сторонами отдельно.</p><p><b>4.</b> Невыплаченный остаток сохраняется за Лицензиаром и переносится на следующие расчётные периоды.</p><div className="signature-grid"><div><span>ЛИЦЕНЗИАР</span><strong>{display(data.licensorName)}</strong><i>________________ / подпись</i></div><div><span>ЛИЦЕНЗИАТ</span><strong>ИП Орехов Данила Александрович</strong><i>________________ / подпись</i></div></div>
  </article>;
}

export default function Home() {
  const [data, setData] = useState<Contract>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState("objects"); const [savedAt, setSavedAt] = useState(""); const [toast, setToast] = useState("");
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    let saved: Partial<Contract> = {};
    try {
      const raw = window.localStorage.getItem("pfv-contract-draft");
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object") saved = parsed as Partial<Contract>;
    } catch { /* Ignore an invalid local draft and use the blank contract. */ }
    const hydrateTimeout = window.setTimeout(() => {
      const savedTariff = typeof saved.tariff === "string" ? saved.tariff.trim() : "";
      const oldPreset = ["Премиум", "Стандарт", "Базовый", "Индивидуальные условия"].includes(savedTariff);
      setData({ ...initial, ...saved, tariff: oldPreset ? "" : savedTariff, contractDate: today, tracks: normalizeTracks(saved.tracks, saved) });
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrateTimeout);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => { window.localStorage.setItem("pfv-contract-draft", JSON.stringify(data)); setSavedAt(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })); }, 350);
    return () => window.clearTimeout(timeout);
  }, [data, hydrated]);
  const update = <K extends keyof Contract>(key: K, value: Contract[K]) => setData((current) => ({ ...current, [key]: value }));
  const completeness = useMemo(() => { const hasTrackAuthors = data.tracks.some((track) => track.title.trim() && track.musicAuthor.trim() && (track.noLyrics || track.lyricsAuthor.trim())); const required = [data.workTitle, data.pseudonym, data.licensorName, data.passportSeriesNumber, data.email, hasTrackAuthors ? "yes" : ""]; return Math.round(required.filter(Boolean).length / required.length * 100); }, [data]);
  const jumpTo = (id: string) => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const exportDraft = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${data.contractNumber || "dream-motion-contract"}.json`; link.click(); URL.revokeObjectURL(url); showToast("Черновик сохранён в файл"); };
  return <main className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark">ДО</div><div><strong>Договоры</strong><span>Заполнение документа</span></div></div><div className="top-actions"><span className="saved-state"><span className="status-dot" />{savedAt ? `Сохранено в ${savedAt}` : "Автосохранение"}</span><button className="ghost-button" onClick={exportDraft}>Экспорт черновика</button><button className="primary-button" onClick={() => window.print()}>Печать / PDF</button></div></header>
    <div className="workspace"><aside className="sidebar"><div className="sidebar-intro"><span className="eyebrow">ЛИЦЕНЗИОННЫЙ ДОГОВОР</span><h1>Заполнение<br /><em>документа</em></h1><p>Заполните данные сторон, произведения и условия выплаты.</p></div><div className="progress-card"><div className="progress-head"><span>Заполнено</span><b>{completeness}%</b></div><div className="progress-track"><span style={{ width: `${completeness}%` }} /></div><small>Черновик сохраняется на этом устройстве</small></div><nav className="steps-nav" aria-label="Разделы договора">{sections.map((section) => <button key={section.id} className={active === section.id ? "active" : ""} onClick={() => jumpTo(section.id)}><span>{section.number}</span>{section.label}<i>→</i></button>)}</nav><div className="tip-card"><span>i</span><div><b>Структура документа</b><p>Основной договор, приложение с объектами и условия выплаты.</p></div></div><div className="sidebar-foot">Лицензионный договор<br /><span>Версия от 30.07.2026</span></div></aside>
      <section className="form-column"><div className="mobile-doc-actions"><button onClick={() => document.getElementById("document-preview")?.scrollIntoView({ behavior: "smooth" })}>Посмотреть договор ↓</button></div>
        <section className="form-section" id="objects"><SectionTitle number="01" title="Объекты договора" caption="Название релиза и треки для Приложения № 1" /><div className="form-grid two"><Field label="Название релиза" value={data.workTitle} onChange={(value) => update("workTitle", value)} placeholder="Например, Последний танец" /><Field label="Исполнитель / псевдоним" value={data.pseudonym} onChange={(value) => update("pseudonym", value)} placeholder="Как указать в договоре" /><label className="field"><span>Тип релиза</span><select value={data.releaseType} onChange={(event) => update("releaseType", event.target.value)}><option>Сингл</option><option>EP</option><option>Альбом</option></select></label></div><div className="tracks-block"><div className="subhead"><div><b>Перечень треков</b><span>Для сингла оставьте одну строку; для EP и альбома добавьте остальные.</span></div><button className="text-button" onClick={() => update("tracks", [...data.tracks, { title: "", musicAuthor: "", lyricsAuthor: "", noLyrics: false }])}>+ Добавить трек</button></div>{data.tracks.map((track, index) => <div className="track-entry" key={index}><div className="track-row simple"><span className="track-index">{String(index + 1).padStart(2, "0")}</span><input aria-label={`Название трека ${index + 1}`} placeholder="Название трека" value={track.title} onChange={(event) => update("tracks", data.tracks.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} />{data.tracks.length > 1 && <button className="remove-button" onClick={() => update("tracks", data.tracks.filter((_, i) => i !== index))}>×</button>}</div><div className="track-authors"><input className="track-inline-input" aria-label={`Автор музыки трека ${index + 1}`} placeholder="Автор музыки / композитор" value={track.musicAuthor} onChange={(event) => update("tracks", data.tracks.map((item, i) => i === index ? { ...item, musicAuthor: event.target.value } : item))} /><input className="track-inline-input" aria-label={`Автор текста трека ${index + 1}`} placeholder="Автор текста" value={track.lyricsAuthor} onChange={(event) => update("tracks", data.tracks.map((item, i) => i === index ? { ...item, lyricsAuthor: event.target.value } : item))} /><label className="check small"><input type="checkbox" checked={track.noLyrics} onChange={(event) => update("tracks", data.tracks.map((item, i) => i === index ? { ...item, noLyrics: event.target.checked } : item))} /><span>Инструментал</span></label></div></div>)}</div></section>
        <section className="form-section" id="licensor"><SectionTitle number="02" title="Лицензиар" caption="Паспортные данные правообладателя — физического лица" /><div className="form-grid two"><Field label="ФИО полностью" value={data.licensorName} onChange={(value) => update("licensorName", value)} placeholder="Иванов Иван Иванович" /><Field label="Серия и номер паспорта" value={data.passportSeriesNumber} onChange={(value) => update("passportSeriesNumber", value)} placeholder="0000 000000" /><Field label="Кем выдан паспорт" value={data.passportIssuedBy} onChange={(value) => update("passportIssuedBy", value)} placeholder="Отделом МВД России..." /><Field label="Дата выдачи" type="date" value={data.passportIssueDate} onChange={(value) => update("passportIssueDate", value)} /></div><div className="privacy-note"><span>i</span><p>Паспортные данные используются только в реквизитах договора.</p></div></section>
        <section className="form-section" id="authors"><SectionTitle number="03" title="Авторы и права" caption="Сведения для таблицы объектов и гарантий Лицензиара" /><p className="rights-hint">Авторы музыки и текста, а также отметка об инструментальной версии указываются отдельно для каждого трека.</p><label className="check rights-check"><input type="checkbox" checked={data.rightsConfirmed} onChange={(event) => update("rightsConfirmed", event.target.checked)} /><span>Подтверждаю наличие необходимых прав и согласий соавторов</span></label></section>
        <section className="form-section" id="terms"><SectionTitle number="04" title="Условия выплаты" caption="Укажите долю Лицензиара вручную" /><div className="form-grid two"><Field label="Название условия (необязательно)" value={data.tariff} onChange={(value) => update("tariff", value)} placeholder="Например, индивидуальные условия" /><label className="field"><span>Доля Лицензиара, %</span><input type="number" min="0" max="100" step="0.01" value={data.artistShare} onChange={(event) => update("artistShare", Number(event.target.value))} placeholder="0–100" /></label></div><div className="tariff-row"><div><span className="mini-label">В Дополнительном соглашении</span><strong>{data.tariff || "Индивидуальные условия"} · {data.artistShare}% чистых поступлений</strong></div><span className="term-note">Процент вводится вручную</span></div></section>
        <section className="form-section" id="details"><SectionTitle number="05" title="Реквизиты" caption="Данные из раздела 9 договора" /><Field label="Электронная почта" type="email" value={data.email} onChange={(value) => update("email", value)} placeholder="you@example.com" /><label className="field full"><span>Банковские реквизиты / номер карты</span><textarea value={data.bankDetails} onChange={(event) => update("bankDetails", event.target.value)} placeholder="Укажите способ получения вознаграждения" rows={3} /></label><div className="form-footer"><div><span className="secure-icon">✓</span><span>Проверьте данные перед подписанием<br /><small>Исправить данные можно в любой момент</small></span></div><button className="primary-button large" onClick={() => { showToast("Договор готов к проверке справа"); document.getElementById("document-preview")?.scrollIntoView({ behavior: "smooth" }); }}>Проверить договор <span>→</span></button></div></section>
      </section>
      <aside className="preview-column"><div className="preview-header"><div><span className="eyebrow">ПРЕДПРОСМОТР</span><h2>Лицензионный договор</h2></div><span className="preview-badge">A4 · {completeness}%</span></div><div className="preview-frame"><DocumentPreview data={data} /></div><div className="preview-note"><span>↗</span><p>В документ подставляются заполненные значения. Пустые поля остаются отмеченными линиями.</p></div></aside>
    </div>{toast && <div className="toast">✓ {toast}</div>}
  </main>;
}
