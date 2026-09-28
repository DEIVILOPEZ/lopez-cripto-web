from django.http import JsonResponse

def lopez_cripto(request):
    data = {
        "status": "success",
        "app_name": "LÓPEZ CRIPTO",
        "saldos": {
            "pen": "1,250.00",
            "usd": "340.50"
        }
    }
    return JsonResponse(data)