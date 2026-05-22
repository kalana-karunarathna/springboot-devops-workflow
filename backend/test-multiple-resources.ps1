# Test creating multiple resources
Write-Host "Testing multiple resource creation..."

# Check current resources
Write-Host "Current resources:"
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
Write-Host "Found $($response.Count) resources"
$response | ForEach-Object { Write-Host "- $($_.name) (ID: $($_.id))" }

# Create first new resource
Write-Host "`nCreating first new resource..."
$resource1 = @{
    name = "Test Resource 1"
    type = "Lecture Hall"
    capacity = 100
    location = "Engineering Building"
    status = "Active"
    description = "First test resource"
} | ConvertTo-Json

try {
    $result1 = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Post -Body $resource1 -ContentType 'application/json'
    Write-Host "SUCCESS: Created resource 1 with ID: $($result1.id)"
} catch {
    Write-Host "ERROR creating resource 1: $($_.Exception.Message)"
}

# Check resources after first creation
Write-Host "`nResources after first creation:"
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
Write-Host "Found $($response.Count) resources"
$response | ForEach-Object { Write-Host "- $($_.name) (ID: $($_.id))" }

# Create second new resource
Write-Host "`nCreating second new resource..."
$resource2 = @{
    name = "Test Resource 2"
    type = "Lab"
    capacity = 50
    location = "Business Management Building"
    status = "Active"
    description = "Second test resource"
} | ConvertTo-Json

try {
    $result2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Post -Body $resource2 -ContentType 'application/json'
    Write-Host "SUCCESS: Created resource 2 with ID: $($result2.id)"
} catch {
    Write-Host "ERROR creating resource 2: $($_.Exception.Message)"
}

# Check final resources
Write-Host "`nFinal resources:"
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
Write-Host "Found $($response.Count) resources"
$response | ForEach-Object { Write-Host "- $($_.name) (ID: $($_.id))" }
