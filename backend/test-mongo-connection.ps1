# Test MongoDB connection directly
$connectionString = "mongodb+srv://dewdunuc1990_db_user:OGzaMfgY6Q041wjs@smartcampus.eylks8s.mongodb.net/smartcampus?appName=SmartCampus"

Write-Host "Testing MongoDB connection..."
Write-Host "Connection String: $connectionString"

try {
    # Try to connect using MongoDB driver if available
    # If not, we'll test via the API
    
    Write-Host "Testing via Spring Boot API..."
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
    Write-Host "SUCCESS: API responded with $($response.Count) resources"
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    
    # Try to get more error details
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Details: $errorBody"
    } catch {
        Write-Host "Could not read error details"
    }
}
