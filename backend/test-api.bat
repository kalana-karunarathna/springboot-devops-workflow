@echo off
echo Testing API connection...

curl -X POST "http://localhost:8080/api/resources" ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Test Resource\",\"type\":\"Lecture Hall\",\"capacity\":100,\"location\":\"Engineering Building\",\"status\":\"Active\",\"description\":\"Test resource for MongoDB\"}"

echo.
echo Testing GET request...
curl -X GET "http://localhost:8080/api/resources"

pause
