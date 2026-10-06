#!/usr/bin/env python3
"""Package an already-built Bluue clone; never executes a build or installs packages."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import zipfile


PROJECT = Path(__file__).resolve().parents[1]
ROOT_FILES = (
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "package.json",
    "package-lock.json",
    "eslint.config.mjs",
    "next-env.d.ts",
    "next.config.ts",
    "postcss.config.mjs",
    "tsconfig.json",
)
RESEARCH_FILES = (
    "RESEARCH.md",
    "flow.json",
    "assets-manifest.json",
    "flow-test.md",
    "VALIDATION.md",
)
SKIP_PARTS = {"node_modules", ".next", "out", "__pycache__", ".git"}

LANDING_HTML = """<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bluue — Página clonada</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f2f9fd; color: #10283e; font: 16px/1.5 system-ui, sans-serif; }
    main { width: min(100%, 640px); padding: 40px; border-radius: 24px; background: white; box-shadow: 0 12px 48px #1028550d; }
    h1 { margin: 0; color: #00aee7; font-size: 44px; letter-spacing: -.03em; }
    p { margin: 8px 0 28px; color: #617087; }
    nav { display: grid; gap: 12px; }
    a { display: block; padding: 18px 22px; border: 1px solid #dfe8f0; border-radius: 14px; color: #10283e; text-decoration: none; font-weight: 600; }
    a:first-child { background: #008ec1; color: white; border-color: #008ec1; }
    a:hover { filter: brightness(.96); }
    a:focus-visible { outline: 3px solid #8ddfff; outline-offset: 3px; }
    .instructions { margin-top: 24px; color: #617087; font-size: 13px; }
    .instructions p { margin: 12px 0 0; }
    code { font-size: 12px; color: #304d66; }
    @media (max-width: 480px) { main { padding: 28px 22px; } }
  </style>
</head>
<body>
  <main>
    <h1>Bluue</h1>
    <p>Quiz clonado · Perguntas, animações e oferta final</p>
    <nav aria-label="Arquivos e prévia da entrega">
      <a href="http://localhost:3003/quiz/v1-direto/?src=RB" target="_blank" rel="noopener">Abrir o quiz</a>
      <a href="bluue-quiz-codigo.zip" download>Baixar código editável</a>
      <a href="bluue-quiz-publicar.zip" download>Baixar versão para hospedagem</a>
    </nav>
    <div class="instructions">
      <p><strong>Pagamento não conectado.</strong> O botão de compra abre um aviso local. As respostas permanecem apenas na aba.</p>
      <p><strong>Para editar:</strong> extraia o código. Com Node.js 24 ou superior, execute <code>npm ci</code>, <code>npm run build</code> e <code>npm run preview</code>. A prévia usa a porta 3003. Mais instruções no README do pacote.</p>
      <p><strong>Para publicar:</strong> extraia a versão para hospedagem na raiz de um site estático e acesse por HTTP ou HTTPS. Preserve as pastas do ZIP.</p>
    </div>
  </main>
</body>
</html>
"""


def eligible_files(directory: Path) -> list[Path]:
    return sorted(
        path
        for path in directory.rglob("*")
        if path.is_file()
        and not path.is_symlink()
        and not SKIP_PARTS.intersection(path.relative_to(directory).parts)
        and path.name != ".DS_Store"
        and path.suffix not in {".pyc", ".tsbuildinfo"}
    )


def source_files() -> list[Path]:
    files = [PROJECT / name for name in ROOT_FILES]
    missing = [str(path.relative_to(PROJECT)) for path in files if not path.is_file()]
    if missing:
        raise SystemExit(f"Missing source files: {', '.join(missing)}")
    for name in ("src", "public", "scripts"):
        directory = PROJECT / name
        if not directory.is_dir():
            raise SystemExit(f"Missing source directory: {name}")
        files.extend(eligible_files(directory))
    for name in RESEARCH_FILES:
        path = PROJECT / "docs" / "research" / name
        if path.is_file():
            files.append(path)
        elif name != "VALIDATION.md":
            raise SystemExit(f"Missing research summary: {name}")
    return sorted(set(files))


def write_archive(target: Path, files: list[Path], relative_to: Path) -> dict[str, object]:
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            archive.write(path, path.relative_to(relative_to).as_posix())
    with zipfile.ZipFile(target) as archive:
        invalid_entry = archive.testzip()
        if invalid_entry:
            raise SystemExit(f"Archive integrity check failed: {invalid_entry}")
    return {
        "name": target.name,
        "files": len(files),
        "bytes": target.stat().st_size,
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--destination",
        type=Path,
        default=Path.home() / "Downloads" / "clone pagina quiz" / "Bluue",
        help="Folder receiving both ZIPs and the access page.",
    )
    args = parser.parse_args()
    exported = PROJECT / "out"
    for name in ("index.html", "quiz/v1-direto/index.html"):
        if not (exported / name).is_file():
            raise SystemExit(f"Missing out/{name}. Complete npm run build before packaging.")

    code_files = source_files()
    publish_files = eligible_files(exported)
    if not publish_files:
        raise SystemExit("The static export is empty; nothing was packaged.")

    delivery = PROJECT / "entrega"
    delivery.mkdir(exist_ok=True)
    args.destination.mkdir(parents=True, exist_ok=True)
    reports: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix=".packaging-", dir=delivery) as staging:
        staging_path = Path(staging)
        for name, files, base in (
            ("bluue-quiz-codigo.zip", code_files, PROJECT),
            ("bluue-quiz-publicar.zip", publish_files, exported),
        ):
            packaged = staging_path / name
            reports.append(write_archive(packaged, files, base))
        for report in reports:
            name = str(report["name"])
            archive = delivery / name
            (staging_path / name).replace(archive)
            copied = args.destination / f".{name}.tmp"
            shutil.copy2(archive, copied)
            copied.replace(args.destination / name)

    (args.destination / "index.html").write_text(LANDING_HTML, encoding="utf-8")
    print(json.dumps({"delivery": str(delivery), "organizedFolder": str(args.destination), "archives": reports}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
