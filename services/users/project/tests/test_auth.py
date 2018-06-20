import json

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

class TestAuthBlueprint(BaseTestCase):
    
    def test_user_registration(self):
        response = self.client.post(
            '/auth/register',
            data = json.dumps({
                'email' : 'test6@test.com',
            }),
            content_type = 'application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Successfully registered.')
        self.assertTrue(data['auth_token'])
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 201)

    def test_user_registration_duplicate_email(self):
        add_user('test7@test.com')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data = json.dumps({
                    'email' : 'test7@test.com'
                }),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That user already exists.',data['message']
            )
            self.assertIn('fail',data['status'])

    def test_user_registration_invalid_json(self):
        with self.client :
            response = self.client.post(
                '/auth/register',
                data = json.dumps({}),
                content_type = 'application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code,400)
            self.assertIn('Invalid payload',data['message'])
            self.assertIn('fail',data['status'])
    
    def test_user_registration_invalid_json_keys_no_email(self):
        with self.client:
            response = self.client.post(
                '/auth/register',
                data = json.dumps({}),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code,400)
            self.assertIn('Invalid payload',data['message'])
            self.assertIn( 'fail', data['status'])
