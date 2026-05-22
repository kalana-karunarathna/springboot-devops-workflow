# Test search API functionality
Write-Host "Testing search API..."

# First create a test resource
Write-Host "Creating test resource..."
$resourceData = @{
    name = "Main Lecture Hall"
    type = "Lecture Hall"
    capacity = 200
    location = "Main Building"
    status = "Active"
    description = "Main lecture hall for testing"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Post -Body $resourceData -ContentType 'application/json'
    Write-Host "Created resource: $($createResponse.name)"
} catch {
    Write-Host "Error creating resource: $($_.Exception.Message)"
}

# Test search by name
Write-Host "`nTesting search by name 'Lecture'..."
try {
    $searchResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?searchTerm=Lecture' -Method Get
    Write-Host "Search by 'Lecture' found $($searchResponse.Count) resources"
    $searchResponse | ForEach-Object { Write-Host "- $($_.name)" }
} catch {
    Write-Host "Search error: $($_.Exception.Message)"
}

# Test filter by type
Write-Host "`nTesting filter by type 'Lecture Hall'..."
try {
    $filterResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?type=Lecture Hall' -Method Get
    Write-Host "Filter by 'Lecture Hall' found $($filterResponse.Count) resources"
    $filterResponse | ForEach-Object { Write-Host "- $($_.name)" }
} catch {
    Write-Host "Filter error: $($_.Exception.Message)"
}

# Test combined search and filter
Write-Host "`nTesting combined search 'Main' with type 'Lecture Hall'..."
try {
    $combinedResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?searchTerm=Main&type=Lecture Hall' -Method Get
    Write-Host "Combined search found $($combinedResponse.Count) resources"
    $combinedResponse | ForEach-Object { Write-Host "- $($_.name)" }
} catch {
    Write-Host "Combined search error: $($_.Exception.Message)"
}
