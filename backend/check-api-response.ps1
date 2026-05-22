# Check API response for catalogue
try {
    Write-Host "Testing API response for catalogue..."
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
    Write-Host "SUCCESS: Found $($response.Count) resources"
    
    if ($response.Count -gt 0) {
        Write-Host "Resources in database:"
        foreach ($resource in $response) {
            Write-Host "- $($resource.name) ($($resource.type)) - $($resource.status)"
        }
    } else {
        Write-Host "No resources found in database"
    }
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
