import unittest 

from sqlalchemy.exc import IntegrityError
from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

class TestUserModel(BaseTestCase):

    def test_add_user(self):
        user = add_user('test1@test.com')
        db.session.add(user)
        db.session.commit()
        self.assertTrue(user.id)
        self.assertEqual(user.email,'test1@test.com')
    
    def test_add_user_duplicate_email(self):
        user = add_user('test2@test.com')
        db.session.add(user)
        db.session.commit()
        duplicate_user = User(
            email = 'test2@test.com',
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError,db.session.commit)

    # def test_to_json(self):
    #     user = add_user('test3@test.com')
    #     db.session.add(user)
    #     db.session.commit()
    #     self.assertTrue(isinstance(user.to_json(),dict))

    def test_encode_auth_token(self):
        user = add_user('test4@test.com')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token,bytes))
    
    def test_decode_auth_token(self):
        user = add_user('test5@test.com')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token,bytes))
        self.assertEqual(User.decode_auth_token(auth_token),user.id)

if __name__ == '__main__':
    unittest.main()