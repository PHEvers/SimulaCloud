import importlib.util
import json
import sys
import types
import unittest
from unittest.mock import MagicMock

fake = MagicMock()
sys.modules['boto3'] = fake
spec = importlib.util.spec_from_file_location('api', 'lambda/lambda_function.py')
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)
api.cognito.exceptions.NotAuthorizedException = type('NotAuthorizedException', (Exception,), {})

class Permissions(unittest.TestCase):
    def setUp(self):
        self.items = {'qA': {'id': 'qA', 'question': 'A', 'options': ['x','y'], 'correctIndex': 0}, 'qC': {'id': 'qC', 'question': 'C', 'options': ['x','y'], 'simuladoId': 'C', 'correctIndex': 0}}
        api.table = MagicMock()
        api.table.get_item.side_effect = lambda Key: {'Item': self.items[Key['id']]} if Key['id'] in self.items else {}
        api.table.scan.return_value = {'Items': list(self.items.values())}
    def call(self, role, method, path, body=None, query=None, id=None):
        api.identity = lambda event: (role, 'test')
        return api.lambda_handler({'httpMethod': method, 'path': path, 'body': json.dumps(body), 'queryStringParameters': query, 'pathParameters': {'id': id} if id else {}}, None)
    def test_matrix(self):
        for role, expected in [('visitor', ['A']), ('basico', ['A','B']), ('colaborador', ['A','B']), ('admin', ['A','B','C'])]:
            self.assertEqual([e['id'] for e in json.loads(self.call(role,'GET','/simulados')['body'])], expected)
            for exam in ['A','B','C']:
                self.assertEqual(self.call(role,'GET','/questions',query={'simulado':exam})['statusCode'], 200 if exam in expected else 403)
    def test_direct_question_is_protected(self):
        self.assertEqual(self.call('colaborador','GET','/questions/qC',id='qC')['statusCode'],403)
        self.assertEqual(self.call('admin','GET','/questions/qC',id='qC')['statusCode'],200)
    def test_writes(self):
        body = {'question':'Test','options':['x','y'],'correctIndex':0}
        for role in ['visitor','basico','colaborador','admin']:
            self.assertEqual(self.call(role,'POST','/questions',body)['statusCode'],201 if role in ['admin','colaborador'] else 403)
            self.assertEqual(self.call(role,'POST','/simulados',{'id':'A','access':'admin'})['statusCode'],200 if role == 'admin' else 403)
            self.assertEqual(self.call(role,'DELETE','/questions/qA',id='qA')['statusCode'],200 if role == 'admin' else 403)
        self.assertEqual(self.call('colaborador','POST','/questions',{**body,'simuladoId':'C'})['statusCode'],403)
        self.assertEqual(self.call('admin','POST','/questions',{**body,'correctIndex':9})['statusCode'],400)

if __name__ == '__main__': unittest.main()
