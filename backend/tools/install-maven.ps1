$ErrorActionPreference = 'Stop'

$version = '3.9.9'
$baseDir = Split-Path -Parent $PSScriptRoot
$installRoot = Join-Path $baseDir '.tools'
$mavenDir = Join-Path $installRoot "apache-maven-$version"
$zipPath = Join-Path $installRoot "apache-maven-$version-bin.zip"
$downloadUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$version/apache-maven-$version-bin.zip"

New-Item -ItemType Directory -Force -Path $installRoot | Out-Null

if (-not (Test-Path $mavenDir)) {
  Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
  Expand-Archive -Path $zipPath -DestinationPath $installRoot -Force
  Remove-Item $zipPath -Force
}

$mvnCmd = Join-Path $mavenDir 'bin\mvn.cmd'
if (-not (Test-Path $mvnCmd)) {
  throw "Maven installation failed: $mvnCmd was not found."
}

Write-Host "Maven installed at $mavenDir"
Write-Host "Use backend\\mvnw.cmd from the backend folder to run it."
