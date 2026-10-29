import json
import os
import random
import uuid
import base64
from decimal import Decimal
import boto3

cognito = boto3.client('cognito-idp')
table = boto3.resource('dynamodb').Table(os.environ.get('TABLE_NAME', 'questions'))
DEFAULTS = {
    'A': {'id': 'A', 'titulo': 'AWS Cloud Practitioner', 'access': 'public'},
    'B': {'id': 'B', 'titulo': 'Serviços AWS', 'access': 'members'},
    'C': {'id': 'C', 'titulo': 'Estrutura e funcionamento do SimulaCloud', 'access': 'admin'},
}

def response(status, body):
    return {'statusCode': status, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'}, 'body': json.dumps(body, ensure_ascii=False, default=lambda v: int(v) if isinstance(v, Decimal) and v % 1 == 0 else float(v))}

def identity(event):
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    auth = headers.get('authorization')
    if not auth:
        return 'visitor', None
    if not auth.startswith('Bearer '):
        raise PermissionError()
    token = auth[7:]
    # Cognito validates the access token before its claims are used.
    user = cognito.get_user(AccessToken=token)
    claims = json.loads(base64.urlsafe_b64decode(token.split('.')[1] + '=='))
    if claims.get('client_id') != os.environ.get('USER_POOL_CLIENT_ID'):
        raise PermissionError()
    groups = cognito.admin_list_groups_for_user(UserPoolId=os.environ['USER_POOL_ID'], Username=user['Username'])['Groups']
    names = {g['GroupName'] for g in groups}
    return ('admin' if 'Admin' in names else 'colaborador' if 'Colaborador' in names else 'basico'), user['Username']

def allowed(role, access):
    return role == 'admin' or access == 'public' or (access == 'members' and role in {'colaborador', 'basico'})

def catalog():
    return {key: {**value, **(table.get_item(Key={'id': 'SIMULADO#' + key}).get('Item') or {}), 'id': key} for key, value in DEFAULTS.items()}

def shuffle(item):
    item = dict(item)
    options = item.get('options', [])
    correct = int(item.get('correctIndex', 0))
    item['options'] = [{'text': o if isinstance(o, str) else o['text'], 'isCorrect': i == correct} for i, o in enumerate(options)]
    random.shuffle(item['options'])
    return item

def lambda_handler(event, context):
    http = event.get('requestContext', {}).get('http', {})
    method = http.get('method') or event.get('httpMethod')
    path = (http.get('path') or event.get('path', '')).rstrip('/')
    if method == 'OPTIONS':
        return response(200, {})
    try:
        role, username = identity(event)
        exams = catalog()
        if path == '/simulados' and method == 'GET':
            return response(200, [e for e in exams.values() if allowed(role, e['access'])])
        if path == '/simulados' and method == 'POST':
            if role != 'admin':
                return response(403, {'error': 'Somente o Admin pode configurar simulados'})
            body = json.loads(event.get('body') or '{}')
            if body.get('id') not in exams or body.get('access') not in {'public', 'members', 'admin'}:
                return response(400, {'error': 'Simulado ou acesso inválido'})
            table.put_item(Item={**exams[body['id']], 'id': 'SIMULADO#' + body['id'], 'access': body['access']})
            return response(200, {'message': 'Acesso atualizado'})
        if path == '/questions' and method == 'GET':
            query = event.get('queryStringParameters') or {}
            exam = query.get('simulado', 'A')
            if exam not in exams:
                return response(404, {'error': 'Simulado não encontrado'})
            if not allowed(role, exams[exam]['access']):
                return response(403, {'error': 'Sem acesso a este simulado'})
            page = table.scan()
            items = page.get('Items', [])
            while page.get('LastEvaluatedKey'):
                page = table.scan(ExclusiveStartKey=page['LastEvaluatedKey'])
                items.extend(page.get('Items', []))
            items = [i for i in items if 'question' in i and i.get('simuladoId', 'A') == exam]
            return response(200, [shuffle(i) for i in items] if query.get('shuffle', 'true').lower() == 'true' else items)
        if path == '/questions' and method == 'POST':
            if role not in {'admin', 'colaborador'}:
                return response(403, {'error': 'Somente Admin e Colaborador podem criar questões'})
            body = json.loads(event.get('body') or '{}')
            exam = body.get('simuladoId', 'A')
            options = body.get('options')
            correct = body.get('correctIndex')
            if not isinstance(body.get('question'), str) or not body['question'].strip() or not isinstance(options, list) or len(options) < 2 or not all(isinstance(o, str) and o.strip() for o in options) or type(correct) is not int or not 0 <= correct < len(options):
                return response(400, {'error': 'Informe enunciado, alternativas e resposta correta válidos'})
            if exam not in exams or not allowed(role, exams[exam]['access']):
                return response(403, {'error': 'Sem acesso a este simulado'})
            item = {k: body[k] for k in ('question', 'options', 'correctIndex', 'domain', 'explanation') if k in body}
            item.update(id=str(uuid.uuid4()), simuladoId=exam, createdBy=username)
            table.put_item(Item=item)
            return response(201, item)
        question_id = (event.get('pathParameters') or {}).get('id')
        if path.startswith('/questions/') and question_id and method in {'GET', 'DELETE'}:
            if method == 'DELETE' and role != 'admin':
                return response(403, {'error': 'Somente o Admin pode excluir questões'})
            item = table.get_item(Key={'id': question_id}).get('Item')
            if not item or 'question' not in item:
                return response(404, {'error': 'Questão não encontrada'})
            if not allowed(role, exams.get(item.get('simuladoId', 'A'), {'access': 'admin'})['access']):
                return response(403, {'error': 'Sem acesso a esta questão'})
            if method == 'DELETE':
                table.delete_item(Key={'id': question_id})
                return response(200, {'message': 'Questão excluída'})
            return response(200, shuffle(item))
        return response(404, {'error': 'Rota não encontrada'})
    except (PermissionError, cognito.exceptions.NotAuthorizedException):
        return response(401, {'error': 'Sessão inválida ou expirada'})
    except (ValueError, TypeError):
        return response(400, {'error': 'Dados inválidos'})
    except Exception:
        return response(500, {'error': 'Erro interno no servidor'})
