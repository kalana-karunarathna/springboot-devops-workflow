# Clean up test resources
try {
    $resources = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
    Write-Host "Found $($resources.Count) resources to clean up..."
    
    foreach ($resource in $resources) {
        Write-Host "Deleting resource: $($resource.name)"
        Invoke-RestMethod -Uri "http://localhost:8080/api/resources/$($resource.id)" -Method Delete | Out-Null
    }
    
    Write-Host "All test resources deleted successfully!"
    
    # Verify cleanup
    $remaining = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
    Write-Host "Remaining resources: $($remaining.Count)"
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
