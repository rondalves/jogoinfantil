/**
 * Senha da area dos adultos: de 4 a 8 numeros, criada pelo proprio adulto na
 * primeira vez. Vale para o painel dos pais e para liberar mais joguinho.
 * Fica so no aparelho, fora dos perfis: zerar ou apagar um perfil nao a apaga.
 */
const CHAVE = 'missoes-do-dia:senha';
export const MINIMO = 4;
export const MAXIMO = 8;

export const senhaValida = (s: string) => s.length >= MINIMO && s.length <= MAXIMO && /^\d+$/.test(s);

/**
 * shortcut: senha de 4 a 8 numeros com hash ainda se descobre testando todas;
 * o hash so tira do texto puro uma senha que o adulto pode repetir de outro lugar.
 */
export async function resumo(senha: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`rotinafeliz:${senha}`));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function guardada() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}
export const temSenha = () => !!guardada();

export async function gravarSenha(senha: string) {
  localStorage.setItem(CHAVE, await resumo(senha));
}

export const senhaCerta = async (senha: string) => (await resumo(senha)) === guardada();
