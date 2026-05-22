# Test complete search functionality
Write-Host "Testing complete search functionality..."

# Test 1: Search by term
Write-Host "`n1. Search by term 'B402':"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?searchTerm=B402' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test 2: Filter by type
Write-Host "`n2. Filter by type 'Meeting Room':"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?type=Meeting Room' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test 3: Filter by location
Write-Host "`n3. Filter by location 'Main Building':"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?location=Main Building' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test 4: Filter by status
Write-Host "`n4. Filter by status 'Active':"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?status=Active' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test 5: Combined filters
Write-Host "`n5. Combined filters (type=Lecture Hall & status=Active):"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search?type=Lecture Hall&status=Active' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test 6: Empty search (should return all)
Write-Host "`n6. Empty search (should return all):"
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources/search' -Method Get
    Write-Host "   Found $($response.Count) resources"
    $response | ForEach-Object { Write-Host "   - $($_.name)" }
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`nSearch functionality test completed!"
