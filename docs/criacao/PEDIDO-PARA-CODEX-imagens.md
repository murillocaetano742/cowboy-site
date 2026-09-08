# Pedido para o Codex: gerar as imagens da página de conversão

Cole no chat do Codex (ChatGPT) a mensagem abaixo, tal como está. Ele já tem acesso a este repositório e à ferramenta de imagem.

---

Gere as quatro imagens descritas em `docs/criacao/briefing-imagens-conversao.md`, seguindo cada prompt em inglês exatamente como está escrito, e salve em `imagens/v4/` com os nomes indicados (`hero-varanda`, `mesa-de-cabeceira`, `casal-cozinha`, `rotina-manha`), em PNG e em WebP (quality 88, sem redimensionar). Para `rotina-manha`, use `imagens/v2/cowboy-packshot.png` como referência de identidade do frasco. Regras: nenhuma pessoa apresentada como cliente ou médico, nada explícito, nenhum texto, selo, estrela ou número dentro da imagem, nenhum "antes e depois". Não altere `cowboy-nova.html`, `assets/css/cowboy-nova.css`, `assets/js/cowboy-nova.js` nem `scripts/build-site.js`; o Claude liga as imagens na página. Ao terminar, liste os arquivos gerados com dimensões e tamanho.

---

Depois que os arquivos existirem, me avise e eu troco as imagens na página, adiciono à allowlist do build e rodo os testes.
