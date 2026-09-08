[CmdletBinding()]
param(
    [ValidateSet('Table', 'Json')]
    [string]$Format = 'Table',
    [switch]$Validate
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$ledgerPath = Join-Path $repositoryRoot 'docs\governanca\status-ledger.json'

if (-not (Test-Path -LiteralPath $ledgerPath -PathType Leaf)) {
    throw "Ledger nao encontrado: $ledgerPath"
}

$ledger = Get-Content -Raw -Encoding UTF8 -LiteralPath $ledgerPath | ConvertFrom-Json

if ($Validate) {
    $errors = [System.Collections.Generic.List[string]]::new()
    $requiredTopLevel = @('schema_version', 'project', 'company_id', 'deadline', 'snapshot_at', 'runtime', 'offer', 'allowed_states', 'work_items')

    foreach ($propertyName in $requiredTopLevel) {
        if ($null -eq $ledger.PSObject.Properties[$propertyName]) {
            $errors.Add("Campo obrigatorio ausente: $propertyName")
        }
    }

    $allowedStates = @($ledger.allowed_states)
    $seenIds = @{}
    foreach ($item in @($ledger.work_items)) {
        if ([string]::IsNullOrWhiteSpace($item.id)) {
            $errors.Add('Item sem id.')
        } elseif ($seenIds.ContainsKey($item.id)) {
            $errors.Add("ID duplicado: $($item.id)")
        } else {
            $seenIds[$item.id] = $true
        }

        if ($allowedStates -notcontains $item.state) {
            $errors.Add("Estado invalido em $($item.id): $($item.state)")
        }

        $parsedTimestamp = [DateTimeOffset]::MinValue
        if (-not [DateTimeOffset]::TryParse([string]$item.updated_at, [ref]$parsedTimestamp)) {
            $errors.Add("updated_at invalido em $($item.id): $($item.updated_at)")
        }

        if (@($item.evidence).Count -eq 0) {
            $errors.Add("Item sem evidencia: $($item.id)")
        }
    }

    foreach ($item in @($ledger.work_items)) {
        foreach ($dependency in @($item.dependencies)) {
            if ($dependency -match '^[A-Z]+-[0-9]+$' -and -not $seenIds.ContainsKey($dependency)) {
            $errors.Add("Dependencia desconhecida em $($item.id): $dependency")
            }
        }
    }

    $expectedTotals = @{ 1 = 54.76; 2 = 84.76; 3 = 127.14; 4 = 169.52 }
    foreach ($tier in @($ledger.offer.tiers)) {
        $quantity = [int]$tier.quantity
        if (-not $expectedTotals.ContainsKey($quantity)) {
            $errors.Add("Quantidade inesperada na oferta: $quantity")
            continue
        }
        if ([math]::Abs([double]$tier.total - [double]$expectedTotals[$quantity]) -gt 0.001) {
            $errors.Add("Total incorreto para $quantity frasco(s): $($tier.total)")
        }
        $expectedUnit = if ($quantity -eq 1) { 54.76 } else { 42.38 }
        if ([math]::Abs([double]$tier.unit_price - $expectedUnit) -gt 0.001) {
            $errors.Add("Preco unitario incorreto para $quantity frasco(s): $($tier.unit_price)")
        }
    }

    if ([int]$ledger.runtime.observed_active_workers -gt [int]$ledger.runtime.worker_capacity) {
        $errors.Add('Workers observados excedem a capacidade declarada.')
    }

    if ($errors.Count -gt 0) {
        $errors | ForEach-Object { Write-Error $_ }
        exit 1
    }

    Write-Output "VALID: $ledgerPath"
    Write-Output "Snapshot: $($ledger.snapshot_at)"
    Write-Output "Itens: $(@($ledger.work_items).Count)"
    exit 0
}

if ($Format -eq 'Json') {
    $ledger | ConvertTo-Json -Depth 10
    exit 0
}

Write-Output "COWBOY Energia - snapshot $($ledger.snapshot_at)"
Write-Output "Runtime: $($ledger.runtime.kind); workers $($ledger.runtime.observed_active_workers)/$($ledger.runtime.worker_capacity); persistente=$($ledger.runtime.persistent_harness_installed)"
$ledger.work_items |
    Select-Object id, title, agent, model, state, updated_at |
    Format-Table -AutoSize
