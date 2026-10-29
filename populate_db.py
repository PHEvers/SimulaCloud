import json
import os
import sys
import boto3
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

def populate_via_boto3(table_name, questions_file):
    """Insere todas as questões em lote diretamente no DynamoDB via Boto3"""
    print(f"📦 Populando DynamoDB via Boto3 (Tabela: {table_name})...")
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    with open(questions_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    count = 0
    with table.batch_writer() as batch:
        for q in questions:
            batch.put_item(Item=q)
            count += 1
            if 'question' in q:
                print(f"  [+] Inserida questão: {q['id']} - [{q.get('domain', 'sem domínio')}]")
            else:
                print(f"  [+] Inserida configuração: {q['id']}")
            
    print(f"\n✅ Sucesso! {count} itens gravados na tabela '{table_name}'.")

def populate_via_api(api_url, questions_file):
    """Envia as questões via requisições HTTP POST para o API Gateway"""
    endpoint = api_url.rstrip('/') + '/questions'
    print(f"🌐 Populando DynamoDB via API Gateway ({endpoint})...")
    
    with open(questions_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    count = 0
    for q in questions:
        data = json.dumps(q, ensure_ascii=False).encode('utf-8')
        req = Request(endpoint, data=data, headers={'Content-Type': 'application/json'}, method='POST')
        try:
            with urlopen(req) as resp:
                if resp.status in (200, 201):
                    count += 1
                    print(f"  [+] POST {q['id']} - Sucesso")
        except (HTTPError, URLError) as e:
            print(f"  [-] Erro ao enviar {q['id']}: {e}")
            
    print(f"\n✅ Sucesso! {count} de {len(questions)} questões enviadas via API.")

if __name__ == '__main__':
    json_path = sys.argv[1] if len(sys.argv) > 1 else 'aws-clf-c02-questions.json'
    
    if not os.path.exists(json_path):
        print(f"❌ Arquivo JSON não encontrado no caminho: {json_path}")
        print("Certifique-se de que o arquivo 'aws-clf-c02-questions.json' está na mesma pasta.")
        sys.exit(1)
        
    # Identifica o destino (padrão: nome da tabela no DynamoDB)
    target = sys.argv[2] if len(sys.argv) > 2 else os.environ.get('TABLE_NAME', 'simulado-aws-questions-dev')
    
    if target.startswith('http://') or target.startswith('https://'):
        populate_via_api(target, json_path)
    else:
        populate_via_boto3(target, json_path)
