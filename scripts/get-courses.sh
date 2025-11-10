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
    "https://monespace.lorangebleue.fr/nox/v2/bookableitems/courses/with-canceled?organizationUnitIds=1229318070&benefitCategoryIds=1210007920&benefitCategoryIds=1210128340&benefitCategoryIds=1210001742&benefitCategoryIds=1210001758&benefitCategoryIds=1210001754&benefitCategoryIds=1210001778&startDate=2025-11-13&endDate=2025-11-13&courseAvailability=ALL&maxResults=10000"

# Exemple response:
# [
#   {
#     "id": 1437299345,
#     "benefitId": 1210129462,
#     "benefitBookingOptionType": "FREE_USAGE",
#     "level": "ALL",
#     "itemType": "COURSE",
#     "imageUrl": "https://assets.magicline.com/lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg?Expires=1762786800&Signature=iE8HL72MzYpe3ccyhq4Ko4bdkFhRWZ31h6sawNzC-HNUqnBzDOsStpu9381yKdqYcKTuApuMfnPcDM72NRU2xv0OENSwtxKEy6S4fF~CijZ3dJ3mGquQx~EYVUVMvj5~RfAOzS2T073jUHHdOC~pNenPS7fwZU7F2e43L8-KzLJKaxZK3r8IiymdnBvNYG15bJ~uNvla4tEMxRv6VoIkNYzl5l~b59qqc~xTCACCeZkaIMa5X5eYvOlt3R9IBFOzeAHvLHy-jImPTaDkUS07Bz~Lgh6XRIgTWt-Ky5gMwekzK6ZHG6VB9x8J05LhrfXwIwgrx4e-BJWA9tPlYOc94A__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#     "image": {
#       "bucketName": "com-magicline-tenant-assets-prod",
#       "objectKey": "lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg",
#       "id": null,
#       "url": "https://assets.magicline.com/lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg?Expires=1762786800&Signature=iE8HL72MzYpe3ccyhq4Ko4bdkFhRWZ31h6sawNzC-HNUqnBzDOsStpu9381yKdqYcKTuApuMfnPcDM72NRU2xv0OENSwtxKEy6S4fF~CijZ3dJ3mGquQx~EYVUVMvj5~RfAOzS2T073jUHHdOC~pNenPS7fwZU7F2e43L8-KzLJKaxZK3r8IiymdnBvNYG15bJ~uNvla4tEMxRv6VoIkNYzl5l~b59qqc~xTCACCeZkaIMa5X5eYvOlt3R9IBFOzeAHvLHy-jImPTaDkUS07Bz~Lgh6XRIgTWt-Ky5gMwekzK6ZHG6VB9x8J05LhrfXwIwgrx4e-BJWA9tPlYOc94A__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#     },
#     "name": "YAKO PILATES",
#     "description": "Améliore ta posture avec le Yako Pilates. C’est un cours qui te permettra de mobiliser la ceinture abdominale et le dos pour améliorer ta posture (adieu le mal de dos).",
#     "colorHex": "#eabcbb",
#     "bookedParticipants": 1,
#     "maxParticipants": 15,
#     "waitingListActive": false,
#     "waitingListParticipants": 0,
#     "maxWaitingListParticipants": 5,
#     "slots": [
#       {
#         "startDateTime": "2025-11-13T15:00:00.000+01:00[Europe/Paris]",
#         "endDateTime": "2025-11-13T15:30:00.000+01:00[Europe/Paris]",
#         "employees": [],
#         "locations": [],
#         "studio": {
#           "id": 1229318070,
#           "zoneId": "Europe/Paris",
#           "name": "Nantes La Beaujoire",
#           "description": null,
#           "email": "lorangebleuebeaujoire@gmail.com",
#           "address": {
#             "street": "Boulevard de la Beaujoire",
#             "houseNumber": "12",
#             "zip": "44300",
#             "city": "NANTES LA BEAUJOIRE",
#             "country": "France",
#             "countryCode": "FR",
#             "addition": null,
#             "latitude": 47.2592935,
#             "longitude": -1.5127731,
#             "province": null,
#             "provinceCode": null
#           },
#           "logo": {
#             "bucketName": "com-magicline-sponsorship-assets-prod",
#             "objectKey": "sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png",
#             "id": 1231351100,
#             "url": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#           },
#           "logoUrl": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#           "currencyCode": "EUR"
#         },
#         "alreadyBooked": false,
#         "onWaitingList": false,
#         "bookable": true,
#         "earliestBookingDateTime": "2025-10-29T15:00:00.000+01:00[Europe/Paris]",
#         "latestBookingDateTime": null,
#         "appointmentMeetingType": "STUDIO"
#       }
#     ],
#     "bookingInfo": {
#       "state": "FREE",
#       "money": null,
#       "benefitTrialConfigurationId": null,
#       "benefitTrialConfigurationAllowBookingForProspects": null,
#       "benefitTrialConfigurationAllowBookingForMembers": null,
#       "usable": true
#     },
#     "appointmentMeetingType": "STUDIO",
#     "bookingUrl": null,
#     "inFuture": true,
#     "appointmentStatus": "PLANNED"
#   },
#   {
#     "id": 1437299606,
#     "benefitId": 1210129461,
#     "benefitBookingOptionType": "FREE_USAGE",
#     "level": "ALL",
#     "itemType": "COURSE",
#     "imageUrl": "https://assets.magicline.com/lob/benefit-image/cefe9c16-0db0-433d-b6af-6059c2767d99.jpg?Expires=1762786800&Signature=dKjfJY-qInu-74323xQYa93iDV4qfa-hVS6TJNhP2wUEcPwOzoMfroJh47PFz5XzNpaQErrQE-yRvHjXpOm5I3w~4TSLXQnisV8y8OVQRX~lLkeYkFe7xZZMRoO5rAsFU1Nqb4UkiyAWrlNn4jidA5fHFYNMcMM7tDUJxPmE4-FIxwMWHEqebGuOSLuqTMYYpJjksERrAjLg1fCKhk8sy5IV7x5fBfcBg1TFXA35UHW7sgljCDtsTgOpwQ3rp1~MFHRApGgQ6-OR7~hcKlwY58H3HFfwCqIm9Fim4QSXONxARK3bwmyYbIvUSGHJJZXI4anjM419MV9pKhIxC~Bo3w__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#     "image": {
#       "bucketName": "com-magicline-tenant-assets-prod",
#       "objectKey": "lob/benefit-image/cefe9c16-0db0-433d-b6af-6059c2767d99.jpg",
#       "id": null,
#       "url": "https://assets.magicline.com/lob/benefit-image/cefe9c16-0db0-433d-b6af-6059c2767d99.jpg?Expires=1762786800&Signature=dKjfJY-qInu-74323xQYa93iDV4qfa-hVS6TJNhP2wUEcPwOzoMfroJh47PFz5XzNpaQErrQE-yRvHjXpOm5I3w~4TSLXQnisV8y8OVQRX~lLkeYkFe7xZZMRoO5rAsFU1Nqb4UkiyAWrlNn4jidA5fHFYNMcMM7tDUJxPmE4-FIxwMWHEqebGuOSLuqTMYYpJjksERrAjLg1fCKhk8sy5IV7x5fBfcBg1TFXA35UHW7sgljCDtsTgOpwQ3rp1~MFHRApGgQ6-OR7~hcKlwY58H3HFfwCqIm9Fim4QSXONxARK3bwmyYbIvUSGHJJZXI4anjM419MV9pKhIxC~Bo3w__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#     },
#     "name": "YAKO DÉTENTE",
#     "description": "Le Yako Détente est un cours de stretching permettant de s’étirer, de gagner en souplesse mais aussi de se détendre et de se relaxer. Tout cela, dans une ambiance calme avec de la musique douce et une lumière plus tamisée.",
#     "colorHex": "#0092ca",
#     "bookedParticipants": 0,
#     "maxParticipants": 25,
#     "waitingListActive": false,
#     "waitingListParticipants": 0,
#     "maxWaitingListParticipants": 5,
#     "slots": [
#       {
#         "startDateTime": "2025-11-13T15:30:00.000+01:00[Europe/Paris]",
#         "endDateTime": "2025-11-13T16:00:00.000+01:00[Europe/Paris]",
#         "employees": [],
#         "locations": [],
#         "studio": {
#           "id": 1229318070,
#           "zoneId": "Europe/Paris",
#           "name": "Nantes La Beaujoire",
#           "description": null,
#           "email": "lorangebleuebeaujoire@gmail.com",
#           "address": {
#             "street": "Boulevard de la Beaujoire",
#             "houseNumber": "12",
#             "zip": "44300",
#             "city": "NANTES LA BEAUJOIRE",
#             "country": "France",
#             "countryCode": "FR",
#             "addition": null,
#             "latitude": 47.2592935,
#             "longitude": -1.5127731,
#             "province": null,
#             "provinceCode": null
#           },
#           "logo": {
#             "bucketName": "com-magicline-sponsorship-assets-prod",
#             "objectKey": "sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png",
#             "id": 1231351100,
#             "url": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#           },
#           "logoUrl": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#           "currencyCode": "EUR"
#         },
#         "alreadyBooked": false,
#         "onWaitingList": false,
#         "bookable": true,
#         "earliestBookingDateTime": "2025-10-29T15:30:00.000+01:00[Europe/Paris]",
#         "latestBookingDateTime": null,
#         "appointmentMeetingType": "STUDIO"
#       }
#     ],
#     "bookingInfo": {
#       "state": "FREE",
#       "money": null,
#       "benefitTrialConfigurationId": null,
#       "benefitTrialConfigurationAllowBookingForProspects": null,
#       "benefitTrialConfigurationAllowBookingForMembers": null,
#       "usable": true
#     },
#     "appointmentMeetingType": "STUDIO",
#     "bookingUrl": null,
#     "inFuture": true,
#     "appointmentStatus": "PLANNED"
#   },
#   {
#     "id": 1437299965,
#     "benefitId": 1210129462,
#     "benefitBookingOptionType": "FREE_USAGE",
#     "level": "ALL",
#     "itemType": "COURSE",
#     "imageUrl": "https://assets.magicline.com/lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg?Expires=1762786800&Signature=iE8HL72MzYpe3ccyhq4Ko4bdkFhRWZ31h6sawNzC-HNUqnBzDOsStpu9381yKdqYcKTuApuMfnPcDM72NRU2xv0OENSwtxKEy6S4fF~CijZ3dJ3mGquQx~EYVUVMvj5~RfAOzS2T073jUHHdOC~pNenPS7fwZU7F2e43L8-KzLJKaxZK3r8IiymdnBvNYG15bJ~uNvla4tEMxRv6VoIkNYzl5l~b59qqc~xTCACCeZkaIMa5X5eYvOlt3R9IBFOzeAHvLHy-jImPTaDkUS07Bz~Lgh6XRIgTWt-Ky5gMwekzK6ZHG6VB9x8J05LhrfXwIwgrx4e-BJWA9tPlYOc94A__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#     "image": {
#       "bucketName": "com-magicline-tenant-assets-prod",
#       "objectKey": "lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg",
#       "id": null,
#       "url": "https://assets.magicline.com/lob/benefit-image/64a6b15e-1ff3-4a8f-903b-34b0b37f5c29.jpg?Expires=1762786800&Signature=iE8HL72MzYpe3ccyhq4Ko4bdkFhRWZ31h6sawNzC-HNUqnBzDOsStpu9381yKdqYcKTuApuMfnPcDM72NRU2xv0OENSwtxKEy6S4fF~CijZ3dJ3mGquQx~EYVUVMvj5~RfAOzS2T073jUHHdOC~pNenPS7fwZU7F2e43L8-KzLJKaxZK3r8IiymdnBvNYG15bJ~uNvla4tEMxRv6VoIkNYzl5l~b59qqc~xTCACCeZkaIMa5X5eYvOlt3R9IBFOzeAHvLHy-jImPTaDkUS07Bz~Lgh6XRIgTWt-Ky5gMwekzK6ZHG6VB9x8J05LhrfXwIwgrx4e-BJWA9tPlYOc94A__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#     },
#     "name": "YAKO PILATES",
#     "description": "Améliore ta posture avec le Yako Pilates. C’est un cours qui te permettra de mobiliser la ceinture abdominale et le dos pour améliorer ta posture (adieu le mal de dos).",
#     "colorHex": "#eabcbb",
#     "bookedParticipants": 6,
#     "maxParticipants": 15,
#     "waitingListActive": false,
#     "waitingListParticipants": 0,
#     "maxWaitingListParticipants": 5,
#     "slots": [
#       {
#         "startDateTime": "2025-11-13T18:30:00.000+01:00[Europe/Paris]",
#         "endDateTime": "2025-11-13T19:00:00.000+01:00[Europe/Paris]",
#         "employees": [],
#         "locations": [],
#         "studio": {
#           "id": 1229318070,
#           "zoneId": "Europe/Paris",
#           "name": "Nantes La Beaujoire",
#           "description": null,
#           "email": "lorangebleuebeaujoire@gmail.com",
#           "address": {
#             "street": "Boulevard de la Beaujoire",
#             "houseNumber": "12",
#             "zip": "44300",
#             "city": "NANTES LA BEAUJOIRE",
#             "country": "France",
#             "countryCode": "FR",
#             "addition": null,
#             "latitude": 47.2592935,
#             "longitude": -1.5127731,
#             "province": null,
#             "provinceCode": null
#           },
#           "logo": {
#             "bucketName": "com-magicline-sponsorship-assets-prod",
#             "objectKey": "sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png",
#             "id": 1231351100,
#             "url": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ"
#           },
#           "logoUrl": "https://sponsorship-assets.magicline.com/sponsorship-image/img-d0ec5e9d9cb1424da25525832cd11811.png?Expires=1762786800&Signature=JCeRcjBJL~9xbWxUSoaehWy4Q2YN0YRg3wvq1DKqPOgYG6Q7C5pPay7fJl~sBkhGdKT5bhCoeR2McKJD4T7qvEAUV3YyNBSopmd6HBLbh2QWuW0B9FlXvNs1rBk2pXZIDv8q6kMZF0X0GArG758Av9LvQ6ZUEWPGmgZqrWxOQenSHK8u7NwE1L4-DF-hVfgzuX3KoTMpgCgO0cjWZ-e~~ExvyGCqhxOlLpzqSep9Rr9bwu7Gjf~P6zOxht9pd-pHU8lihv~uQE-sD6TEs1~-E7aDu1nJGz4MrKvBXqWEsp7T2bCmDBa40Xp9Tx6CfSwh5vJThvEoUYApZlwkr1Alng__&Key-Pair-Id=APKAIYMEPHHS7SD645SQ",
#           "currencyCode": "EUR"
#         },
#         "alreadyBooked": false,
#         "onWaitingList": false,
#         "bookable": true,
#         "earliestBookingDateTime": "2025-10-29T18:30:00.000+01:00[Europe/Paris]",
#         "latestBookingDateTime": null,
#         "appointmentMeetingType": "STUDIO"
#       }
#     ],
#     "bookingInfo": {
#       "state": "FREE",
#       "money": null,
#       "benefitTrialConfigurationId": null,
#       "benefitTrialConfigurationAllowBookingForProspects": null,
#       "benefitTrialConfigurationAllowBookingForMembers": null,
#       "usable": true
#     },
#     "appointmentMeetingType": "STUDIO",
#     "bookingUrl": null,
#     "inFuture": true,
#     "appointmentStatus": "PLANNED"
#   }
# ]
