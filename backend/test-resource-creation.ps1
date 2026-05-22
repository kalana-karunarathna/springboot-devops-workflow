# Test resource creation
try {
    Write-Host "Creating a test resource..."
    $postData = @{
        name = "Main Lecture Hall"
        type = "Lecture Hall"
        capacity = 200
        location = "Main Building"
        status = "Active"
        description = "Main lecture hall for large classes"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Post -Body $postData -ContentType 'application/json'
    Write-Host "SUCCESS: Resource created with ID: $($response.id)"
    Write-Host "Name: $($response.name)"
    Write-Host "Type: $($response.type)"
    
    # Verify it was saved
    Write-Host "Verifying resource was saved..."
    $verifyResponse = Invoke-RestMethod -Uri 'http://localhost:8080/api/resources' -Method Get
    Write-Host "Total resources in database: $($verifyResponse.Count)"
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Details: $errorBody"
        } catch {
            Write-Host "Could not read error details"
        }
    }
}
