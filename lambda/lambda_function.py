import json
import os
import random
import boto3
from decimal import Decimal

# Encoder customizado para converter Decimals do DynamoDB para JSON
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME) if TABLE_NAME else None

# Cabeçalhos padrão para habilitar CORS no Frontend
CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",  # Em produção, substitua pelo domínio do seu frontend
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key,X-Amz-Date",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE"
}

def build_response(status_code, body):
    """Auxiliar para formatar a resposta HTTP com cabeçalhos CORS"""
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, cls=DecimalEncoder, ensure_ascii=False)
    }

def shuffle_question_options(item):
    """Embaralha as opções e marca a alternativa correta"""
    options = item.get("options", [])
    if not options:
        return item
        
    try:
        correct_index = int(item.get("correctIndex", 0))
    except (ValueError, TypeError):
        correct_index = 0

    # Garante que o índice esteja dentro do tamanho do array
    if correct_index >= len(options):
        correct_index = 0

    # Descobre o texto da resposta correta
    correct_opt = options[correct_index]
    correct_text = correct_opt if isinstance(correct_opt, str) else correct_opt.get("text")

    formatted_options = []
    for opt in options:
        text = opt if isinstance(opt, str) else opt.get("text")
        formatted_options.append({
            "text": text,
            "isCorrect": (text == correct_text)
        })

    # Embaralha a lista de opções
    random.shuffle(formatted_options)

    item_copy = dict(item)
    item_copy["options"] = formatted_options
    return item_copy

def lambda_handler(event, context):
    print(f"Request received: {json.dumps(event)}")

    http_method = event.get("requestContext", {}).get("http", {}).get("method") or event.get("httpMethod")
    path = event.get("requestContext", {}).get("http", {}).get("path") or event.get("path", "")
    path_parameters = event.get("pathParameters") or {}

    # 1. Trata requisições Preflight do CORS (OPTIONS)
    if http_method == "OPTIONS":
        return build_response(200, {"message": "CORS preflight OK"})

    try:
        # GET /questions — Listar todas as questões (com parâmetro opcional ?shuffle=true)
        if http_method == "GET" and (path == "/questions" or path == "/questions/"):
            response = table.scan()
            items = response.get("Items", [])

            # Verifica se foi solicitado embaralhar as respostas (padrão: true)
            query_params = event.get("queryStringParameters") or {}
            should_shuffle = query_params.get("shuffle", "true").lower() == "true"

            if should_shuffle:
                items = [shuffle_question_options(item) for item in items]

            return build_response(200, items)

        # GET /questions/{id} — Consultar uma questão específica
        elif http_method == "GET" and "id" in path_parameters:
            question_id = path_parameters["id"]
            response = table.get_item(Key={"id": question_id})
            item = response.get("Item")

            if not item:
                return build_response(404, {"error": "Questão não encontrada"})

            return build_response(200, shuffle_question_options(item))

        # POST /questions — Cadastrar nova questão
        elif http_method == "POST" and "/questions" in path:
            body = json.loads(event.get("body", "{}"))
            if "id" not in body or "question" not in body or "options" not in body:
                return build_response(400, {"error": "Campos obrigatórios: id, question, options"})

            table.put_item(Item=body)
            return build_response(201, body)

        # DELETE /questions/{id} — Excluir questão
        elif http_method == "DELETE" and "id" in path_parameters:
            question_id = path_parameters["id"]
            table.delete_item(Key={"id": question_id})
            return build_response(200, {"message": f"Questão {question_id} removida com sucesso"})

        return build_response(404, {"error": "Rota não encontrada"})

    except Exception as e:
        print(f"Erro ao processar requisição: {str(e)}")
        return build_response(500, {"error": "Erro interno no servidor", "details": str(e)})
