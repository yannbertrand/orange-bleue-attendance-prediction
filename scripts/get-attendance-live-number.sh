curl -H "Host: monespace.lorangebleue.fr"\
    -H "Cookie: didomi_token=eyJ1c2VyX2lkIjoiMTlhMWMzODAtOGRkYy02NTI3LWE0OTItODMwNTI4YjczMWMyIiwiY3JlYXRlZCI6IjIwMjUtMTAtMjVUMTY6MzM6NDUuNjkzWiIsInVwZGF0ZWQiOiIyMDI1LTEwLTI1VDE2OjMzOjQ1LjY5NFoiLCJ2ZXJzaW9uIjpudWxsfQ=="\
    -H "accept: */*"\
    -H "x-public-facility-group: BRANDEDAPPNEPASSUPPRIMER-AAAD3F1070464BC09E41ADE2E48E2459"\
    -H "priority: u=3, i"\
    -H "accept-language: fr"\
    -H "x-nox-client-version: 3.77.0"\
    -H "x-nox-client-type: APP_V5"\
    -H "user-agent: Dart/3.9 (dart:io) ios/Version 26.1 (Build 23B85)"\
    -H "x-auth-token: 44274883-9187-4ebd-92f8-b92fb4fb9d3d"\
    --data-binary ""\
    -X GET --compressed\
    "https://monespace.lorangebleue.fr/nox/v1/studios/1229318070/utilization/v2/active-checkin"

# Exemple response:
# {"value":18}