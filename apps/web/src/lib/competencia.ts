// Helpers de competência mensal.
// mes_referencia é armazenado como DATE no primeiro dia do mês (YYYY-MM-01).

export function mesRefDe(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

export function mesAnterior(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return mesRefDe(d);
}

export function formatarMesRef(iso: string): string {
  const [y, m] = iso.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[Number(m) - 1]}/${y}`;
}

export function formatarMesRefLongo(iso: string): string {
  const [y, m] = iso.split("-");
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return `${meses[Number(m) - 1]} / ${y}`;
}

export function formatarBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function arquivoNomeRelatorio(mesRef: string): string {
  const [y, m] = mesRef.split("-");
  return `faturamento-titas-master-${y}-${m}.xlsx`;
}
