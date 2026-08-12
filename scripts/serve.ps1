param(
  [int]$Port = 4173,
  [string]$Root = (Join-Path $PSScriptRoot "..\dist")
)

$ErrorActionPreference = "Stop"
$rootPath = [IO.Path]::GetFullPath($Root)

if (!(Test-Path -LiteralPath $rootPath -PathType Container)) {
  throw "미리보기 폴더를 찾을 수 없습니다: $rootPath"
}

$listener = [Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Carrier GreenON preview: http://127.0.0.1:$Port/"
Write-Host "종료하려면 Ctrl+C를 누르세요."

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($relativePath)) {
      $relativePath = "index.html"
    }

    $filePath = [IO.Path]::GetFullPath((Join-Path $rootPath $relativePath))
    if (!$filePath.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase) -or
        !(Test-Path -LiteralPath $filePath -PathType Leaf)) {
      # 해시 기반 화면 전환 앱이므로 실제 파일이 없는 경로는 index.html로 돌려줍니다.
      $filePath = Join-Path $rootPath "index.html"
    }

    $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $context.Response.ContentType = switch ($extension) {
      ".html" { "text/html; charset=utf-8" }
      ".css" { "text/css; charset=utf-8" }
      ".js" { "text/javascript; charset=utf-8" }
      ".svg" { "image/svg+xml" }
      ".png" { "image/png" }
      default { "application/octet-stream" }
    }

    $bytes = [IO.File]::ReadAllBytes($filePath)
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
